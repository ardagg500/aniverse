import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { prisma } from "@/lib/prisma";
import { FALLBACK_ANIMES } from "@/lib/fallback-data";
import Player from "@/components/Player";
import EpisodeList from "@/components/EpisodeList";

export const revalidate = 60;

interface WatchPageProps {
  params: {
    slug: string;
    ep: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const episodeNumber = Number(params.ep) || 1;

  const dbAnime = await prisma.anime
    .findUnique({
      where: { slug: params.slug },
      include: {
        episodes: {
          orderBy: { number: "asc" },
        },
      },
    })
    .catch(() => null);

  const anime =
    dbAnime || FALLBACK_ANIMES.find((item) => item.slug === params.slug) || null;

  if (!anime) {
    notFound();
  }

  const currentEpisode =
    anime.episodes.find((e) => e.number === episodeNumber) ||
    anime.episodes[0] || {
      id: "",
      number: episodeNumber,
      title: `${episodeNumber}. Bölüm`,
      iframeUrl:
        "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
      duration: 1440,
    };

  const prevEpisode = anime.episodes.find(
    (e) => e.number === currentEpisode.number - 1
  );
  const nextEpisode = anime.episodes.find(
    (e) => e.number === currentEpisode.number + 1
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={`/anime/${anime.slug}`}
            className="text-xs font-semibold text-[#ff1e42] hover:underline"
          >
            ← {anime.title} Sayfasına Dön
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {anime.title} —{" "}
            <span className="text-[#ff1e42]">
              Bölüm {currentEpisode.number}: {currentEpisode.title}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {prevEpisode && (
            <Link
              href={`/watch/${anime.slug}/${prevEpisode.number}`}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-200"
            >
              ← Önceki Bölüm
            </Link>
          )}
          {nextEpisode && (
            <Link
              href={`/watch/${anime.slug}/${nextEpisode.number}`}
              className="px-5 py-2.5 rounded-xl bg-[#ff1e42] text-xs sm:text-sm font-bold text-white"
            >
              Sonraki Bölüm →
            </Link>
          )}
        </div>
      </div>

      <Player
        episodeId={currentEpisode.id}
        iframeUrl={currentEpisode.iframeUrl}
        title={`${anime.title} - Bölüm ${currentEpisode.number}`}
      />

      <EpisodeList animeSlug={anime.slug} episodes={anime.episodes} />
    </div>
  );
}
