import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Resim eksik" }, { status: 400 });
    }

    // ✅ ENV üzerinden backend adresini oku
    const backend = process.env.INTERNAL_BG_URL;
    if (!backend) {
      return NextResponse.json(
        { error: "INTERNAL_BG_URL tanımlı değil" },
        { status: 500 }
      );
    }

    // ✅ Flask endpoint’i oluştur
    const apiUrl = `${backend}/remove-bg`;

    // ✅ Flask’a POST isteği gönder
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const text = await res.text();

    // ❌ Flask hata döndürürse
    if (!res.ok) {
      console.error("❌ Flask Hatası:", text);
      return NextResponse.json({ error: text }, { status: res.status });
    }

    // ✅ Flask JSON döndürürse direkt ilet
    return new NextResponse(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Remove BG Error:", err);
    const message =
      err instanceof Error ? err.message : "Arka plan temizleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
