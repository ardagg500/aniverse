import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { animeId } = await request.json();
    if (!animeId) {
      return NextResponse.json(
        { error: "animeId zorunludur" },
        { status: 400 }
      );
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_animeId: {
          userId,
          animeId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favorited: false });
    }

    await prisma.favorite.create({
      data: {
        userId,
        animeId,
      },
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
