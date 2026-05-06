// src/app/api/remove_image/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { parse } from "cookie";

export async function POST(req: Request) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.access_token;
  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageIds, album_id } = await req.json();
  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0 || !album_id) {
    return NextResponse.json({ message: "Missing image IDs or album ID" }, { status: 400 });
  }

  try {
    await prisma.image.updateMany({
      where: {
        image_id: { in: imageIds },
        album_id,
      },
      data: {
        is_deleted: true,
      },
    });

    return NextResponse.json({ message: "Images marked as deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to mark images deleted" }, { status: 500 });
  }
}
