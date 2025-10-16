"use client";
import Link from "next/link";
import Image from "next/image";

export default function HomeLogo() {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2 group">
        <Image
          src="/logo.jpg" // 🔸 logonu buraya koy (public klasörüne)
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full border border-white/40 hover:scale-105 transition-transform"
        />
        <span className="text-white/90 group-hover:text-white font-semibold text-sm">
          Ana Sayfa
        </span>
      </Link>
    </div>
  );
}
