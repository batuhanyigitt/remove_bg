"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // 🎥 Kamerayı başlat
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Kamera erişimi reddedildi!");
      }
    }
    startCamera();
  }, []);

  // 📸 Fotoğraf çek
  const takePhoto = async () => {
    setIsCapturing(true);

    // 3-2-1 Geri sayım
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }

    setCountdown(null);
    await new Promise((r) => setTimeout(r, 300));

    // Görseli al
    const canvas = document.createElement("canvas");
    if (!videoRef.current) return;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);

    localStorage.setItem("photo", imageData);
    window.location.href = "/result"; // Result sayfasına git
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative">
      {!photo && (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg" />

          {/* Geri sayım */}
          {countdown !== null && (
            <div className="absolute text-8xl font-bold text-white animate-pulse">
              {countdown}
            </div>
          )}

          {/* Buton */}
          {!isCapturing && (
            <button
              onClick={takePhoto}
              className="mt-4 px-6 py-3 bg-blue-600 rounded-lg text-lg hover:bg-blue-700"
            >
              📸 Fotoğraf Çek
            </button>
          )}
        </>
      )}
    </main>
  );
}
