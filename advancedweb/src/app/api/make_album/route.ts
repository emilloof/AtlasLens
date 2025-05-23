import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { album_id, city_name, latitude, longitude, users, images } = await req.json();

  await prisma.album.create({
    data: {
      album_id,
      city_name,
      latitude,
      longitude,
      users,
      images,
    },
  });

  const response = NextResponse.json({ message: "Adding album successful", status: 200 });

  return response;
}
