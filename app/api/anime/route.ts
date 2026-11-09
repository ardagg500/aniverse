import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbAvailable } from "@/lib/prisma";
import { FALLBACK_ANIMES } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const genre = searchParams.get("genre")?.trim() || "";
    const sort = searchParams.get("sort")?.trim() || "latest";

    if (!isDbAvailable) {
      return NextResponse.json({ animes: FALLBACK_ANIMES });
    }

    const animes = await prisma.anime.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { synopsis: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(genre
          ? {
              genres: {
                some: {
                  genre: {
                    slug: genre,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        _count: {
          select: { episodes: true },
        },
      },
      orderBy:
        sort === "rating"
          ? { rating: "desc" }
          : sort === "year"
          ? { year: "desc" }
          : { createdAt: "desc" },
    });

    if (animes.length === 0) {
      return NextResponse.json({ animes: FALLBACK_ANIMES });
    }

    return NextResponse.json({ animes });
  } catch {
    return NextResponse.json({ animes: FALLBACK_ANIMES }, { status: 200 });
  }
}
