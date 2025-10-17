import { NextResponse } from "next/server";

const BG_URL = process.env.BG_SERVER_URL!; // .env.local'daki URL

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Resim eksik" }, { status: 400 });
    }

    // Base64 formatını normalize et
    let imageBase64 = typeof image === "string" ? image : "";
    if (!imageBase64.startsWith("data:image")) {
      imageBase64 = `data:image/png;base64,${imageBase64}`;
    }

    // Flask backend’e istek
    const res = await fetch(BG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      throw new Error(`Yanıt JSON değil: ${text}`);
    }

    if (!res.ok) {
      throw new Error(data?.error || `Flask hata kodu: ${res.status}`);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ Remove BG Error:", err);
    const msg =
      err?.message || "Arka plan temizleme başarısız.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
