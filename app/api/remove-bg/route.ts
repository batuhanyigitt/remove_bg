import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Resim eksik" }, { status: 400 });
    }

    // ✅ Python backend URL
    const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL + "/remove-bg";
  

    // ✅ Flask server’a POST isteği gönder
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Flask response error: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Remove BG Error:", err);
    return NextResponse.json(
      { error: "Arka plan temizleme başarısız." },
      { status: 500 }
    );
  }
}
