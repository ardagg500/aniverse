import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileView from "@/components/ProfileView";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session || !userId) {
    redirect("/auth/login");
  }

  const [favorites, history] = await Promise.all([
    prisma.favorite
      .findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          anime: {
            include: {
              genres: { include: { genre: true } },
              _count: { select: { episodes: true } },
            },
          },
        },
      })
      .catch(() => []),
    prisma.watchHistory
      .findMany({
        where: { userId },
        orderBy: { watchedAt: "desc" },
        take: 12,
        include: {
          episode: {
            include: {
              anime: true,
            },
          },
        },
      })
      .catch(() => []),
  ]);

  const favoriteCards = favorites.map(({ anime }) => ({
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

  const historyItems = history.map((item) => ({
    id: item.id,
    animeTitle: item.episode.anime.title,
    animeSlug: item.episode.anime.slug,
    episodeNumber: item.episode.number,
    episodeTitle: item.episode.title,
  }));

  return (
    <ProfileView
      userName={session.user?.name || "Anime Sever"}
      userEmail={session.user?.email || ""}
      favorites={favoriteCards}
      history={historyItems}
    />
  );
}
