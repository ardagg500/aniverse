import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const genre = searchParams.get("genre")?.trim() || "";
    const sort = searchParams.get("sort")?.trim() || "latest";

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

    return NextResponse.json({ animes });
  } catch (error) {
    console.error("GET /api/anime error:", error);
    return NextResponse.json({ animes: [] }, { status: 200 });
  }
}
