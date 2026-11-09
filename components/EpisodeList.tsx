import Link from "next/link";
import React from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen Anime Detay sayfasındaki bölüm listesini oluşturur.
// Bölüm kutularının renklerini ve dizilimini buradan değiştirebilirsiniz.
// ============================================================================

interface EpisodeItem {
  id: string;
  number: number;
  title: string;
  duration?: number | null;
}

interface EpisodeListProps {
  animeSlug: string;
  episodes: EpisodeItem[];
}

export default function EpisodeList({ animeSlug, episodes }: EpisodeListProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
        <span className="w-1.5 h-7 rounded-full bg-[#ff1e42]" />
        Bölümler ({episodes.length})
      </h2>

      {/* GELECEK MODEL İÇİN: Bölüm kartları grid yapısı ve renkleri */}
      {episodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/${animeSlug}/${ep.number}`}
              className="group rounded-2xl p-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-red-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(220,38,38,0.25)] flex items-center justify-between transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-black flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                  {ep.number}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">
                    {ep.title || `${ep.number}. Bölüm`}
                  </h3>
                  {ep.duration && (
                    <p className="text-xs text-zinc-400">
                      {Math.round(ep.duration / 60)} dk
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                İzle →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-zinc-400 text-sm">
          Bu anime için henüz bölüm eklenmemiş.
        </div>
      )}
    </section>
  );
}
