import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface AnimeCardProps {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  rating: number;
  year?: number | null;
  season?: string | null;
  status?: string | null;
  episodeCount?: number;
  genres?: string[];
}

export default function AnimeCard({
  title,
  slug,
  coverImage,
  rating,
  year,
  season,
  episodeCount,
  genres,
}: AnimeCardProps) {
  const imageSrc =
    coverImage && coverImage.startsWith("http")
      ? coverImage
      : coverImage
      ? `/${coverImage.replace(/^\//, "")}`
      : "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80";

  return (
    <Link
      href={`/anime/${slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#111119] border border-white/10 hover:border-[#ff1e42]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-neon"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-black/30 opacity-90" />

        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg glass text-xs font-bold text-amber-400 flex items-center gap-1">
          <span>★</span>
          <span>{rating.toFixed(1)}</span>
        </div>

        {episodeCount !== undefined && episodeCount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#ff1e42]/90 text-white text-xs font-bold shadow-neon-sm">
            {episodeCount} Bölüm
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full bg-[#ff1e42] text-white flex items-center justify-center shadow-neon transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#ff1e42] transition-colors">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-400">
            {year && <span>{year}</span>}
            {season && (
              <>
                <span>•</span>
                <span>{season}</span>
              </>
            )}
          </div>
        </div>

        {genres && genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/5"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
