import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";
import { prisma } from "@/lib/prisma";
import { FALLBACK_ANIMES } from "@/lib/fallback-data";
import { authOptions } from "@/lib/auth";
import FavoriteButton from "@/components/FavoriteButton";

export const revalidate = 60;

interface AnimeDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const dbAnime = await prisma.anime
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
    .catch(() => null);

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

  const rawCover = anime.coverImage;
  const coverSrc =
    rawCover && rawCover.startsWith("http")
      ? rawCover
      : rawCover
      ? `/${rawCover.replace(/^\//, "")}`
      : "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80";

  const rawBanner = anime.bannerImage || anime.coverImage;
  const bannerSrc =
    rawBanner && rawBanner.startsWith("http")
      ? rawBanner
      : rawBanner
      ? `/${rawBanner.replace(/^\//, "")}`
      : coverSrc;

  const firstEpisodeNumber = anime.episodes[0]?.number ?? 1;

  return (
    <div className="space-y-12">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 glass p-6 sm:p-10">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Image
            src={bannerSrc}
            alt={anime.title}
            fill
            sizes="100vw"
            className="object-cover blur-md scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/80 to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border border-white/15 shadow-neon shrink-0 mx-auto md:mx-0">
            <Image
              src={coverSrc}
              alt={anime.title}
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
                ★ {anime.rating.toFixed(1)}
              </span>
              {anime.year && (
                <span className="px-3 py-1 rounded-lg bg-white/10 text-zinc-200">
                  {anime.year}
                </span>
              )}
              {anime.season && (
                <span className="px-3 py-1 rounded-lg bg-white/10 text-zinc-200">
                  {anime.season}
                </span>
              )}
              {anime.status && (
                <span className="px-3 py-1 rounded-lg bg-[#ff1e42]/20 border border-[#ff1e42]/40 text-red-200">
                  {anime.status}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {anime.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {anime.genres.map(({ genre }) => (
                <Link
                  key={genre.id}
                  href={`/search?genre=${genre.slug}`}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#ff1e42]/20 border border-white/10 hover:border-[#ff1e42]/50 text-xs text-zinc-300 transition-all"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {anime.synopsis && (
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {anime.synopsis}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={`/watch/${anime.slug}/${firstEpisodeNumber}`}
                className="px-7 py-3.5 rounded-2xl bg-[#ff1e42] hover:bg-[#e50914] text-white font-bold text-sm flex items-center gap-2 shadow-neon transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                1. Bölümden Başla
              </Link>
              <FavoriteButton
                animeId={anime.id}
                initialFavorited={isFavorited}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-[#ff1e42] shadow-neon-sm" />
          Bölümler ({anime.episodes.length})
        </h2>

        {anime.episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {anime.episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${anime.slug}/${ep.number}`}
                className="group glass rounded-2xl p-4 flex items-center justify-between border border-white/10 hover:border-[#ff1e42]/60 hover:shadow-neon-sm transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ff1e42]/15 border border-[#ff1e42]/40 text-[#ff1e42] font-black flex items-center justify-center group-hover:bg-[#ff1e42] group-hover:text-white transition-all">
                    {ep.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-[#ff1e42] transition-colors">
                      {ep.title || `${ep.number}. Bölüm`}
                    </h3>
                    {ep.duration && (
                      <p className="text-xs text-zinc-400">
                        {Math.round(ep.duration / 60)} dk
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-400 group-hover:text-white">
                  İzle →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 text-zinc-400 text-sm">
            Bu anime için henüz bölüm eklenmemiş.
          </div>
        )}
      </section>
    </div>
  );
}
