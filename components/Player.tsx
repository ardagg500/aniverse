"use client";

import React, { useEffect } from "react";

// ============================================================================
// GELECEK MODEL İÇİN NOT:
// Bu bileşen Video Oynatıcı (Player) çerçevesidir.
// Oynatıcı kenarlıklarını veya gölge efektini buradan değiştirebilirsiniz.
// useEffect içindeki izleme geçmişi kaydına dokunmayın.
// ============================================================================

interface PlayerProps {
  episodeId: string;
  iframeUrl: string;
  title: string;
}

export default function Player({ episodeId, iframeUrl, title }: PlayerProps) {
  useEffect(() => {
    if (!episodeId) return;
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ episodeId, progressSeconds: 60 }),
    }).catch(() => {});
  }, [episodeId]);

  return (
    /* GELECEK MODEL İÇİN: Video oynatıcı dış çerçevesini buradan değiştirebilirsiniz */
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800">
      {iframeUrl ? (
        <iframe
          src={iframeUrl}
          title={title}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <video
          src="/videos/şimdi_böyle_bir_sitem_var_bu_s.mp4"
          controls
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
