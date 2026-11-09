import Link from "next/link";
import React from "react";
import { prisma } from "@/lib/prisma";
import { FALLBACK_ANIMES, FALLBACK_GENRES } from "@/lib/fallback-data";
import AnimeCard from "@/components/AnimeCard";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: {
    q?: string;
    genre?: string;
    sort?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() || "";
  const selectedGenre = searchParams.genre?.trim() || "";
  const sort = searchParams.sort?.trim() || "latest";

  const [dbAnimes, dbGenres] = await Promise.all([
    prisma.anime
      .findMany({
        where: {
          ...(q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { synopsis: { contains: q, mode: "insensitive" } },
                ],
              }
            : {}),
          ...(selectedGenre
            ? {
                genres: {
                  some: {
                    genre: {
                      slug: selectedGenre,
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          genres: { include: { genre: true } },
          _count: { select: { episodes: true } },
        },
        orderBy:
          sort === "rating"
            ? { rating: "desc" }
            : sort === "year"
            ? { year: "desc" }
            : { createdAt: "desc" },
      })
      .catch(() => []),
    prisma.genre
      .findMany({
        orderBy: { name: "asc" },
      })
      .catch(() => []),
  ]);

  const genres = dbGenres.length > 0 ? dbGenres : FALLBACK_GENRES;

  let animes = dbAnimes;
  if (dbAnimes.length === 0 && !q && !selectedGenre) {
    animes = [...FALLBACK_ANIMES];
  } else if (dbAnimes.length === 0) {
    animes = FALLBACK_ANIMES.filter((a) => {
      const matchesQ =
        !q ||
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.synopsis.toLowerCase().includes(q.toLowerCase());
      const matchesGenre =
        !selectedGenre ||
        a.genres.some((g) => g.genre.slug === selectedGenre);
      return matchesQ && matchesGenre;
    });
  }

  return (
    <div className="space-y-10">
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Anime <span className="text-[#ff1e42]">Keşfet & Ara</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Aradığınız seriyi isme, türe veya puana göre filtreleyin
        </p>

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
            className="sm:col-span-2 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1e42]"
          />

          <select
            name="genre"
            defaultValue={selectedGenre}
            className="px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#ff1e42]"
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
              className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#ff1e42]"
            >
              <option value="latest">En Yeni</option>
              <option value="rating">En Yüksek Puan</option>
              <option value="year">Yıla Göre</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-white font-bold text-sm shadow-neon-sm transition-all"
            >
              Filtrele
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/search"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !selectedGenre
                ? "bg-[#ff1e42] text-white shadow-neon-sm"
                : "bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            Tümü
          </Link>
          {genres.map((g) => (
            <Link
              key={g.id}
              href={`/search?genre=${g.slug}&sort=${sort}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedGenre === g.slug
                  ? "bg-[#ff1e42] text-white shadow-neon-sm"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {g.name}
            </Link>
          ))}
        </div>
      </div>

      {animes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {animes.map((anime) => (
            <AnimeCard
              key={anime.id}
              id={anime.id}
              title={anime.title}
              slug={anime.slug}
              coverImage={anime.coverImage}
              rating={anime.rating}
              year={anime.year}
              season={anime.season}
              status={anime.status}
              episodeCount={anime._count.episodes}
              genres={anime.genres.map((g) => g.genre.name)}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center space-y-3">
          <p className="text-lg font-bold text-white">Sonuç bulunamadı</p>
          <p className="text-sm text-zinc-400">
            Arama kriterlerinize uygun anime bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}
