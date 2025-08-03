import { Album, User } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";
import { parse } from "cookie";
import { NextResponse } from "next/server";

type userAlbumType = {
  user_id: string;
  album_id: string;
  user?: User;
  album?: Album;
};
export async function POST(req: Request) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.access_token;
  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user_id } = await req.json();
  try {
    const userAlbums = await prisma.userAlbum.findMany({
      where: {
        user_id,
      },
      include: {
        //take connected info as well
        album: {
          include: {
            images: {
              where: {
                is_deleted: false,
              },
              take: 5,
            },
          },
        },
      },
    });

    return NextResponse.json(userAlbums.map((userAlbum: userAlbumType) => userAlbum.album));
  } catch (error) {
    return NextResponse.json({ message: `Invalid credentials.${error}` }, { status: 401 });
  }
}
