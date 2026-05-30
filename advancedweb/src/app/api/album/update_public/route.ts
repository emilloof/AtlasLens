import { prisma } from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { albumId, is_public } = await req.json();

    if (!albumId || is_public === undefined) {
      return NextResponse.json(
        { message: "albumId and is_public are required" },
        { status: 400 }
      );
    }

    const updatedAlbum = await prisma.album.update({
      where: {
        album_id: albumId,
      },
      data: {
        is_public: is_public,
      },
    });

    return NextResponse.json({ data: updatedAlbum }, { status: 200 });
  } catch (error) {
    console.error("album update error:", error);
    return NextResponse.json({ message: `Internal Server Error. ${error}` }, { status: 500 });
  }
}
