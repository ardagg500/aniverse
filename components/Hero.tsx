import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeroProps {
  anime: {
    title: string;
    slug: string;
    synopsis?: string | null;
    bannerImage?: string | null;
    coverImage?: string | null;
    rating: number;
    year?: number | null;
    season?: string | null;
    status?: string | null;
    genres?: string[];
  };
}

export default function Hero({ anime }: HeroProps) {
  const rawImg = anime.bannerImage || anime.coverImage;
  const bannerSrc =
    rawImg && rawImg.startsWith("http")
      ? rawImg
      : rawImg
      ? `/${rawImg.replace(/^\//, "")}`
      : "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80";

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center p-6 sm:p-12">
      {/* Arka Plan Görseli */}
      <Image
        src={bannerSrc}
        alt={anime.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
      />
      
      {/* Karartma Katmanları */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030307] via-[#030307]/75 to-[#030307]/40" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030307]/50 to-[#030307]" />

      {/* Ortalanmış Glassmorphism Kapsayıcı */}
      <div className="relative z-10 w-full max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-black/45 backdrop-blur-2xl border border-white/15 shadow-[0_0_50px_rgba(255,30,66,0.18)] flex flex-col items-center">
        {/* Üst Rozet */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-xs font-bold uppercase tracking-wider text-red-400 mb-5 shadow-[0_0_15px_rgba(255,30,66,0.3)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Öne Çıkan Anime
        </div>

        {/* Ortalanmış Büyük ve Etkileyici Başlık */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          {anime.title}
        </h1>

        {/* Bilgi Rozetleri */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold backdrop-blur-md">
            ★ {anime.rating.toFixed(1)}
          </span>
          {anime.year && (
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-zinc-200">
              {anime.year}
            </span>
          )}
          {anime.season && (
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-zinc-200">
              {anime.season}
            </span>
          )}
          {anime.status && (
            <span className="px-3 py-1 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-300 font-medium">
              {anime.status}
            </span>
          )}
          {anime.genres?.map((g) => (
            <span
              key={g}
              className="px-3 py-1 rounded-xl bg-purple-500/15 backdrop-blur-md border border-purple-500/30 text-purple-200"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Özet */}
        {anime.synopsis && (
          <p className="mt-5 text-sm sm:text-base text-zinc-300 line-clamp-3 max-w-2xl leading-relaxed">
            {anime.synopsis}
          </p>
        )}

        {/* Aksiyon Butonları */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/watch/${anime.slug}/1`}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(255,30,66,0.55)] hover:shadow-[0_0_40px_rgba(255,30,66,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            ▶ Hemen İzle
          </Link>
          <Link
            href={`/anime/${anime.slug}`}
            className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-semibold text-sm sm:text-base hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
