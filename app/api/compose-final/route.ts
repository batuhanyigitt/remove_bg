import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { personImage } = await req.json();

    if (!personImage) {
      return NextResponse.json({ error: "Resim eksik" }, { status: 400 });
    }

    const TARGET_W = 1200;
    const TARGET_H = 1800;

    // Allianz arka planını yükle
    const bgPath = path.join(process.cwd(), "public", "frames", "allianz_frame.png");
    const background = await sharp(bgPath)
      .resize(TARGET_W, TARGET_H, { fit: "cover" })
      .toBuffer();

    // Arka planı silinmiş kişi (şeffaf PNG)
    const personBuffer = Buffer.from(personImage.split(",")[1], "base64");

    // Birleştir: Allianz arkada, kişi üstte
    const composed = await sharp(background)
      .composite([{ input: personBuffer, blend: "over" }])
      .png()
      .toBuffer();

    const base64Image = composed.toString("base64");
    return NextResponse.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error("Compose error:", error);
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
