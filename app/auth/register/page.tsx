"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kayıt sırasında bir hata oluştu.");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Sunucu hatası oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#ff1e42] mx-auto flex items-center justify-center shadow-neon mb-4">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Yeni Hesap Oluştur
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            AniVerse dünyasına ücretsiz katılın
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
              Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kullanıcı adınız"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
            />
          </div>

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
              Şifre (En az 6 karakter)
            </label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/auth/login"
            className="text-[#ff1e42] font-bold hover:underline"
          >
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
