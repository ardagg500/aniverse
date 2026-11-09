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
  status,
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
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-500/50 hover:bg-white/10 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,30,66,0.35)] active:scale-[0.98] transition-all duration-300"
    >
      {/* Görsel Alanı */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950/60">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030307] via-transparent to-black/30" />

        {/* Puan Rozeti */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1 shadow-sm">
          <span>★</span>
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* Bölüm Sayısı Rozeti */}
        {episodeCount !== undefined && episodeCount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-red-600/80 backdrop-blur-md border border-red-500/30 text-white text-xs font-bold shadow-[0_0_12px_rgba(255,30,66,0.4)]">
            {episodeCount} Bölüm
          </div>
        )}

        {/* Hover'da Merkez Oynat Rozeti */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,30,66,0.8)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Kart Alt Metin ve Tür Etiketleri */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
            {year && <span>{year}</span>}
            {season && (
              <>
                <span>•</span>
                <span>{season}</span>
              </>
            )}
            {status && (
              <>
                <span>•</span>
                <span className="text-zinc-400">{status}</span>
              </>
            )}
          </div>
        </div>

        {genres && genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/5 backdrop-blur-sm text-zinc-300 border border-white/10"
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
