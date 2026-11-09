import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AnimeCard from "@/components/AnimeCard";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
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

  return (
    <div className="space-y-12">
      <div className="glass rounded-3xl p-6 sm:p-10 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff1e42] to-[#99001b] flex items-center justify-center text-2xl font-black text-white shadow-neon">
            {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {session.user?.name || "Anime Sever"}
            </h1>
            <p className="text-sm text-zinc-400">{session.user?.email}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-xl font-black text-[#ff1e42]">
              {favorites.length}
            </div>
            <div className="text-xs text-zinc-400">Favori Anime</div>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-xl font-black text-[#ff1e42]">
              {history.length}
            </div>
            <div className="text-xs text-zinc-400">İzlenen Bölüm</div>
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-[#ff1e42] shadow-neon-sm" />
          İzleme Geçmişi
        </h2>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/watch/${item.episode.anime.slug}/${item.episode.number}`}
                className="group glass rounded-2xl p-4 flex items-center justify-between border border-white/10 hover:border-[#ff1e42]/60 transition-all"
              >
                <div className="space-y-1 pr-3">
                  <h3 className="font-bold text-white group-hover:text-[#ff1e42] transition-colors line-clamp-1">
                    {item.episode.anime.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Bölüm {item.episode.number}: {item.episode.title}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#ff1e42]/20 text-[#ff1e42] text-xs font-bold shrink-0">
                  Devam Et →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center text-zinc-400 text-sm">
            Henüz izleme geçmişiniz bulunmuyor.
          </div>
        )}
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-[#ff1e42] shadow-neon-sm" />
          Favorilerim
        </h2>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {favorites.map(({ anime }) => (
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
          <div className="glass rounded-2xl p-8 text-center text-zinc-400 text-sm">
            Henüz favorilerinize anime eklemediniz.
          </div>
        )}
      </section>
    </div>
  );
}
