import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { image_id, writer_id } = await req.json();
  if (!image_id || !writer_id) {
    return NextResponse.json(
      {
        message: "Missing data",
      },
      { status: 400 }
    );
  }
  try {
    const liked_image = await prisma.image.findUnique({
      where: {
        image_id,
      },
    });
    if (!liked_image) {
      return NextResponse.json({ message: "No Image found" }, { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        user_id_image_id: {
          user_id: writer_id,
          image_id,
        },
      },
    });
    let action: "liked" | "disliked";
    if (existingLike) {
      await prisma.like.delete({
        where: {
          user_id_image_id: {
            user_id: writer_id,
            image_id,
          },
        },
      });
      action = "disliked";
    } else {
      await prisma.like.create({
        data: {
          user_id: writer_id,
          image_id,
        },
      });
      action = "liked";
    }

    return NextResponse.json(
      {
        message: `Image successfully ${action}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 });
  }
}
