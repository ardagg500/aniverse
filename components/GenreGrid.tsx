import Link from "next/link";
import React from "react";

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
          <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-red-500 to-purple-600 shadow-[0_0_12px_rgba(255,30,66,0.6)]" />
          Türler
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Favori anime türünüze göre keşfedin
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/search?genre=${genre.slug}`}
            className="group rounded-2xl p-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-500/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,30,66,0.25)] hover:scale-[1.02] active:scale-95 flex items-center justify-between transition-all duration-300"
          >
            <span className="font-bold text-white group-hover:text-red-400 transition-colors">
              {genre.name}
            </span>
            <span className="text-zinc-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
