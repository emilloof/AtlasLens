import { prisma } from "@/libs/prisma";
import { parse } from "cookie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.access_token;
  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
        user_id_album_id: {
          user_id: user_id,
          album_id: album_id,
        },
      },
    });
    if (existing) {
      return NextResponse.json({ message: "User already added to album" }, { status: 400 });
    }
    const newUserAlbum = await prisma.userAlbum.create({
      data: {
        user_id,
        album_id,
      },
    });
    return NextResponse.json({ message: "User successfully add to album", newUserAlbum }, { status: 200 });
  } catch (error) {
    console.error("fail to add user to album: ", error);
    throw error;
  }
}
