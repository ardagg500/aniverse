"use client";

import React, { useEffect } from "react";

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
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-neon">
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
