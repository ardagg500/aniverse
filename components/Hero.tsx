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
    <section className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <Image
        src={bannerSrc}
        alt={anime.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-[#07070b]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-black/40" />

      <div className="relative z-10 h-full max-w-3xl flex flex-col justify-end p-6 sm:p-12 lg:p-16">
        <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full glass-red text-xs font-bold uppercase tracking-wider text-[#ff1e42] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ff1e42] animate-ping" />
          Öne Çıkan Anime
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          {anime.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
            ★ {anime.rating.toFixed(1)}
          </span>
          {anime.year && (
            <span className="px-2.5 py-1 rounded-lg bg-white/10">
              {anime.year}
            </span>
          )}
          {anime.season && (
            <span className="px-2.5 py-1 rounded-lg bg-white/10">
              {anime.season}
            </span>
          )}
          {anime.status && (
            <span className="px-2.5 py-1 rounded-lg bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-red-200">
              {anime.status}
            </span>
          )}
          {anime.genres?.map((g) => (
            <span
              key={g}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300"
            >
              {g}
            </span>
          ))}
        </div>

        {anime.synopsis && (
          <p className="mt-4 text-sm sm:text-base text-zinc-300 line-clamp-3 max-w-2xl leading-relaxed">
            {anime.synopsis}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/watch/${anime.slug}/1`}
            className="px-7 py-3.5 rounded-2xl bg-[#ff1e42] hover:bg-[#e50914] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-neon transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Hemen İzle
          </Link>
          <Link
            href={`/anime/${anime.slug}`}
            className="px-7 py-3.5 rounded-2xl glass hover:bg-white/15 text-white font-semibold text-sm sm:text-base transition-all duration-300"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
