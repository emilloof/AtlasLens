import { Album, User } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

type userAlbumType = {
  user_id: string;
  album_id: string;
  user?: User;
  album?: Album;
};
export async function POST(req: Request) {
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
              take: 5, // Get only the first 5 images
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
