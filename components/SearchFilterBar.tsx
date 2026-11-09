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
    <div className="rounded-3xl bg-[#111118] border border-zinc-800 p-6 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-black text-white">
        Anime <span className="text-[#ff1e42]">Keşfet & Ara</span>
      </h1>
      <p className="text-sm text-zinc-400 mt-1">
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
          className="sm:col-span-2 px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
        />

        <select
          name="genre"
          defaultValue={selectedGenre}
          className="px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#ff1e42]"
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
            className="flex-1 px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#ff1e42]"
          >
            <option value="latest">En Yeni</option>
            <option value="rating">En Yüksek Puan</option>
            <option value="year">Yıla Göre</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-white font-bold text-sm transition-colors"
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
              ? "bg-[#ff1e42] text-white"
              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
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
                ? "bg-[#ff1e42] text-white"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {g.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
