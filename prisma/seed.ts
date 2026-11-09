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

const DEFAULT_ANIMES: RawAnime[] = [
  {
    title: "Smoking Behind the Supermarket with You",
    coverImage:
      "https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw300%2FgHVfuuOXPVs0ltFbOZQjxpXtSSH.jpg",
    bannerImage:
      "https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw300%2FgHVfuuOXPVs0ltFbOZQjxpXtSSH.jpg",
    synopsis:
      "Süpermarketin arkasında sigara içerken başlayan sıradışı ve rahatlatıcı bir dostluk hikayesi.",
    genres: ["Slice of Life", "Romantizm", "Komedi"],
    rating: 8.9,
    year: 2026,
    season: "Bahar",
    status: "Devam Ediyor",
    episodes: [
      {
        number: 1,
        title: "1. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
      },
      {
        number: 2,
        title: "2. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a274934048010175ef9e0e7?vid=755655",
      },
      {
        number: 3,
        title: "3. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a29844f2b34b506938a4112?vid=755835",
      },
      {
        number: 4,
        title: "4. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a29a80451d1bc8abb9fa49b?vid=755853",
      },
      {
        number: 5,
        title: "5. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a2b0b1d2b34b506938a4117?vid=755898",
      },
      {
        number: 6,
        title: "6. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a2b3b60048010175ef9e0f2?vid=755904",
      },
    ],
  },
  {
    title: "Solo Leveling: Arise",
    coverImage:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    synopsis:
      "Dünyanın en zayıf avcısı Sung Jinwoo'nun gölgelerin krallığına uzanan efsanevi yükselişi.",
    genres: ["Aksiyon", "Fantastik", "Macera"],
    rating: 9.4,
    year: 2026,
    season: "Kış",
    status: "Devam Ediyor",
    totalEpisodes: 12,
  },
  {
    title: "Demon Slayer: Infinity Castle",
    coverImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    synopsis:
      "Sonsuzluk Kalesi'nde İblis Avcıları Birliği ve Kibutsuji Muzan arasındaki son büyük savaş.",
    genres: ["Aksiyon", "Doğaüstü", "Dram"],
    rating: 9.6,
    year: 2026,
    season: "Yaz",
    status: "Devam Ediyor",
    totalEpisodes: 12,
  },
  {
    title: "Frieren: Beyond Journey's End",
    coverImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    synopsis:
      "İblis Kral'ı mağlup eden kahramanlar grubundan elf büyücü Frieren'in yüzyıllar süren hüzünlü ve huzurlu yolculuğu.",
    genres: ["Macera", "Fantastik", "Dram"],
    rating: 9.5,
    year: 2025,
    season: "Sonbahar",
    status: "Tamamlandı",
    totalEpisodes: 28,
  },
];

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
  let animeList: RawAnime[] = DEFAULT_ANIMES;

  if (fs.existsSync(dataPath)) {
    const rawContent = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(rawContent);
    animeList = Array.isArray(parsed)
      ? parsed
      : parsed.animes || parsed.data || DEFAULT_ANIMES;
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
            iframeUrl:
              "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
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
