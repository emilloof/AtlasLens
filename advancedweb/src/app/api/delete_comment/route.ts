import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const comment_id = searchParams.get("comment_id");

  if (!comment_id) {
    return NextResponse.json({ message: "No comment_id provided" }, { status: 400 });
  }

  try {
    await prisma.comment.delete({
      where: { comment_id },
    });
    return NextResponse.json({ message: "Comment deleted", success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete comment: ", error);
    return NextResponse.json({ message: "Failed to delete comment", success: false }, { status: 500 });
  }
}
