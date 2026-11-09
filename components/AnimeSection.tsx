import Link from "next/link";
import React from "react";
import AnimeCard, { AnimeCardProps } from "@/components/AnimeCard";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen, ana sayfadaki "Trend Olanlar", "Son Eklenenler" gibi
// anime listesi bölümlerini oluşturur. Başlık stilini ve grid yapısını
// buradan düzenleyebilirsiniz.
// ============================================================================

interface AnimeSectionProps {
  title: string;
  subtitle?: string;
  moreHref?: string;
  animes: AnimeCardProps[];
}

export default function AnimeSection({
  title,
  subtitle,
  moreHref,
  animes,
}: AnimeSectionProps) {
  return (
    <section className="space-y-6">
      {/* GELECEK MODEL İÇİN: Bölüm başlığı ve 'Tümünü Gör' linki */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-1.5 h-7 rounded-full bg-[#ff1e42]" />
            {title}
          </h2>
          {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
        </div>
        {moreHref && (
          <Link
            href={moreHref}
            className="text-sm font-semibold text-[#ff1e42] hover:underline"
          >
            Tümünü Gör →
          </Link>
        )}
      </div>

      {/* GELECEK MODEL İÇİN: Kartların dizildiği Grid yapısı (sütun sayılarını buradan değiştirebilirsiniz) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} {...anime} />
        ))}
      </div>
    </section>
  );
}
