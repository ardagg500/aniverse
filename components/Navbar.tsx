"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu dosya sadece üst menü (Navbar) tasarımını içerir.
// Renkleri, buton stillerini veya menü aralıklarını güvenle değiştirebilirsiniz.
// ============================================================================

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/search", label: "Keşfet & Ara" },
    { href: "/search?sort=rating", label: "Trendler" },
    { href: "/profile", label: "Profilim" },
  ];

  return (
    /* GELECEK MODEL İÇİN: Navbar arka plan rengini ve border stilini buradan değiştirebilirsiniz */
    <header className="sticky top-0 z-50 w-full bg-[#0b0b12]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* GELECEK MODEL İÇİN: Logo tasarım alanı */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff1e42] flex items-center justify-center">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            Ani<span className="text-[#ff1e42]">Verse</span>
          </span>
        </Link>

        {/* GELECEK MODEL İÇİN: Masaüstü menü linklerinin renklerini buradan değiştirebilirsiniz */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-[#ff1e42]" : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* GELECEK MODEL İÇİN: Sağ taraf arama ve kullanıcı butonları tasarım alanı */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-sm transition-colors"
          >
            Anime Ara...
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-[#ff1e42]/15 border border-[#ff1e42]/40 text-white text-sm font-semibold"
              >
                {session.user.name || session.user.email?.split("@")[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-200 hover:text-white"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-white text-sm font-semibold transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobil Menü Butonu */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-zinc-900 text-zinc-200"
          aria-label="Menü"
        >
          ☰
        </button>
      </div>

      {/* GELECEK MODEL İÇİN: Mobil açılır menü tasarım alanı */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0b0b12] border-t border-zinc-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-zinc-200 hover:text-[#ff1e42] font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
