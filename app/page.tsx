import React from "react";
import { prisma, isDbAvailable } from "@/lib/prisma";
import { FALLBACK_ANIMES, FALLBACK_GENRES } from "@/lib/fallback-data";
import Hero from "@/components/Hero";
import AnimeSection from "@/components/AnimeSection";
import GenreGrid from "@/components/GenreGrid";

export const revalidate = 60;

async function getHomeData() {
  if (!isDbAvailable) {
    return {
      trending: [...FALLBACK_ANIMES].sort((a, b) => b.rating - a.rating),
      recent: [...FALLBACK_ANIMES],
      genres: FALLBACK_GENRES,
    };
  }

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

  const trendingCards = trending.map((anime) => ({
    id: anime.id,
    title: anime.title,
    slug: anime.slug,
    coverImage: anime.coverImage,
    rating: anime.rating,
    year: anime.year,
    season: anime.season,
    status: anime.status,
    episodeCount: anime._count.episodes,
    genres: anime.genres.map((g) => g.genre.name),
  }));

  const recentCards = recent.map((anime) => ({
    id: anime.id,
    title: anime.title,
    slug: anime.slug,
    coverImage: anime.coverImage,
    rating: anime.rating,
    year: anime.year,
    season: anime.season,
    status: anime.status,
    episodeCount: anime._count.episodes,
    genres: anime.genres.map((g) => g.genre.name),
  }));

  return (
    <div className="relative space-y-16 py-2">
      {/* Hero Section */}
      <Hero anime={featured} />

      {/* Trend Olanlar Bölümü */}
      <AnimeSection
        title="Trend Olanlar"
        subtitle="En yüksek puanlı ve en çok izlenen seriler"
        moreHref="/search?sort=rating"
        animes={trendingCards}
      />

      {/* Son Eklenenler Bölümü */}
      <AnimeSection
        title="Son Eklenenler"
        subtitle="Platforma yeni eklenen güncel animeler"
        moreHref="/search?sort=latest"
        animes={recentCards}
      />

      {/* Türler Grid Bölümü */}
      <GenreGrid genres={genres} />
    </div>
  );
}
