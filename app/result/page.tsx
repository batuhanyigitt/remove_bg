"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("photo");
    if (saved) setImage(saved);
  }, []);

  const handleCompose = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const userName = localStorage.getItem("userName") || "Ziyaretçi";

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, name: userName }),
      });

      if (!res.ok) throw new Error("Birleştirme başarısız oldu.");
      const data = await res.json();

      if (data.filename) {
        localStorage.setItem("lastSavedFile", data.filename);
      }

      // Görseli ekranda göstermiyoruz — sadece işin bittiğini işaretliyoruz
      setDone(true);
    } catch (err) {
      console.error("Compose error:", err);
      alert("❌ Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-gray-900 text-center">
      {!done ? (
        <>
          <h1 className="text-3xl font-bold mb-6">📸 Allianz Çerçevesiyle Oluştur</h1>
          <button
            onClick={handleCompose}
            className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "İşleniyor..." : "Allianz Çerçevesiyle Oluştur"}
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">✅ Fotoğraf oluşturuldu</h1>
          <button
            onClick={() => {
              localStorage.removeItem("photo");
              localStorage.removeItem("userName");
              localStorage.removeItem("lastSavedFile");
              router.push("/");
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            🔁 Yeniden Dene!
          </button>
        </>
      )}
    </main>
  );
}
