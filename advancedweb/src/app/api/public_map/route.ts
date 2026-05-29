import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      where: {
        is_public: true,
      },
      include: {
        images: {
          where: {
            is_deleted: false,
          },
          take: 5,
        },
      },
    });

    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({ message: `Error fetching public albums: ${error}` }, { status: 500 });
  }
}
