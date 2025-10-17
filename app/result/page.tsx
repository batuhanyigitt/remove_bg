"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("photo");
    if (saved) setImage(saved);
  }, []);

  // ✅ Artık filename saklayacağız
  const handleCompose = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      // 👇 Kullanıcının ismini localStorage'dan al
      const userName = localStorage.getItem("userName") || "Ziyaretçi";

      // Backend'e gönder
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, name: userName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Birleştirme başarısız oldu.");

      if (!data.image) throw new Error("Final görsel alınamadı.");

      // ✅ Görsel ve QR set et
      setFinalImage(data.image);
      if (data.qr) setQrImage(data.qr);

      // ✅ Dosya adını localStorage'a yaz (yazdırma için gerekli)
      if (data.filename) {
        localStorage.setItem("lastSavedFile", data.filename);
      }

    } catch (err) {
      console.error("Compose error:", err);
      setError("Birleştirme hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">🎨 Allianz Çerçevesi</h1>

      {/* Henüz işlem yapılmadıysa */}
      {!finalImage && image && (
        <>
          <img
            src={image}
            alt="Original"
            className="max-w-xs rounded-lg mb-4 shadow-lg"
          />
          <button
            onClick={handleCompose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "İşleniyor..." : "Allianz Çerçevesiyle Oluştur"}
          </button>
        </>
      )}

      {/* Sonuç kısmı */}
      {finalImage && (
        <div className="flex flex-col items-center gap-4 mt-6">
          {/* Final fotoğraf */}
          <img
            src={finalImage}
            alt="Final"
            className="rounded-lg border shadow-md w-auto max-w-[90vw] max-h-[85vh] h-auto object-contain bg-white"
          />


          {/* 📱 QR Kod */}
          {qrImage && (
            <div className="flex flex-col items-center mt-4">
              <p className="text-gray-700 mb-2 font-medium">
                📱 Telefonunuzla tarayarak galeri bağlantısını açın:
              </p>
              <img
                src={qrImage}
                alt="QR Kod"
                className="w-48 h-48 border border-gray-300 rounded-lg bg-white p-2"
              />
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-4 mt-4">
            {/* 📥 İndir */}
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = finalImage;
                a.download = "allianz-photo.png";
                a.click();
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📥 İndir
            </button>

            {/* 🖨️ Yazdır */}
            <button
              onClick={async () => {
                try {
                  const filename = localStorage.getItem("lastSavedFile");
                  if (!filename) {
                    alert("⚠️ Dosya bulunamadı! Önce fotoğraf oluşturmalısınız.");
                    return;
                  }

                  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/print-photo`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filename }),
                  });

                  const data = await res.json();
                  if (res.ok) {
                    alert(data.message || "🖨️ Yazıcıya gönderildi!");
                  } else {
                    alert("❌ Yazdırma hatası: " + (data.error || "Bilinmeyen hata"));
                  }
                } catch (err) {
                  alert("⚠️ Backend bağlantı hatası (server açık mı?): " + err);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🖨️ Yazdır
            </button>

            {/* 🔁 Tekrar Dene */}
            <button
              onClick={() => {
                localStorage.removeItem("photo");
                localStorage.removeItem("userName");
                localStorage.removeItem("lastSavedFile");
                router.push("/");
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              🔁 Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {/* Durum mesajları */}
      {loading && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          İşleniyor...
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-medium">⚠️ {error}</p>
      )}
    </main>
  );
}
