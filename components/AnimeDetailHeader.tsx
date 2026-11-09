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
    /* GELECEK MODEL İÇİN: Detay kartı dış kutu rengini buradan değiştirebilirsiniz */
    <div className="rounded-3xl bg-[#111118] border border-zinc-800 p-6 sm:p-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* GELECEK MODEL İÇİN: Anime kapak görseli */}
        <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-700 shrink-0 mx-auto md:mx-0">
          <Image
            src={coverSrc}
            alt={title}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>

        {/* GELECEK MODEL İÇİN: Anime metin bilgileri ve butonlar */}
        <div className="flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
            <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
              ★ {rating.toFixed(1)}
            </span>
            {year && (
              <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
                {year}
              </span>
            )}
            {season && (
              <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
                {season}
              </span>
            )}
            {status && (
              <span className="px-3 py-1 rounded-lg bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-red-200">
                {status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/search?genre=${genre.slug}`}
                className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-[#ff1e42]/20 border border-zinc-800 text-xs text-zinc-300 transition-colors"
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

          {/* GELECEK MODEL İÇİN: İzle ve Favori butonları */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/watch/${slug}/${firstEpisodeNumber}`}
              className="px-7 py-3.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-white font-bold text-sm transition-colors"
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
