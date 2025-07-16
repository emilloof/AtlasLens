import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { writer_id, content, image_id, parent_id } = body;
  if (!content || !writer_id || !image_id) {
    return NextResponse.json({ message: "No data received" }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        writer_id,
        image_id,
        parent_id: parent_id ?? null,
      },
      include: {
        writer: true,
      },
    });
    return NextResponse.json({ data: newComment, message: "Comment created", success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment: ", error);
    return NextResponse.json({ message: "Failed to create comment", success: false }, { status: 500 });
  }
}
