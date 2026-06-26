/* ======================================================
   AniVerse — Mock Data Structure (API-Ready)
   ====================================================== */

const mockData = {
  // ── Hero Slides ──
  heroSlides: [
    {
      id: 1,
      animeId: 111,
      tagline: "Yeni Bölüm Yayında",
      ctaText: "Hemen İzle",
      banner: "assets/asanagi_banner.png"
    }
  ],

  // ── All Anime Database (Uyduruk stock animeler temizlendi) ──
  animes: [
    {
      id: 111,
      title: "Sınıfımın En Güzel İkinci Kızıyla Arkadaş Oldum",
      titleJp: "I Made Friends with the Second Prettiest Girl in My Class",
      image: "assets/asanagi_poster.png",
      banner: "assets/asanagi_banner.png",
      description: "Maehara Maki yeni okuluna ilk girişini bombalar ama bir şekilde ona yardım etmek için geri döner.",
      genres: ["Lise", "Romantik", "Aksiyon"],
      rating: 8.5,
      year: 2026,
      season: "Bahar",
      status: "Devam Ediyor",
      studio: "Bilinmiyor",
      totalEpisodes: 12,
      popularity: 85,
      isNew: true,
      quality: "1080p",
      episodes: [
        { 
          number: 1, 
          title: "1. Bölüm", 
          duration: "24:00", 
          embedUrl: "https://tau-video.xyz/embed/69d5763298be3e47efffd7fd?vid=749135" 
        }
      ]
    }
  ],

  // ── Continue Watching ──
  continueWatching: [
    { animeId: 111, episode: 1, progress: 35, lastWatched: "1 saat önce" }
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

function getAnimes() {
  try {
    const stored = JSON.parse(localStorage.getItem('admin_added_animes') || '[]');
    const deletedAnimeIds = JSON.parse(localStorage.getItem('admin_deleted_animes') || '[]');
    const deletedEps = JSON.parse(localStorage.getItem('admin_deleted_episodes') || '[]');
    const adminAddedEps = JSON.parse(localStorage.getItem('admin_added_episodes') || '[]');

    let combined = [...stored, ...mockData.animes];
    
    // Silinmiş animeleri çıkar
    combined = combined.filter(a => !deletedAnimeIds.includes(a.id) && !deletedAnimeIds.includes(String(a.id)));

    // Bölümleri birleştir ve silinmiş bölümleri çıkar
    return combined.map(anime => {
      const extraEps = adminAddedEps.filter(e => String(e.animeId) === String(anime.id));
      const baseEps = anime.episodes || [];
      let allEps = [...baseEps, ...extraEps];
      
      allEps = allEps.filter(ep => !deletedEps.some(del => String(del.animeId) === String(anime.id) && Number(del.number) === Number(ep.number)));
      
      return { ...anime, episodes: allEps, totalEpisodes: allEps.length > 0 ? allEps.length : anime.totalEpisodes };
    });
  } catch {
    return mockData.animes;
  }
}

// Aliases for backwards compatibility with dynamic live binding
Object.defineProperty(window, 'ANIME_DATA', {
  get: getAnimes,
  configurable: true
});

Object.defineProperty(window, 'HERO_SLIDES', {
  get: function() {
    return getAnimes().slice(0, 5).map((a, idx) => ({
      id: idx + 1,
      animeId: a.id,
      tagline: a.season || "Yeni Bölüm Yayında",
      ctaText: "Hemen İzle",
      banner: a.banner || a.image
    }));
  },
  configurable: true
});

const GENRES = mockData.genresList;
const CONTINUE_WATCHING = mockData.continueWatching;
