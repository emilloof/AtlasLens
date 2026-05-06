import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const image_id = searchParams.get("image_id");

  if (!image_id) {
    return NextResponse.json({ message: "No image_id provided" }, { status: 400 });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { image_id },
      include: {
        writer: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    return NextResponse.json(
      { data: comments, message: "Comments fetched successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get comments: ", error);
    return NextResponse.json({ message: "Failed to get comments", success: false }, { status: 500 });
  }
}
