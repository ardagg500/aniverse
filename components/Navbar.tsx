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
    <header className="sticky top-0 z-50 w-full bg-[#030307]/75 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,30,66,0.4)] group-hover:shadow-[0_0_25px_rgba(255,30,66,0.7)] transition-all">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            Ani<span className="text-red-500">Verse</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "text-red-500 drop-shadow-[0_0_10px_rgba(255,30,66,0.7)]"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white text-sm transition-all"
          >
            Anime Ara...
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-white text-sm font-semibold shadow-[0_0_12px_rgba(255,30,66,0.25)]"
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold shadow-[0_0_20px_rgba(255,30,66,0.4)] hover:shadow-[0_0_30px_rgba(255,30,66,0.6)] transition-all"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-200"
          aria-label="Menü"
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#030307]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-zinc-200 hover:text-red-400 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
