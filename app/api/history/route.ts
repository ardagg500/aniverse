import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, isDbAvailable } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId || !isDbAvailable) {
      return NextResponse.json({ saved: false }, { status: 200 });
    }

    const body = await request.json();
    const { episodeId, progressSeconds = 0 } = body;

    if (!episodeId) {
      return NextResponse.json(
        { error: "episodeId zorunludur" },
        { status: 400 }
      );
    }

    const record = await prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId,
          episodeId,
        },
      },
      update: {
        progressSeconds: Number(progressSeconds) || 0,
        watchedAt: new Date(),
      },
      create: {
        userId,
        episodeId,
        progressSeconds: Number(progressSeconds) || 0,
      },
    });

    return NextResponse.json({ saved: true, record });
  } catch (error) {
    console.error("POST /api/history error:", error);
    return NextResponse.json({ saved: false }, { status: 500 });
  }
}
