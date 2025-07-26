import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { city_name, latitude, longitude, users } = await req.json();
  const album_id = crypto.randomUUID();
  try {
    await prisma.album.create({
      data: {
        album_id,
        city_name,
        latitude,
        longitude,
      },
    });

    if (Array.isArray(users) && users.length > 0) {
      await Promise.all(
        users.map((user_id: string) =>
          prisma.userAlbum.create({
            data: {
              user_id,
              album_id,
            },
          })
        )
      );
    }

    const response = NextResponse.json({ body: { album_id }, message: "Adding album successful", status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
