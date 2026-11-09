import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";
import { prisma, isDbAvailable } from "@/lib/prisma";
import { FALLBACK_ANIMES } from "@/lib/fallback-data";
import { authOptions } from "@/lib/auth";
import AnimeDetailHeader from "@/components/AnimeDetailHeader";
import EpisodeList from "@/components/EpisodeList";

export const revalidate = 60;

interface AnimeDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const dbAnime = isDbAvailable
    ? await prisma.anime
        .findUnique({
          where: { slug: params.slug },
          include: {
            episodes: {
              orderBy: { number: "asc" },
            },
            genres: {
              include: { genre: true },
            },
          },
        })
        .catch(() => null)
    : null;

  const anime =
    dbAnime || FALLBACK_ANIMES.find((item) => item.slug === params.slug) || null;

  if (!anime) {
    notFound();
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  let isFavorited = false;
  if (userId && dbAnime) {
    const fav = await prisma.favorite
      .findUnique({
        where: {
          userId_animeId: {
            userId,
            animeId: anime.id,
          },
        },
      })
      .catch(() => null);
    isFavorited = !!fav;
  }

  const firstEpisodeNumber = anime.episodes[0]?.number ?? 1;

  return (
    <div className="space-y-12">
      <AnimeDetailHeader
        id={anime.id}
        title={anime.title}
        slug={anime.slug}
        synopsis={anime.synopsis}
        coverImage={anime.coverImage}
        rating={anime.rating}
        year={anime.year}
        season={anime.season}
        status={anime.status}
        genres={anime.genres.map(({ genre }) => genre)}
        firstEpisodeNumber={firstEpisodeNumber}
        isFavorited={isFavorited}
      />

      <EpisodeList animeSlug={anime.slug} episodes={anime.episodes} />
    </div>
  );
}
