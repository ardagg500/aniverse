import Image from "next/image";
import Link from "next/link";
import React from "react";
import FavoriteButton from "@/components/FavoriteButton";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen Anime Detay sayfasındaki üst bilgi kartını (kapak resmi, özet,
// türler ve butonlar) oluşturur. Renkleri ve yerleşimi buradan değiştirebilirsiniz.
// ============================================================================

interface AnimeDetailHeaderProps {
  id: string;
  title: string;
  slug: string;
  synopsis?: string | null;
  coverImage?: string | null;
  rating: number;
  year?: number | null;
  season?: string | null;
  status?: string | null;
  genres: { id: string; name: string; slug: string }[];
  firstEpisodeNumber: number;
  isFavorited: boolean;
}

export default function AnimeDetailHeader({
  id,
  title,
  slug,
  synopsis,
  coverImage,
  rating,
  year,
  season,
  status,
  genres,
  firstEpisodeNumber,
  isFavorited,
}: AnimeDetailHeaderProps) {
  const coverSrc =
    coverImage && coverImage.startsWith("http")
      ? coverImage
      : coverImage
      ? `/${coverImage.replace(/^\//, "")}`
      : "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_30px_rgba(220,38,38,0.3)] shrink-0 mx-auto md:mx-0">
          <Image
            src={coverSrc}
            alt={title}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="px-3 py-1 rounded-xl bg-amber-500/15 backdrop-blur-md border border-amber-500/30 text-amber-300">
              ★ {rating.toFixed(1)}
            </span>
            {year && (
              <span className="px-3 py-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200">
                {year}
              </span>
            )}
            {season && (
              <span className="px-3 py-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200">
                {season}
              </span>
            )}
            {status && (
              <span className="px-3 py-1 rounded-xl bg-red-500/15 backdrop-blur-md border border-red-500/30 text-red-300">
                {status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,30,66,0.45)]">
            {title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/search?genre=${genre.slug}`}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs text-zinc-300 transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>

          {synopsis && (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {synopsis}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/watch/${slug}/${firstEpisodeNumber}`}
              className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
            >
              ▶ 1. Bölümden Başla
            </Link>
            <FavoriteButton animeId={id} initialFavorited={isFavorited} />
          </div>
        </div>
      </div>
    </div>
  );
}
