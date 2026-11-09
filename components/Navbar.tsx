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
    <header className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff1e42] to-[#99001b] flex items-center justify-center shadow-neon-sm group-hover:shadow-neon transition-all duration-300">
            <span className="text-white font-black text-xl tracking-tighter">
              A
            </span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Ani<span className="text-[#ff1e42]">Verse</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-[#ff1e42] drop-shadow-[0_0_8px_rgba(255,30,66,0.6)]"
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
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm flex items-center gap-2 transition-all"
          >
            <span>Ara...</span>
            <kbd className="text-xs px-1.5 py-0.5 rounded bg-black/40 text-zinc-400">
              /
            </kbd>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl glass-red text-white text-sm font-semibold hover:bg-[#ff1e42]/25 transition-all"
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
                className="px-5 py-2.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-white text-sm font-semibold shadow-neon-sm hover:shadow-neon transition-all duration-300"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 text-zinc-200 hover:text-white"
          aria-label="Menü"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 space-y-3">
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
          <div className="pt-2 border-t border-white/10 flex gap-3">
            {session?.user ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full py-2.5 rounded-xl bg-[#ff1e42] text-white font-semibold text-sm"
              >
                Çıkış Yap
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#ff1e42] text-white text-sm font-semibold"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
