import Link from "next/link";
import React from "react";
import { prisma } from "@/lib/prisma";
import { FALLBACK_ANIMES, FALLBACK_GENRES } from "@/lib/fallback-data";
import Hero from "@/components/Hero";
import AnimeCard from "@/components/AnimeCard";

export const revalidate = 60;

async function getHomeData() {
  try {
    const [trending, recent, genres] = await Promise.all([
      prisma.anime.findMany({
        orderBy: { rating: "desc" },
        take: 10,
        include: {
          genres: { include: { genre: true } },
          _count: { select: { episodes: true } },
        },
      }),
      prisma.anime.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          genres: { include: { genre: true } },
          _count: { select: { episodes: true } },
        },
      }),
      prisma.genre.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    if (trending.length === 0) {
      return {
        trending: [...FALLBACK_ANIMES].sort((a, b) => b.rating - a.rating),
        recent: [...FALLBACK_ANIMES],
        genres: FALLBACK_GENRES,
      };
    }

    return { trending, recent, genres };
  } catch {
    return {
      trending: [...FALLBACK_ANIMES].sort((a, b) => b.rating - a.rating),
      recent: [...FALLBACK_ANIMES],
      genres: FALLBACK_GENRES,
    };
  }
}

export default async function HomePage() {
  const { trending, recent, genres } = await getHomeData();

  const heroSource = trending[0] || FALLBACK_ANIMES[0];
  const featured = {
    title: heroSource.title,
    slug: heroSource.slug,
    synopsis: heroSource.synopsis,
    bannerImage: heroSource.bannerImage,
    coverImage: heroSource.coverImage,
    rating: heroSource.rating,
    year: heroSource.year,
    season: heroSource.season,
    status: heroSource.status,
    genres: heroSource.genres.map((g) => g.genre.name),
  };

  return (
    <div className="space-y-16">
      <Hero anime={featured} />

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-[#ff1e42] shadow-neon-sm" />
              Trend Olanlar
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              En yüksek puanlı ve en çok izlenen seriler
            </p>
          </div>
          <Link
            href="/search?sort=rating"
            className="text-sm font-semibold text-[#ff1e42] hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {trending.map((anime) => (
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
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-[#ff1e42] shadow-neon-sm" />
              Son Eklenenler
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Platforma yeni eklenen güncel animeler
            </p>
          </div>
          <Link
            href="/search?sort=latest"
            className="text-sm font-semibold text-[#ff1e42] hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {recent.map((anime) => (
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
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-1.5 h-7 rounded-full bg-[#ff1e42] shadow-neon-sm" />
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
              className="group glass rounded-2xl p-5 flex items-center justify-between hover:border-[#ff1e42]/60 hover:shadow-neon-sm transition-all duration-300"
            >
              <span className="font-bold text-white group-hover:text-[#ff1e42] transition-colors">
                {genre.name}
              </span>
              <span className="text-zinc-500 group-hover:translate-x-1 group-hover:text-[#ff1e42] transition-all">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
