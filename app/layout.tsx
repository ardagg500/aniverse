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
      <body className="min-h-screen flex flex-col bg-[#07070b] text-zinc-100 antialiased selection:bg-[#ff1e42] selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
