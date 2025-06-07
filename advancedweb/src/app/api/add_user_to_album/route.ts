import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, album_id } = body;
  if (!user_id || !album_id) {
    return NextResponse.json({ message: "No data received" }, { status: 400 });
  }

  try {
    const album = await prisma.album.findUnique({
      where: {
        album_id: album_id,
      },
    });
    if (!album) {
      return NextResponse.json({ message: "Album not found" }, { status: 404 });
    }

    const existing = await prisma.userAlbum.findUnique({
      where: {
        userId_albumId: {
          userId: user_id,
          albumId: album_id,
        },
      },
    });
    if (existing) {
      return NextResponse.json({ message: "User already added to album" }, { status: 400 });
    }

    const userAlbum = await prisma.userAlbum.create({
      data: {
        userId: user_id,
        albumId: album_id,
      },
    });

    return NextResponse.json({message: "User successfully adde to album"}, { status: 200 });
  } catch (error) {
    console.error("fail to add user to album: ", error);
    throw error;
  }
}
