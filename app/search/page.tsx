import React from "react";
import { prisma, isDbAvailable } from "@/lib/prisma";
import { FALLBACK_ANIMES, FALLBACK_GENRES } from "@/lib/fallback-data";
import SearchFilterBar from "@/components/SearchFilterBar";
import AnimeSection from "@/components/AnimeSection";

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

  const [dbAnimes, dbGenres] = isDbAvailable
    ? await Promise.all([
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
      ])
    : [[], []];

  const genres = dbGenres.length > 0 ? dbGenres : FALLBACK_GENRES;

  const animes: Array<{
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    rating: number;
    year: number | null;
    season: string | null;
    status: string | null;
    _count: { episodes: number };
    genres: Array<{ genre: { name: string; slug: string } }>;
  }> =
    dbAnimes.length > 0
      ? dbAnimes
      : !q && !selectedGenre
      ? [...FALLBACK_ANIMES]
      : FALLBACK_ANIMES.filter((a) => {
          const matchesQ =
            !q ||
            a.title.toLowerCase().includes(q.toLowerCase()) ||
            a.synopsis.toLowerCase().includes(q.toLowerCase());
          const matchesGenre =
            !selectedGenre ||
            a.genres.some((g) => g.genre.slug === selectedGenre);
          return matchesQ && matchesGenre;
        });

  const animeCards = animes.map((anime) => ({
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
    <div className="space-y-10">
      <SearchFilterBar
        q={q}
        selectedGenre={selectedGenre}
        sort={sort}
        genres={genres}
      />

      <AnimeSection
        title="Arama Sonuçları"
        subtitle={`${animeCards.length} anime listeleniyor`}
        animes={animeCards}
      />
    </div>
  );
}
