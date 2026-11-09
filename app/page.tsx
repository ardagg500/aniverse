import Link from "next/link";
import React from "react";
import { prisma } from "@/lib/prisma";
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

    return { trending, recent, genres };
  } catch {
    return { trending: [], recent: [], genres: [] };
  }
}

export default async function HomePage() {
  const { trending, recent, genres } = await getHomeData();

  const featured = trending[0]
    ? {
        title: trending[0].title,
        slug: trending[0].slug,
        synopsis: trending[0].synopsis,
        bannerImage: trending[0].bannerImage,
        coverImage: trending[0].coverImage,
        rating: trending[0].rating,
        year: trending[0].year,
        season: trending[0].season,
        status: trending[0].status,
        genres: trending[0].genres.map((g) => g.genre.name),
      }
    : {
        title: "Solo Leveling: Arise",
        slug: "solo-leveling-arise",
        synopsis:
          "Dünyanın en zayıf avcısı Sung Jinwoo'nun gölgelerin krallığına uzanan efsanevi yükselişi.",
        bannerImage:
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80",
        coverImage:
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
        rating: 9.4,
        year: 2026,
        season: "Kış",
        status: "Devam Ediyor",
        genres: ["Aksiyon", "Fantastik", "Macera"],
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

        {trending.length > 0 ? (
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
        ) : (
          <div className="glass rounded-2xl p-8 text-center text-zinc-400">
            Veritabanında henüz anime bulunmuyor.{" "}
            <code className="text-[#ff1e42]">npx prisma db seed</code> komutuyla
            verileri yükleyebilirsiniz.
          </div>
        )}
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
          {(genres.length > 0
            ? genres
            : [
                { id: "1", name: "Aksiyon", slug: "aksiyon" },
                { id: "2", name: "Fantastik", slug: "fantastik" },
                { id: "3", name: "Macera", slug: "macera" },
                { id: "4", name: "Romantizm", slug: "romantizm" },
                { id: "5", name: "Bilim Kurgu", slug: "bilim-kurgu" },
              ]
          ).map((genre) => (
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
