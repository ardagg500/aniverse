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
      {/* HAVALI, DÖNEN VE PARLAYAN NEBULA / KARA DELİK EFEKTİ                  */}
      {/* ===================================================================== */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        {/* Dönen Dış Nebula Akreasyon Halkası */}
        <div className="w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-purple-600/30 via-red-600/25 to-blue-500/25 blur-[75px] animate-spin-nebula" />
        
        {/* İçte Parlayan Kara Delik Halkası */}
        <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-r from-red-600/40 via-purple-700/30 to-rose-500/40 blur-[50px] animate-pulse" />
        
        {/* Kara Delik Olay Ufku Çekirdeği */}
        <div className="absolute w-[220px] h-[220px] rounded-full bg-[#05040a]/90 border border-purple-500/30 shadow-[0_0_80px_20px_rgba(0,0,0,0.9)]" />
      </div>

      {/* ===================================================================== */}
      {/* ORTADAKİ CAM KART                                                    */}
      {/* ===================================================================== */}
      <div className="relative w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-purple-600 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)] mb-4">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {isLogin ? "Tekrar Hoş Geldiniz" : "Yeni Hesap Oluştur"}
          </h1>
          <p className="text-sm text-zinc-300 mt-1">
            {isLogin
              ? "AniVerse hesabınıza giriş yapın"
              : "AniVerse dünyasına ücretsiz katılın"}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold backdrop-blur-md">
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
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 backdrop-blur-md focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300"
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
              className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 backdrop-blur-md focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300"
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
              className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 backdrop-blur-md focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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
