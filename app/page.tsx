"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function HomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (!name.trim()) return alert("Lütfen adınızı girin ✍️");
    localStorage.setItem("userName", name);
    router.push("/camera");
  };

  const handleRetry = () => {
    setName("");
    router.push("/");
  };

  const onChange = (input: string) => setName(input);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-6">
      {/* 🔹 Logo (tıklanabilir) */}
      <img
        src="/logo.jpg"
        alt="Allianz"
        className="w-36 mb-6 hover:opacity-90 cursor-pointer transition"
        onClick={() => router.push("/")}
      />

      <h1 className="text-3xl font-bold mb-4">Adınızı Girin</h1>

      {/* 🔹 İsim Input */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-6 py-4 rounded-lg text-black text-2xl mb-4 w-80 text-center"
        placeholder="İsim Soyisim"
        autoFocus
      />

      {/* 🔹 Başla / Tekrar Dene Butonları */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleStart}
          className="bg-green-500 px-8 py-4 text-2xl font-bold rounded-full hover:bg-green-600 active:scale-95 transition"
        >
          Başla 🚀
        </button>
      </div>

      {/* 🧠 Türkçe Sanal Klavye */}
      <div className="mt-4 bg-gray-100 p-4 rounded-xl shadow-inner w-full max-w-md">
        <Keyboard
          onChange={onChange}
          layout={{
            default: [
              "Q W E R T Y U I O P Ğ Ü",
              "A S D F G H J K L Ş İ",
              "Z X C V B N M Ö Ç {bksp}",
              "{space}",
            ],
          }}
          display={{
            "{bksp}": "⌫",
            "{space}": "Boşluk",
          }}
          buttonTheme={[
            {
              class:
                "bg-white text-black text-xl rounded-md m-1 px-2 py-3 hover:bg-gray-200 active:scale-95",
              buttons:
                "Q W E R T Y U I O P Ğ Ü A S D F G H J K L Ş İ Z X C V B N M Ö Ç {bksp} {space}",
            },
          ]}
        />
      </div>
    </main>
  );
}
