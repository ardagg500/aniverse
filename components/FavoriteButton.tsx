"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  animeId: string;
  initialFavorited: boolean;
}

export default function FavoriteButton({
  animeId,
  initialFavorited,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleFavorite() {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId }),
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`px-6 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 ${
        favorited
          ? "bg-[#ff1e42] text-white shadow-neon"
          : "glass hover:bg-white/15 text-zinc-200"
      }`}
    >
      <span>{favorited ? "♥ Favorilerde" : "♡ Favorilere Ekle"}</span>
    </button>
  );
}
