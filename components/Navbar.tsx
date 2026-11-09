"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";

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
    <header className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-105 transition-all">
            <span className="text-white font-black text-xl tracking-tighter">A</span>
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Ani<span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]">Verse</span>
          </span>
        </Link>

        {/* Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-semibold transition-all duration-200 ${
                  active ? "text-white" : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
                {/* Aktif link neon kırmızı alt çizgi ve parlama */}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1),0_0_20px_rgba(239,68,68,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sağ Taraf */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white text-sm transition-all"
          >
            Anime Ara...
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-red-500/30 text-white text-sm font-semibold shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all"
              >
                {session.user.name || session.user.email?.split("@")[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 text-xs text-zinc-300 hover:text-red-300 transition-all"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-200 hover:text-white transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobil Menü Butonu */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200"
          aria-label="Menü"
        >
          ☰
        </button>
      </div>

      {/* Mobil Açılır Menü */}
      {mobileOpen && (
        <div className="md:hidden bg-black/60 backdrop-blur-2xl border-t border-white/10 px-6 py-5 space-y-4">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-1.5 text-base font-medium ${
                  active ? "text-red-400 font-bold" : "text-zinc-200 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
