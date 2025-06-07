import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
  const { imageIds, albumId } = await req.json(); // expects array of image IDs and album ID
  if (
    !imageIds ||
    !Array.isArray(imageIds) ||
    imageIds.length === 0 ||
    !albumId
  ) {
    return NextResponse.json({ message: "Missing image IDs or album ID" }, { status: 400 });
  }

  try {
    await prisma.image.deleteMany({
      where: {
        image_id: { in: imageIds },
        albumId: albumId, // only delete from the specified album
      },
    });
    return NextResponse.json({ message: "Images removed" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to remove images" }, { status: 500 });
  }
}