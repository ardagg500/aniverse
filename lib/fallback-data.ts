export interface FallbackEpisode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  iframeUrl: string;
  duration: number;
}

export interface FallbackGenre {
  id: string;
  name: string;
  slug: string;
}

export interface FallbackAnime {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  coverImage: string;
  bannerImage: string;
  year: number;
  season: string;
  rating: number;
  status: string;
  createdAt: Date;
  genres: { genre: FallbackGenre }[];
  episodes: FallbackEpisode[];
  _count: { episodes: number };
}

export const FALLBACK_GENRES: FallbackGenre[] = [
  { id: "g-1", name: "Aksiyon", slug: "aksiyon" },
  { id: "g-2", name: "Fantastik", slug: "fantastik" },
  { id: "g-3", name: "Macera", slug: "macera" },
  { id: "g-4", name: "Romantizm", slug: "romantizm" },
  { id: "g-5", name: "Komedi", slug: "komedi" },
  { id: "g-6", name: "Slice of Life", slug: "slice-of-life" },
  { id: "g-7", name: "Bilim Kurgu", slug: "bilim-kurgu" },
  { id: "g-8", name: "Doğaüstü", slug: "dogaustu" },
  { id: "g-9", name: "Dram", slug: "dram" },
  { id: "g-10", name: "Psikolojik", slug: "psikolojik" },
];

export const FALLBACK_ANIMES: FallbackAnime[] = [
  {
    id: "anime-1",
    title: "Smoking Behind the Supermarket with You",
    slug: "smoking-behind-the-supermarket-with-you",
    synopsis:
      "Süpermarketin arkasında sigara içerken başlayan sıradışı ve rahatlatıcı bir dostluk hikayesi.",
    coverImage:
      "https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw300%2FgHVfuuOXPVs0ltFbOZQjxpXtSSH.jpg",
    bannerImage:
      "https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw300%2FgHVfuuOXPVs0ltFbOZQjxpXtSSH.jpg",
    year: 2026,
    season: "Bahar",
    rating: 8.9,
    status: "Devam Ediyor",
    createdAt: new Date("2026-03-01"),
    genres: [
      { genre: { id: "g-6", name: "Slice of Life", slug: "slice-of-life" } },
      { genre: { id: "g-4", name: "Romantizm", slug: "romantizm" } },
      { genre: { id: "g-5", name: "Komedi", slug: "komedi" } },
    ],
    episodes: [
      {
        id: "ep-1-1",
        animeId: "anime-1",
        number: 1,
        title: "1. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
      },
      {
        id: "ep-1-2",
        animeId: "anime-1",
        number: 2,
        title: "2. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a274934048010175ef9e0e7?vid=755655",
      },
      {
        id: "ep-1-3",
        animeId: "anime-1",
        number: 3,
        title: "3. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a29844f2b34b506938a4112?vid=755835",
      },
      {
        id: "ep-1-4",
        animeId: "anime-1",
        number: 4,
        title: "4. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a29a80451d1bc8abb9fa49b?vid=755853",
      },
      {
        id: "ep-1-5",
        animeId: "anime-1",
        number: 5,
        title: "5. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a2b0b1d2b34b506938a4117?vid=755898",
      },
      {
        id: "ep-1-6",
        animeId: "anime-1",
        number: 6,
        title: "6. Bölüm",
        duration: 1440,
        iframeUrl:
          "https://tau-video.xyz/embed/6a2b3b60048010175ef9e0f2?vid=755904",
      },
    ],
    _count: { episodes: 6 },
  },
  {
    id: "anime-2",
    title: "Solo Leveling: Arise",
    slug: "solo-leveling-arise",
    synopsis:
      "Dünyanın en zayıf avcısı Sung Jinwoo'nun gölgelerin krallığına uzanan efsanevi yükselişi.",
    coverImage:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    year: 2026,
    season: "Kış",
    rating: 9.4,
    status: "Devam Ediyor",
    createdAt: new Date("2026-02-20"),
    genres: [
      { genre: { id: "g-1", name: "Aksiyon", slug: "aksiyon" } },
      { genre: { id: "g-2", name: "Fantastik", slug: "fantastik" } },
      { genre: { id: "g-3", name: "Macera", slug: "macera" } },
    ],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: `ep-2-${i + 1}`,
      animeId: "anime-2",
      number: i + 1,
      title: `${i + 1}. Bölüm`,
      duration: 1440,
      iframeUrl:
        "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
    })),
    _count: { episodes: 12 },
  },
  {
    id: "anime-3",
    title: "Demon Slayer: Infinity Castle",
    slug: "demon-slayer-infinity-castle",
    synopsis:
      "Sonsuzluk Kalesi'nde İblis Avcıları Birliği ve Kibutsuji Muzan arasındaki son büyük savaş.",
    coverImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    year: 2026,
    season: "Yaz",
    rating: 9.6,
    status: "Devam Ediyor",
    createdAt: new Date("2026-02-15"),
    genres: [
      { genre: { id: "g-1", name: "Aksiyon", slug: "aksiyon" } },
      { genre: { id: "g-8", name: "Doğaüstü", slug: "dogaustu" } },
      { genre: { id: "g-9", name: "Dram", slug: "dram" } },
    ],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: `ep-3-${i + 1}`,
      animeId: "anime-3",
      number: i + 1,
      title: `${i + 1}. Bölüm`,
      duration: 1440,
      iframeUrl:
        "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
    })),
    _count: { episodes: 12 },
  },
  {
    id: "anime-4",
    title: "Frieren: Beyond Journey's End",
    slug: "frieren-beyond-journeys-end",
    synopsis:
      "İblis Kral'ı mağlup eden kahramanlar grubundan elf büyücü Frieren'in yüzyıllar süren hüzünlü ve huzurlu yolculuğu.",
    coverImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    year: 2025,
    season: "Sonbahar",
    rating: 9.5,
    status: "Tamamlandı",
    createdAt: new Date("2026-01-10"),
    genres: [
      { genre: { id: "g-3", name: "Macera", slug: "macera" } },
      { genre: { id: "g-2", name: "Fantastik", slug: "fantastik" } },
      { genre: { id: "g-9", name: "Dram", slug: "dram" } },
    ],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: `ep-4-${i + 1}`,
      animeId: "anime-4",
      number: i + 1,
      title: `${i + 1}. Bölüm`,
      duration: 1440,
      iframeUrl:
        "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
    })),
    _count: { episodes: 12 },
  },
  {
    id: "anime-5",
    title: "Jujutsu Kaisen: Culling Game",
    slug: "jujutsu-kaisen-culling-game",
    synopsis:
      "Kenjaku'nun başlattığı ölümcül İtlaf Oyunları'nda hayatta kalmak ve Gojo'yu mühürden kurtarmak.",
    coverImage:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    year: 2025,
    season: "Kış",
    rating: 9.3,
    status: "Tamamlandı",
    createdAt: new Date("2026-01-05"),
    genres: [
      { genre: { id: "g-1", name: "Aksiyon", slug: "aksiyon" } },
      { genre: { id: "g-8", name: "Doğaüstü", slug: "dogaustu" } },
    ],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      id: `ep-5-${i + 1}`,
      animeId: "anime-5",
      number: i + 1,
      title: `${i + 1}. Bölüm`,
      duration: 1440,
      iframeUrl:
        "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
    })),
    _count: { episodes: 12 },
  },
  {
    id: "anime-6",
    title: "Cyberpunk: Neon Genesis",
    slug: "cyberpunk-neon-genesis",
    synopsis:
      "Neo-Tokyo sokaklarında siber implantlar ve yapay zekalar arasında hayatta kalma savaşı.",
    coverImage:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    year: 2025,
    season: "Sonbahar",
    rating: 9.1,
    status: "Tamamlandı",
    createdAt: new Date("2026-01-01"),
    genres: [
      { genre: { id: "g-7", name: "Bilim Kurgu", slug: "bilim-kurgu" } },
      { genre: { id: "g-1", name: "Aksiyon", slug: "aksiyon" } },
      { genre: { id: "g-10", name: "Psikolojik", slug: "psikolojik" } },
    ],
    episodes: Array.from({ length: 10 }, (_, i) => ({
      id: `ep-6-${i + 1}`,
      animeId: "anime-6",
      number: i + 1,
      title: `${i + 1}. Bölüm`,
      duration: 1440,
      iframeUrl:
        "https://tau-video.xyz/embed/6a25f9ea2b34b506938a4106?vid=755569",
    })),
    _count: { episodes: 10 },
  },
];
