import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AniVerse | Yeni Nesil Anime Platformu",
  description: "AniVerse 4K HDR anime izleme ve keşif platformu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0a0714] to-[#030307] text-zinc-100 antialiased selection:bg-red-600 selection:text-white relative">
        {/* ================================================================= */}
        {/* TÜM SİTEYE YAYILAN DERİN UZAY / NEBULA RENK VE IŞIK KATMANI       */}
        {/* ================================================================= */}
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
          {/* Üst Mor ve Mavi Nebula */}
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-purple-700/20 blur-[130px] animate-float-glow" />
          <div className="absolute top-10 right-[-10%] w-[750px] h-[750px] rounded-full bg-indigo-600/15 blur-[140px] animate-pulse" />

          {/* Orta Koyu Kırmızı ve Magenta Parıltı */}
          <div className="absolute top-[40%] left-[20%] w-[650px] h-[650px] rounded-full bg-red-600/15 blur-[150px] animate-float-glow" />

          {/* Alt Mor / Lacivert Nebula */}
          <div className="absolute bottom-[-10%] right-[-5%] w-[850px] h-[850px] rounded-full bg-purple-900/25 blur-[160px]" />
          <div className="absolute bottom-[20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-blue-950/30 blur-[140px]" />
        </div>

        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
