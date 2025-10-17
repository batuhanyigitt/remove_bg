import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remove Background",
  description: "AI Background Photo Booth App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white relative`}
      >
        {/* 🔹 Her sayfada sol üstte sabit logo */}
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.jpg" // ✅ kendi logonu buraya koy (örnek: Pegasus)
              alt="Ana Sayfa"
              width={42}
              height={42}
              className="rounded-full border border-white/30 hover:scale-105 transition-transform"
            />
            <span className="text-sm text-red/80 group-hover:text-red font-semibold tracking-wide">
              Ana Sayfa
            </span>
          </Link>
        </div>

        {/* 🔸 Sayfa içeriği */}
        <main>{children}</main>
      </body>
    </html>
  );
}
