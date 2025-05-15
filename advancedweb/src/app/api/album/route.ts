import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const albumId = searchParams.get("albumId");
  if (!albumId) {
    return NextResponse.json({ message: "No queryparams recieved" }, { status: 400 });
  }

  try {
    const album = await prisma.album.findUnique({
      where: {
        album_id: albumId,
      },
    });

    if (!album) {
      return NextResponse.json({ message: "Album not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: `Internal Server Error. ${error}` }, { status: 500 });
  }
}
