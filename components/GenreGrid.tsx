import Link from "next/link";
import React from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen ana sayfadaki "Türler" (Genres) kutularını gösterir.
// Kutu renklerini ve kenarlıklarını buradan değiştirebilirsiniz.
// ============================================================================

interface GenreGridProps {
  genres: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function GenreGrid({ genres }: GenreGridProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-[#ff1e42]" />
          Türler
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Favori anime türünüze göre keşfedin
        </p>
      </div>

      {/* GELECEK MODEL İÇİN: Tür kartlarının renklerini buradan değiştirebilirsiniz */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/search?genre=${genre.slug}`}
            className="group rounded-2xl p-5 bg-[#111118] border border-zinc-800 hover:border-[#ff1e42] flex items-center justify-between transition-colors"
          >
            <span className="font-bold text-white group-hover:text-[#ff1e42] transition-colors">
              {genre.name}
            </span>
            <span className="text-zinc-500 group-hover:text-[#ff1e42]">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
