"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#ff1e42] mx-auto flex items-center justify-center shadow-neon mb-4">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Tekrar Hoş Geldiniz
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            AniVerse hesabınıza giriş yapın
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              E-posta Adresi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@aniverse.com"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] disabled:opacity-50 text-white font-bold text-sm shadow-neon transition-all duration-300"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Hesabınız yok mu?{" "}
          <Link
            href="/auth/register"
            className="text-[#ff1e42] font-bold hover:underline"
          >
            Hemen Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  );
}
