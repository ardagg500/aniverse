import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface RawEpisode {
  number: number;
  title?: string;
  iframeUrl?: string;
  embedUrl?: string;
  url?: string;
  duration?: number | string;
}

interface RawAnime {
  title: string;
  slug?: string;
  synopsis?: string;
  description?: string;
  coverImage?: string;
  image?: string;
  poster?: string;
  bannerImage?: string;
  banner?: string;
  year?: number | string;
  season?: string;
  rating?: number | string;
  score?: number | string;
  status?: string;
  totalEpisodes?: number;
  genres?: (string | { name: string; slug?: string })[];
  episodes?: RawEpisode[];
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDuration(duration?: number | string): number | null {
  if (duration === undefined || duration === null) return null;
  if (typeof duration === "number") return duration;
  if (duration.includes(":")) {
    const parts = duration.split(":").map(Number);
    if (parts.length === 2 && !parts.some(Number.isNaN)) {
      return parts[0] * 60 + parts[1];
    }
  }
  const num = Number(duration);
  return Number.isNaN(num) ? null : num;
}

async function main() {
  const dataPath = path.resolve(process.cwd(), "data.json");
  const rawContent = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(rawContent);
  const animeList: RawAnime[] = Array.isArray(parsed)
    ? parsed
    : parsed.animes || parsed.data || [];

  if (Array.isArray(parsed.genresList)) {
    for (const g of parsed.genresList) {
      const genreName = typeof g === "string" ? g : g.name;
      if (!genreName) continue;
      const genreSlug = slugify(genreName);
      await prisma.genre.upsert({
        where: { slug: genreSlug },
        update: { name: genreName },
        create: { name: genreName, slug: genreSlug },
      });
    }
  }

  for (const item of animeList) {
    const animeSlug = item.slug || slugify(item.title);
    const parsedYear = item.year ? Number(item.year) : null;
    const parsedRating =
      item.rating !== undefined
        ? Number(item.rating)
        : item.score !== undefined
        ? Number(item.score)
        : 0;

    const anime = await prisma.anime.upsert({
      where: { slug: animeSlug },
      update: {
        title: item.title,
        synopsis: item.synopsis ?? item.description ?? null,
        coverImage: item.coverImage ?? item.image ?? item.poster ?? null,
        bannerImage: item.bannerImage ?? item.banner ?? null,
        year: Number.isNaN(parsedYear) ? null : parsedYear,
        season: item.season ?? null,
        rating: Number.isNaN(parsedRating) ? 0 : parsedRating,
        status: item.status ?? null,
      },
      create: {
        title: item.title,
        slug: animeSlug,
        synopsis: item.synopsis ?? item.description ?? null,
        coverImage: item.coverImage ?? item.image ?? item.poster ?? null,
        bannerImage: item.bannerImage ?? item.banner ?? null,
        year: Number.isNaN(parsedYear) ? null : parsedYear,
        season: item.season ?? null,
        rating: Number.isNaN(parsedRating) ? 0 : parsedRating,
        status: item.status ?? null,
      },
    });

    if (Array.isArray(item.genres)) {
      for (const g of item.genres) {
        const genreName = typeof g === "string" ? g : g.name;
        const genreSlug =
          typeof g === "string" ? slugify(g) : g.slug || slugify(g.name);

        const genre = await prisma.genre.upsert({
          where: { slug: genreSlug },
          update: { name: genreName },
          create: {
            name: genreName,
            slug: genreSlug,
          },
        });

        await prisma.animeGenre.upsert({
          where: {
            animeId_genreId: {
              animeId: anime.id,
              genreId: genre.id,
            },
          },
          update: {},
          create: {
            animeId: anime.id,
            genreId: genre.id,
          },
        });
      }
    }

    const episodesToSeed: RawEpisode[] =
      Array.isArray(item.episodes) && item.episodes.length > 0
        ? item.episodes
        : item.totalEpisodes && item.totalEpisodes > 0
        ? Array.from({ length: item.totalEpisodes }, (_, idx) => ({
            number: idx + 1,
            title: `${idx + 1}. Bölüm`,
            iframeUrl: "",
            duration: 1440,
          }))
        : [];

    for (const ep of episodesToSeed) {
      const epNumber = Number(ep.number);
      const epTitle = ep.title || `${epNumber}. Bölüm`;
      const epIframe = ep.iframeUrl ?? ep.embedUrl ?? ep.url ?? "";
      const epDuration = parseDuration(ep.duration);

      await prisma.episode.upsert({
        where: {
          animeId_number: {
            animeId: anime.id,
            number: epNumber,
          },
        },
        update: {
          title: epTitle,
          iframeUrl: epIframe,
          duration: epDuration,
        },
        create: {
          animeId: anime.id,
          number: epNumber,
          title: epTitle,
          iframeUrl: epIframe,
          duration: epDuration,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
