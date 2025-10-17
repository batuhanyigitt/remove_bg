from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image, ImageDraw, ImageFont
import io, base64, os, time, qrcode, platform, subprocess
from dotenv import load_dotenv

# ------------------ ORTAM DEĞİŞKENLERİ ------------------
load_dotenv(dotenv_path=".env.local")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

LOCAL_TEST = os.getenv("LOCAL_TEST", "False").lower() == "true"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GALLERY_DIR = os.path.join(BASE_DIR, "gallery")
FRAME_PATH = os.path.join(BASE_DIR, "frames", "allianz_frame.png")
os.makedirs(GALLERY_DIR, exist_ok=True)

# ------------------ MODELİ ÖNCEDEN YÜKLE ------------------
session = new_session()
print("✅ Model önceden yüklendi")

# ------------------ ARKA PLAN SİLME ------------------
@app.route("/remove-bg", methods=["POST"])
def remove_bg():
    try:
        data = request.get_json(force=True)
        image_base64 = data.get("image")

        if not image_base64:
            return jsonify({"error": "Resim eksik"}), 400

        if "," in image_base64:
            image_data = base64.b64decode(image_base64.split(",")[1])
        else:
            image_data = base64.b64decode(image_base64)

        image = Image.open(io.BytesIO(image_data)).convert("RGBA")
        print("🧠 Model çalıştırılıyor...")
        output = remove(image, session=session)
        print("✅ Arka plan temizlendi")

        buffer = io.BytesIO()
        output.save(buffer, format="PNG")
        processed_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return jsonify({
            "image": f"data:image/png;base64,{processed_b64}"
        })
    except Exception as e:
        import traceback
        print("❌ Remove BG Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ------------------ FOTOĞRAF + FRAME + QR + GALERİ ------------------
@app.route("/compose", methods=["POST"])
def compose():
    try:
        data = request.get_json()
        image_base64 = data.get("image")
        user_name = data.get("name", "").strip()

        if not image_base64:
            return jsonify({"error": "Resim eksik"}), 400

        if "," in image_base64:
            image_data = base64.b64decode(image_base64.split(",")[1])
        else:
            image_data = base64.b64decode(image_base64)

        user_img = Image.open(io.BytesIO(image_data)).convert("RGBA")

        # Arka plan silme
        clean_img = remove(user_img, session=session)

        if not os.path.exists(FRAME_PATH):
            return jsonify({"error": "Çerçeve bulunamadı"}), 404

        frame = Image.open(FRAME_PATH).convert("RGBA")
        frame_w, frame_h = frame.size

        # Görseli yerleştir
        target_h = int(frame_h * 1.1)
        clean_img.thumbnail((frame_w, target_h))
        x_pos = (frame_w - clean_img.width) // 2
        y_pos = int(frame_h * 0.35)
        frame.alpha_composite(clean_img, dest=(x_pos, y_pos))

        # İsim yazısı
        if user_name:
            draw = ImageDraw.Draw(frame)
            font_paths = [
                "/System/Library/Fonts/Helvetica.ttc",
                "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            ]
            font_path = next((p for p in font_paths if os.path.exists(p)), None)
            font = ImageFont.truetype(font_path, int(frame_h * 0.06)) if font_path else ImageFont.load_default()
            bbox = draw.textbbox((0, 0), user_name, font=font)
            text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
            text_y = int(frame_h * 0.16)
            draw.text(((frame_w - text_w) // 2 + 2, text_y + 2), user_name, font=font, fill=(0, 100, 255, 120))
            draw.text(((frame_w - text_w) // 2, text_y), user_name, font=font, fill=(255, 255, 255, 255))

        # QR oluştur
        filename = f"{user_name.replace(' ', '_')}_{int(time.time())}.png"
        gallery_link = f"https://photobooth.metasoftco.com/gallery/{filename}"
        qr_img = qrcode.make(gallery_link).convert("RGBA")

        qr_size = int(frame_w * 0.15)
        qr_img = qr_img.resize((qr_size, qr_size))
        qr_x = frame_w - qr_size - 40
        qr_y = frame_h - qr_size - 40
        frame.alpha_composite(qr_img, dest=(qr_x, qr_y))

        # 💾 Görseli gallery klasörüne kaydet
        buffer = io.BytesIO()
        frame.save(buffer, format="PNG")
        local_path = os.path.join(GALLERY_DIR, filename)
        with open(local_path, "wb") as f:
            f.write(buffer.getvalue())
        print(f"💾 Kaydedildi: {local_path}")

        # Base64 olarak dön
        composed_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return jsonify({
            "image": f"data:image/png;base64,{composed_b64}",
            "gallery_url": gallery_link,
            "filename": filename
        })
    except Exception as e:
        print("❌ Compose Error:", e)
        return jsonify({"error": str(e)}), 500

# ------------------ FOTOĞRAFI YAZDIR ------------------
@app.route("/print-photo", methods=["POST"])
def print_photo():
    try:
        data = request.get_json()
        filename = data.get("filename")
        if not filename:
            return jsonify({"error": "Dosya adı eksik"}), 400

        image_path = os.path.join(GALLERY_DIR, filename)
        if not os.path.exists(image_path):
            return jsonify({"error": "Dosya bulunamadı"}), 404

        system = platform.system()

        if system in ["Darwin", "Linux"]:
            print(f"🧪 macOS/Linux ortamında test: {image_path}")
            subprocess.run(["lp", image_path])
        elif system == "Windows":
            import win32print
            import win32ui
            from PIL import ImageWin

            printer_name = win32print.GetDefaultPrinter()
            hdc = win32ui.CreateDC()
            hdc.CreatePrinterDC(printer_name)

            img = Image.open(image_path).convert("RGB")
            printable_area = hdc.GetDeviceCaps(8), hdc.GetDeviceCaps(10)
            img.thumbnail(printable_area)

            dib = ImageWin.Dib(img)
            hdc.StartDoc(image_path)
            hdc.StartPage()
            dib.draw(hdc.GetHandleOutput(), (0, 0, printable_area[0], printable_area[1]))
            hdc.EndPage()
            hdc.EndDoc()
            hdc.DeleteDC()
            print(f"🖨️ Yazıcıya gönderildi (Windows): {image_path}")

        return jsonify({"message": "🖨️ Yazdırma tamamlandı ✅"})

    except Exception as e:
        print("❌ Print Error:", e)
        return jsonify({"error": str(e)}), 500

# ------------------ GALERİ ------------------
@app.route("/gallery/<path:filename>")
def serve_gallery(filename):
    return send_from_directory(GALLERY_DIR, filename)

# ------------------ ANASAYFA ------------------
@app.route("/")
def home():
    return "Server is running ✅"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
