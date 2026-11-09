import Link from "next/link";
import React from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen Arama & Filtreleme sayfasındaki üst filtre formudur.
// Input, Select ve Buton renklerini buradan güvenle değiştirebilirsiniz.
// ============================================================================

interface SearchFilterBarProps {
  q: string;
  selectedGenre: string;
  sort: string;
  genres: { id: string; name: string; slug: string }[];
}

export default function SearchFilterBar({
  q,
  selectedGenre,
  sort,
  genres,
}: SearchFilterBarProps) {
  return (
    /* GELECEK MODEL İÇİN: Arama kutusu arka plan ve kenarlık renkleri */
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl">
      <h1 className="text-2xl sm:text-4xl font-black text-white">
        Anime <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">Keşfet & Ara</span>
      </h1>
      <p className="text-sm text-zinc-300 mt-1">
        Aradığınız seriyi isme, türe veya puana göre filtreleyin
      </p>

      {/* GELECEK MODEL İÇİN: Form elemanlarının stillerini buradan değiştirebilirsiniz */}
      <form
        action="/search"
        method="GET"
        className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Anime adı veya konu ara..."
          className="sm:col-span-2 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 backdrop-blur-md focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 transition-all"
        />

        <select
          name="genre"
          defaultValue={selectedGenre}
          className="px-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-white backdrop-blur-md focus:outline-none focus:border-red-500/60 transition-all"
        >
          <option value="">Tüm Türler</option>
          {genres.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <select
            name="sort"
            defaultValue={sort}
            className="flex-1 px-4 py-3.5 rounded-2xl bg-black/60 border border-white/10 text-white backdrop-blur-md focus:outline-none focus:border-red-500/60 transition-all"
          >
            <option value="latest">En Yeni</option>
            <option value="rating">En Yüksek Puan</option>
            <option value="year">Yıla Göre</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Filtrele
          </button>
        </div>
      </form>

      {/* GELECEK MODEL İÇİN: Hızlı tür filtreleme butonları */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/search"
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            !selectedGenre
              ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
              : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
          }`}
        >
          Tümü
        </Link>
        {genres.map((g) => (
          <Link
            key={g.id}
            href={`/search?genre=${g.slug}&sort=${sort}${
              q ? `&q=${encodeURIComponent(q)}` : ""
            }`}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedGenre === g.slug
                ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {g.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
