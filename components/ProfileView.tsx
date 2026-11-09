import Link from "next/link";
import React from "react";
import AnimeCard, { AnimeCardProps } from "@/components/AnimeCard";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen Profil sayfasının görünümünü (kullanıcı kartı, izleme geçmişi
// ve favoriler) içerir. Renkleri ve kart düzenini buradan değiştirebilirsiniz.
// ============================================================================

interface HistoryItem {
  id: string;
  animeTitle: string;
  animeSlug: string;
  episodeNumber: number;
  episodeTitle: string;
}

interface ProfileViewProps {
  userName: string;
  userEmail: string;
  favorites: AnimeCardProps[];
  history: HistoryItem[];
}

export default function ProfileView({
  userName,
  userEmail,
  favorites,
  history,
}: ProfileViewProps) {
  return (
    <div className="space-y-12">
      {/* GELECEK MODEL İÇİN: Kullanıcı üst bilgi kartı */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            {(userName || userEmail || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
              {userName}
            </h1>
            <p className="text-sm text-zinc-300">{userEmail}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
            <div className="text-xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
              {favorites.length}
            </div>
            <div className="text-xs text-zinc-300">Favori Anime</div>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
            <div className="text-xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
              {history.length}
            </div>
            <div className="text-xs text-zinc-300">İzlenen Bölüm</div>
          </div>
        </div>
      </div>

      {/* GELECEK MODEL İÇİN: İzleme geçmişi bölümü */}
      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-red-500 to-purple-600 shadow-[0_0_12px_rgba(255,30,66,0.6)]" />
          İzleme Geçmişi
        </h2>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/watch/${item.animeSlug}/${item.episodeNumber}`}
                className="group rounded-2xl p-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(220,38,38,0.25)] flex items-center justify-between transition-all duration-300"
              >
                <div className="space-y-1 pr-3">
                  <h3 className="font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {item.animeTitle}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Bölüm {item.episodeNumber}: {item.episodeTitle}
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold shrink-0">
                  Devam Et →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center text-zinc-400 text-sm">
            Henüz izleme geçmişiniz bulunmuyor.
          </div>
        )}
      </section>

      {/* GELECEK MODEL İÇİN: Favori animeler bölümü */}
      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-red-500 to-purple-600 shadow-[0_0_12px_rgba(255,30,66,0.6)]" />
          Favorilerim
        </h2>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {favorites.map((anime) => (
              <AnimeCard key={anime.id} {...anime} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#111118] border border-zinc-800 p-8 text-center text-zinc-400 text-sm">
            Henüz favorilerinize anime eklemediniz.
          </div>
        )}
      </section>
    </div>
  );
}
