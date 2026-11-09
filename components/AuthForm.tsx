"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen Giriş Yap (login) ve Kayıt Ol (register) formlarını oluşturur.
// Form kutusu rengini, input ve buton stillerini buradan değiştirebilirsiniz.
// ============================================================================

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
    /* GELECEK MODEL İÇİN: Form dış kart tasarımı */
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl bg-[#111118] border border-zinc-800 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#ff1e42] mx-auto flex items-center justify-center mb-4">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isLogin ? "Tekrar Hoş Geldiniz" : "Yeni Hesap Oluştur"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLogin
              ? "AniVerse hesabınıza giriş yapın"
              : "AniVerse dünyasına ücretsiz katılın"}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* GELECEK MODEL İÇİN: Form inputları ve gönderim butonu */}
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
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
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
              className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
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
              className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] disabled:opacity-50 text-white font-bold text-sm transition-colors"
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
            className="text-[#ff1e42] font-bold hover:underline"
          >
            {isLogin ? "Hemen Kayıt Olun" : "Giriş Yapın"}
          </Link>
        </p>
      </div>
    </div>
  );
}
