/* ======================================================
   AniVerse — Mock Data Structure (API-Ready)
   ====================================================== */

const mockData = {
  // ── Hero Slides ──
  heroSlides: [
    {
      id: 1,
      animeId: 101,
      tagline: "Yeni Sezon Başladı",
      ctaText: "Hemen İzle",
      banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1920&h=800", // Tokyo Cyberpunk
    },
    {
      id: 2,
      animeId: 102,
      tagline: "Efsanevi Bir Macera",
      ctaText: "Keşfet",
      banner: "https://images.unsplash.com/photo-1541562232579-51fca395f60d?auto=format&fit=crop&q=80&w=1920&h=800", // Fantasy Landscape
    },
    {
      id: 3,
      animeId: 103,
      tagline: "Yılın En Çok Beklenen Serisi",
      ctaText: "Bölüm 1'i İzle",
      banner: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=1920&h=800", // Neon Sword/Action
    }
  ],

  // ── All Anime Database ──
  animes: [
    {
      id: 101,
      title: "Neon Echoes",
      titleJp: "ネオン・エコーズ",
      image: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=600&h=900", // Cyberpunk Girl
      banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "2142 yılında Neo-Tokyo'da geçen, hafızasını kaybetmiş bir dedektifin sırları çözme hikayesi. Görsel efektleri ve müzikleriyle büyüleyen bir başyapıt.",
      genres: ["Bilim Kurgu", "Aksiyon", "Gizem"],
      rating: 9.2,
      year: 2025,
      season: "Kış",
      status: "Devam Ediyor",
      studio: "Mappa",
      totalEpisodes: 24,
      popularity: 99,
      isNew: true,
      quality: "1080p",
      episodes: [
        { number: 1, title: "Uyanış", duration: "24:10" },
        { number: 2, title: "Karanlık Sokaklar", duration: "23:45" },
        { number: 3, title: "Hedef", duration: "24:00" },
      ]
    },
    {
      id: 102,
      title: "Silent Blade",
      titleJp: "静かなる刃",
      image: "https://images.unsplash.com/photo-1563505366311-b016335160c5?auto=format&fit=crop&q=80&w=600&h=900", // Samurai/Katana
      banner: "https://images.unsplash.com/photo-1541562232579-51fca395f60d?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "Edo döneminde tek başına seyahat eden sessiz bir samurayın, efsanevi kılıçların peşindeki fantastik macerası.",
      genres: ["Aksiyon", "Tarihi", "Fantastik"],
      rating: 8.8,
      year: 2024,
      season: "Sonbahar",
      status: "Tamamlandı",
      studio: "Ufotable",
      totalEpisodes: 12,
      popularity: 85,
      isNew: false,
      quality: "4K",
      episodes: [
        { number: 1, title: "Rüzgarın Sesi", duration: "24:00" },
        { number: 2, title: "Eski Dostlar", duration: "24:00" },
      ]
    },
    {
      id: 103,
      title: "Crystal Magic Academy",
      titleJp: "クリスタル魔法学園",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600&h=900", // Magic/Fantasy
      banner: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "Büyü yeteneği olmayan bir gencin, en prestijli büyücü akademisine kabul edilmesiyle başlayan maceraları.",
      genres: ["Fantastik", "Okul", "Komedi"],
      rating: 8.5,
      year: 2025,
      season: "Kış",
      status: "Devam Ediyor",
      studio: "CloverWorks",
      totalEpisodes: 24,
      popularity: 92,
      isNew: true,
      quality: "1080p",
      episodes: [
        { number: 1, title: "İlk Gün", duration: "24:00" },
      ]
    },
    {
      id: 104,
      title: "Stellar Horizon",
      titleJp: "星の彼方",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600&h=900", // Space/Galaxy
      banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "İnsanlığın yeni bir ev arayışında uzayın derinliklerine yaptığı epik yolculuk.",
      genres: ["Bilim Kurgu", "Macera", "Dram"],
      rating: 9.0,
      year: 2023,
      season: "Yaz",
      status: "Tamamlandı",
      studio: "Wit Studio",
      totalEpisodes: 26,
      popularity: 78,
      isNew: false,
      quality: "1080p",
      episodes: [
        { number: 1, title: "Dünyaya Veda", duration: "45:00" },
      ]
    },
    {
      id: 105,
      title: "Shadow Syndicate",
      titleJp: "影のシンジケート",
      image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?auto=format&fit=crop&q=80&w=600&h=900", // Dark Alley/Mafia
      banner: "https://images.unsplash.com/photo-1510251197878-a2e6d2cb590c?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "Yeraltı dünyasının en güçlü mafya ailesine sızan çaylak bir polisin gerilim dolu hikayesi.",
      genres: ["Gerilim", "Aksiyon", "Gizem"],
      rating: 8.7,
      year: 2025,
      season: "Kış",
      status: "Devam Ediyor",
      studio: "Bones",
      totalEpisodes: 12,
      popularity: 88,
      isNew: true,
      quality: "1080p",
      episodes: []
    },
    {
      id: 106,
      title: "Love in Tokyo",
      titleJp: "東京の恋",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600&h=900", // Romance/Tokyo
      banner: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "Tokyo'da tesadüfen tanışan iki üniversite öğrencisinin sıcacık romantik komedisi.",
      genres: ["Romantik", "Komedi", "Yaşamdan Kesitler"],
      rating: 8.2,
      year: 2024,
      season: "Bahar",
      status: "Tamamlandı",
      studio: "Kyoto Animation",
      totalEpisodes: 12,
      popularity: 70,
      isNew: false,
      quality: "1080p",
      episodes: []
    },
    {
      id: 107,
      title: "Demon's Requiem",
      titleJp: "悪魔のレクイエム",
      image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=600&h=900", // Dark/Red/Demonic
      banner: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "İblislerin dünyaya saldırdığı karanlık bir fantezi dünyasında hayatta kalma mücadelesi.",
      genres: ["Korku", "Aksiyon", "Doğaüstü"],
      rating: 8.9,
      year: 2025,
      season: "Kış",
      status: "Devam Ediyor",
      studio: "Mappa",
      totalEpisodes: 24,
      popularity: 95,
      isNew: true,
      quality: "4K",
      episodes: []
    },
    {
      id: 108,
      title: "Virtual Fighters",
      titleJp: "仮想戦士",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600&h=900", // Gaming/VR
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "Dünyanın en popüler VR oyununda bir numara olmaya çalışan genç bir oyuncunun e-spor macerası.",
      genres: ["Oyun", "Aksiyon", "Komedi"],
      rating: 7.9,
      year: 2024,
      season: "Yaz",
      status: "Tamamlandı",
      studio: "A-1 Pictures",
      totalEpisodes: 12,
      popularity: 65,
      isNew: false,
      quality: "1080p",
      episodes: []
    },
    {
      id: 109,
      title: "Spirit World",
      titleJp: "精霊の森",
      image: "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&q=80&w=600&h=900", // Spiritual/Nature
      banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "Ruhları görebilen küçük bir kızın, ruhlar alemi ve insan dünyası arasındaki dengeyi koruma görevi.",
      genres: ["Doğaüstü", "Dram", "Fantastik"],
      rating: 9.1,
      year: 2023,
      season: "Bahar",
      status: "Tamamlandı",
      studio: "Studio Ghibli",
      totalEpisodes: 1, // Movie
      popularity: 90,
      isNew: false,
      quality: "1080p",
      episodes: []
    },
    {
      id: 110,
      title: "Gundam: Iron Pulse",
      titleJp: "ガンダム：アイアンパルス",
      image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?auto=format&fit=crop&q=80&w=600&h=900", // Mecha/Robot
      banner: "https://images.unsplash.com/photo-1535378273068-9bb67d5beacd?auto=format&fit=crop&q=80&w=1920&h=800",
      description: "İki gezegen arasındaki savaşta, yeni nesil bir mecha pilotunun zorlu seçimleri.",
      genres: ["Mecha", "Bilim Kurgu", "Aksiyon"],
      rating: 8.6,
      year: 2025,
      season: "Kış",
      status: "Devam Ediyor",
      studio: "Sunrise",
      totalEpisodes: 24,
      popularity: 82,
      isNew: true,
      quality: "1080p",
      episodes: []
    }
  ],

  // ── Continue Watching (Mock User Data) ──
  continueWatching: [
    { animeId: 101, episode: 2, progress: 65, lastWatched: "2 saat önce" },
    { animeId: 102, episode: 5, progress: 15, lastWatched: "Dün" },
    { animeId: 107, episode: 1, progress: 80, lastWatched: "2 gün önce" }
  ],

  // ── Genres ──
  genresList: [
    { name: "Aksiyon", icon: "⚔️", count: 1245 },
    { name: "Romantik", icon: "❤️", count: 850 },
    { name: "Bilim Kurgu", icon: "🚀", count: 620 },
    { name: "Fantastik", icon: "🪄", count: 1100 },
    { name: "Gizem", icon: "🔍", count: 430 },
    { name: "Korku", icon: "👻", count: 210 },
    { name: "Komedi", icon: "😂", count: 980 },
    { name: "Dram", icon: "🎭", count: 760 },
    { name: "Mecha", icon: "🤖", count: 320 },
    { name: "Spor", icon: "⚽", count: 410 },
    { name: "Oyun", icon: "🎮", count: 280 },
    { name: "Yaşamdan Kesitler", icon: "☕", count: 540 }
  ]
};

// Aliases for backwards compatibility with previous JS functions (to be gradually phased out if needed)
const ANIME_DATA = mockData.animes;
const HERO_SLIDES = mockData.heroSlides;
const GENRES = mockData.genresList;
const CONTINUE_WATCHING = mockData.continueWatching;
