import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { prisma } from "@/lib/prisma";
import { FALLBACK_ANIMES } from "@/lib/fallback-data";
import Player from "@/components/Player";

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
    <div className="space-y-8">
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
              className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-xs sm:text-sm font-semibold text-zinc-200 transition-all"
            >
              ← Önceki Bölüm
            </Link>
          )}
          {nextEpisode && (
            <Link
              href={`/watch/${anime.slug}/${nextEpisode.number}`}
              className="px-5 py-2.5 rounded-xl bg-[#ff1e42] hover:bg-[#e50914] text-xs sm:text-sm font-bold text-white shadow-neon-sm transition-all"
            >
              Sonraki Bölüm →
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Player
            episodeId={currentEpisode.id}
            iframeUrl={currentEpisode.iframeUrl}
            title={`${anime.title} - Bölüm ${currentEpisode.number}`}
          />
        </div>

        <aside className="glass rounded-2xl p-5 flex flex-col max-h-[540px]">
          <h2 className="text-lg font-extrabold text-white mb-4 flex items-center justify-between">
            <span>Bölüm Listesi</span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#ff1e42]/20 text-[#ff1e42]">
              {anime.episodes.length} Bölüm
            </span>
          </h2>

          <div className="overflow-y-auto space-y-2 pr-1">
            {anime.episodes.map((ep) => {
              const active = ep.number === currentEpisode.number;
              return (
                <Link
                  key={ep.id}
                  href={`/watch/${anime.slug}/${ep.number}`}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#ff1e42] text-white shadow-neon-sm font-bold"
                      : "bg-white/5 hover:bg-white/10 text-zinc-300"
                  }`}
                >
                  <span className="truncate">
                    {ep.number}. {ep.title || `${ep.number}. Bölüm`}
                  </span>
                  {active && <span className="text-xs">▶</span>}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
