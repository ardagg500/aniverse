"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isLogin) {
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          setError(regData.error || "Kayıt sırasında bir hata oluştu.");
          setLoading(false);
          return;
        }
      }

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
    } catch {
      setError("Sunucu hatası oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* ===================================================================== */}
      {/* ODAKLANMIŞ KOSMİK NEBULA & KARA DELİK ARKA PLAN EFEKTİ                 */}
      {/* ===================================================================== */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        {/* Dönen Akreasyon Diski */}
        <div className="w-[520px] h-[520px] rounded-full blackhole-disk opacity-35 animate-spin-very-slow" />
        {/* Ortadaki Kara Delik Çekirdeği */}
        <div className="absolute w-[240px] h-[240px] rounded-full bg-[#030307] shadow-[0_0_60px_20px_rgba(0,0,0,1)] border border-red-500/20" />
        {/* Neon Kırmızı ve Mor Nebula Işıması */}
        <div className="absolute w-[640px] h-[640px] rounded-full cosmic-glow-red blur-3xl opacity-70 animate-pulse-slow" />
        <div className="absolute w-[540px] h-[540px] rounded-full cosmic-glow-purple blur-3xl opacity-60 animate-pulse-slower" />
      </div>

      {/* ===================================================================== */}
      {/* GLASSMORPHISM FORM KARTI                                             */}
      {/* ===================================================================== */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/15 p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_35px_rgba(255,30,66,0.18)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-purple-600 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(255,30,66,0.5)] mb-4">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isLogin ? "Tekrar Hoş Geldiniz" : "Yeni Hesap Oluştur"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLogin
              ? "AniVerse hesabınıza giriş yapın"
              : "AniVerse dünyasına ücretsiz katılın"}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
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
                className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 backdrop-blur-md focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(255,30,66,0.4)] transition-all duration-300"
              />
            </div>
          )}

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
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 backdrop-blur-md focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(255,30,66,0.4)] transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 backdrop-blur-md focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(255,30,66,0.4)] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-50 text-white font-bold text-sm shadow-[0_0_25px_rgba(255,30,66,0.5)] hover:shadow-[0_0_35px_rgba(255,30,66,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            {loading
              ? "İşleniyor..."
              : isLogin
              ? "Giriş Yap"
              : "Kayıt Ol"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
          <Link
            href={isLogin ? "/auth/register" : "/auth/login"}
            className="text-red-400 font-bold hover:text-red-300 hover:underline transition-colors"
          >
            {isLogin ? "Hemen Kayıt Olun" : "Giriş Yapın"}
          </Link>
        </p>
      </div>
    </div>
  );
}
