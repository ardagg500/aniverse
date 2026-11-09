import Image from "next/image";
import Link from "next/link";
import React from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu dosya tekil Anime Kartı (AnimeCard) bileşenidir.
// Kart boyutu, köşe yuvarlaklığı, renkler ve rozet tasarımlarını buradan
// değiştirebilirsiniz. Props yapısını değiştirmeyin.
// ============================================================================

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
    /* GELECEK MODEL İÇİN: Kart dış çerçevesi, arka plan rengi ve hover efektini buradan değiştirebilirsiniz */
    <Link
      href={`/anime/${slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#111118] border border-zinc-800 hover:border-[#ff1e42] transition-colors"
    >
      {/* GELECEK MODEL İÇİN: Görsel alanı ve üst rozetler */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-black/30" />

        {/* GELECEK MODEL İÇİN: Puan rozeti rengini buradan değiştirebilirsiniz */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 text-xs font-bold text-amber-400">
          ★ {rating.toFixed(1)}
        </div>

        {/* GELECEK MODEL İÇİN: Bölüm sayısı rozeti */}
        {episodeCount !== undefined && episodeCount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#ff1e42] text-white text-xs font-bold">
            {episodeCount} Bölüm
          </div>
        )}
      </div>

      {/* GELECEK MODEL İÇİN: Kart alt metin ve tür etiketleri alanı */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#ff1e42] transition-colors">
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
          </div>
        </div>

        {genres && genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800"
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
