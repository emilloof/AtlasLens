import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const albumId = searchParams.get("albumId");

  if (!albumId) {
    return NextResponse.json({ message: "Missing albumId" }, { status: 400 });
  }

  try {
    const images = await prisma.image.findMany({
      where: {
        album_id: albumId,
        is_deleted: true,
      },
      select: {
        image_id: true,
        url: true,
      },
    });

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deleted images:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
