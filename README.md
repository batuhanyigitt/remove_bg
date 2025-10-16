# 🧭 REMOVE_BG UYGULAMASI — TAM KURULUM REHBERİ

Allianz etkinlik kiosk sistemi için geliştirilen, **fotoğraf çekme – arka plan kaldırma – çerçeve ekleme – QR kod üretme – yazdırma** özelliklerine sahip bir uygulamadır.  
Uygulama tek bir klasör içinde çalışır: içinde **Python backend kodları** ve **Next.js frontend dosyaları** bulunur.

---

## ⚙️ 1️⃣ GEREKLİ YAZILIMLARIN YÜKLENMESİ

Bu adımlar yalnızca **ilk kurulum** içindir.  
Bir kere yapılınca tekrar gerekmez.

---

## 💻 1.1 Python Kurulumu

### 🪟 **Windows:**
- Python indir: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Kurulumda **“Add Python to PATH” kutusunu mutlaka işaretle**  
- Ardından terminali aç ve kontrol et:
  ```bash
  python --version
  ```
  Örnek çıktı: `Python 3.11.7`

### 🍎 **Mac (macOS):**
macOS’ta genelde Python yüklüdür. Kontrol et:
```bash
python3 --version
```
Yüklü değilse Homebrew ile kur:
```bash
brew install python3
```

---

## ⚙️ 1.2 Node.js ve Yarn Kurulumu

Bu kısım **frontend (arayüz)** tarafı içindir.

### Adımlar (Windows & Mac ortak):

1️⃣ Node.js indir:  
👉 [https://nodejs.org/](https://nodejs.org/)  
(LTS sürümünü indir — örnek: **v20.x**)

2️⃣ Terminale gir:
```bash
node -v
```
Çıktı örneği: `v20.11.0`

3️⃣ Ardından Yarn yükle:
```bash
npm install --global yarn
```

4️⃣ Kontrol et:
```bash
yarn -v
```
Örnek çıktı: `1.22.21`

---

# 📦 2️⃣ PROJEYİ İNDİRME VE KLASÖR YAPISI

Terminal (veya Komut İstemi) aç:

```bash
cd Desktop
git clone https://github.com/batuhanyigitt/remove_bg.git
cd remove_bg
```

📁 Artık bu klasörün içinde şu yapıyı görmelisin:
```
remove_bg/
 ├── backend/
 │    ├── server.py
 │    ├── requirements.txt
 │    └── ...
 ├── public/
 ├── pages/
 ├── components/
 ├── package.json
 ├── next.config.js
 └── README.md
```

> Eğer `frontend` klasörü yoksa sorun değil — zaten tüm React/Next.js kodları **ana klasörün içinde** çalışacak.

---

# 🧠 3️⃣ BACKEND (PYTHON) KURULUMU

Backend, fotoğrafı işler, arka planı siler ve QR kodu oluşturur.

### 3.1 Sanal Ortam (Virtual Env) Kur
#### 🪟 Windows:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

#### 🍎 Mac:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

> Bu işlem “izole Python ortamı” oluşturur — sistem Python’unu etkilemez.

### 3.2 Gerekli Kütüphaneleri Yükle
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install "numpy<2" --force-reinstall
```

✅ Bu, NumPy 2.x hatalarını (örneğin `_ARRAY_API not found`) **kalıcı olarak engeller.**

### 3.3 Backend’i Başlat
```bash
python server.py
```

🟢 Eğer şu yazıyı görüyorsan her şey hazır:
```
✅ Model önceden yüklendi
Server is running ✅
```

---

# 💻 4️⃣ FRONTEND (KULLANICI ARAYÜZÜ)

Bu kısım tarayıcıda çalışan arayüzdür — kamera, çekim, butonlar, QR gösterimi vb.

### 4.1 Terminalde (yeni sekme aç):
```bash
cd ~/Desktop/remove_bg
yarn install
```

> Bu, `package.json` içindeki tüm React/Next.js bağımlılıklarını yükler.

### 4.2 Frontend’i Başlat
```bash
yarn dev
```

Ekranda şunu görmelisin:
```
▲ Next.js 15.x started
Local: http://localhost:3000
```

Tarayıcıdan şu adrese git:
👉 [http://localhost:3000](http://localhost:3000)

---

# 🧪 5️⃣ TEST AKIŞI

1️⃣ Kamera izni isteyecek → **İzin ver**  
2️⃣ Fotoğraf çek → “Allianz Çerçevesiyle Oluştur”  
3️⃣ Görsel işlenecek → QR kod eklenecek  
4️⃣ “🖨️ Yazdır” →  
   - macOS’ta **test modunda**, terminalde log basar  
   - Windows’ta **gerçek yazıcıya gönderir**  

---

# 🖨️ YAZICI SİSTEMİ (GENEL AÇIKLAMA)

| Sistem | Çalışma Şekli |
|--------|----------------|
| **macOS** | Test modunda çalışır (`lp` komutu ile terminalde gösterir) |
| **Windows (Kiosk)** | Varsayılan yazıcıya doğrudan gönderir (örnek: Epson / Zebra) |

Yazıcı bağlantısı:
- USB veya ağ (LAN/Wi-Fi) olabilir  
- Windows’ta “Default Printer” olarak ayarlamak yeterlidir

---

# ⚠️ SIK KARŞILAŞILAN HATALAR VE ÇÖZÜMLER

| Hata | Sebep | Çözüm |
|------|--------|--------|
| `_ARRAY_API not found` | NumPy 2.x sürümü yüklü | `pip install "numpy<2" --force-reinstall` |
| `onnxruntime` hatası | Model kütüphanesi uyumsuz | `pip uninstall onnxruntime rembg -y && pip install rembg==2.0.50` |
| `Command not found: yarn` | Yarn yüklü değil | `npm install --global yarn` |
| Kamera açılmıyor | Tarayıcı izinleri kapalı | Chrome > Site Settings > Kamera > Allow |
| Yazıcı çalışmıyor | Varsayılan yazıcı yok | Windows Ayarları > Yazıcılar > Varsayılan seç |

---

# ✅ TAM TEST ADIMLARI

1️⃣ `python server.py` → backend başlat  
2️⃣ Yeni terminal → `yarn dev` → frontend başlat  
3️⃣ [http://localhost:3000](http://localhost:3000)  
4️⃣ Kamera → Fotoğraf çek  
5️⃣ “Allianz Çerçevesiyle Oluştur”  
6️⃣ QR kod görüntülenir  
7️⃣ “🖨️ Yazdır” → test veya gerçek baskı  

---

# 📘 NOTLAR
- Kiosk cihazı dikey (1080x1920) çalışıyorsa uygulama otomatik sığar (`max-h-[80vh]`)  
- macOS test modunda çalışabilir, gerçek baskı yalnızca Windows cihazda yapılır  
- Tüm bağımlılıklar `requirements.txt` ve `package.json` dosyalarındadır  








This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
