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
              className="group rounded-2xl p-4 bg-[#111118] border border-zinc-800 hover:border-[#ff1e42] flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#ff1e42]/15 border border-[#ff1e42]/40 text-[#ff1e42] font-black flex items-center justify-center group-hover:bg-[#ff1e42] group-hover:text-white transition-colors">
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
        <div className="rounded-2xl bg-[#111118] border border-zinc-800 p-6 text-zinc-400 text-sm">
          Bu anime için henüz bölüm eklenmemiş.
        </div>
      )}
    </section>
  );
}
