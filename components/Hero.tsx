import Image from "next/image";
import Link from "next/link";
import React from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu dosya Ana Sayfa üst vitrin (Hero) bileşenidir.
// Başlık boyutunu, buton renklerini ve arka plan karartmasını buradan
// değiştirebilirsiniz.
// ============================================================================

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
    /* GELECEK MODEL İÇİN: Hero kutusu yüksekliğini ve kenar yuvarlaklığını buradan değiştirebilirsiniz */
    <section className="relative w-full h-[500px] sm:h-[560px] rounded-3xl overflow-hidden border border-zinc-800 bg-[#0d0d14]">
      <Image
        src={bannerSrc}
        alt={anime.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* GELECEK MODEL İÇİN: Karartma (gradient) renklerini buradan değiştirebilirsiniz */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-[#07070b]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-black/40" />

      <div className="relative z-10 h-full max-w-3xl flex flex-col justify-end p-6 sm:p-12">
        {/* GELECEK MODEL İÇİN: Üst etiket (Öne Çıkan Anime) */}
        <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-xs font-bold uppercase tracking-wider text-[#ff1e42] mb-4">
          Öne Çıkan Anime
        </div>

        {/* GELECEK MODEL İÇİN: Anime ana başlığı */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {anime.title}
        </h1>

        {/* GELECEK MODEL İÇİN: Puan, yıl, sezon ve tür rozetleri */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
            ★ {anime.rating.toFixed(1)}
          </span>
          {anime.year && (
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              {anime.year}
            </span>
          )}
          {anime.season && (
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              {anime.season}
            </span>
          )}
          {anime.status && (
            <span className="px-2.5 py-1 rounded-lg bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-red-200">
              {anime.status}
            </span>
          )}
        </div>

        {anime.synopsis && (
          <p className="mt-4 text-sm sm:text-base text-zinc-300 line-clamp-3 max-w-2xl">
            {anime.synopsis}
          </p>
        )}

        {/* GELECEK MODEL İÇİN: Aksiyon butonlarının renklerini buradan değiştirebilirsiniz */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/watch/${anime.slug}/1`}
            className="px-7 py-3.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-white font-bold text-sm sm:text-base transition-colors"
          >
            ▶ Hemen İzle
          </Link>
          <Link
            href={`/anime/${anime.slug}`}
            className="px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-sm sm:text-base transition-colors"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
