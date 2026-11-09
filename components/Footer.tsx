import Link from "next/link";
import React from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu dosya alt bilgi (Footer) bileşenidir.
// Metinleri, linkleri ve arka plan renklerini güvenle düzenleyebilirsiniz.
// ============================================================================

export default function Footer() {
  return (
    /* GELECEK MODEL İÇİN: Footer arka plan ve kenarlık renklerini buradan değiştirebilirsiniz */
    <footer className="mt-24 border-t border-zinc-800 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* GELECEK MODEL İÇİN: Sol logo ve açıklama alanı */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ff1e42] flex items-center justify-center">
                <span className="text-white font-black text-base">A</span>
              </div>
              <span className="text-xl font-extrabold text-white">
                Ani<span className="text-[#ff1e42]">Verse</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-zinc-400 max-w-md">
              Yeni nesil 4K HDR anime izleme platformu. Kesintisiz ve yüksek
              kaliteli anime deneyimi.
            </p>
          </div>

          {/* GELECEK MODEL İÇİN: Footer navigasyon linkleri */}
          <div className="flex flex-wrap gap-8 text-sm text-zinc-400">
            <Link href="/" className="hover:text-[#ff1e42] transition-colors">
              Ana Sayfa
            </Link>
            <Link
              href="/search"
              className="hover:text-[#ff1e42] transition-colors"
            >
              Keşfet
            </Link>
            <Link
              href="/profile"
              className="hover:text-[#ff1e42] transition-colors"
            >
              Profilim
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AniVerse. Tüm hakları saklıdır.</p>
          <p className="mt-2 sm:mt-0">Next.js 14 • Prisma • Neon Postgres</p>
        </div>
      </div>
    </footer>
  );
}
