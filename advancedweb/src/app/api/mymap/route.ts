import { Album, User } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

type userAlbumType = {
  userId: string;
  albumId: string;
  user?: User;
  album?: Album;
};
export async function GET(req: Request, userId: string) {
  try {
    const userAlbums = await prisma.userAlbum.findMany({
      where: {
        userId: userId,
      },
      include: {
        //take connected info as well
        album: true,
      },
    });

    return userAlbums.map((userAlbum: userAlbumType) => userAlbum.album);
  } catch (error) {
    return NextResponse.json({ message: `Invalid credentials.${error}` }, { status: 401 });
  }
}
