import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { image_id: string } }) {
  const { image_id } = params;
  const body = await req.json();
  const { filter } = body;

  if (!filter || typeof filter !== "string") {
    return NextResponse.json(
      {
        message: "Invalid filter",
      },
      { status: 400 }
    );
  }
  try {
    const updated = await prisma.image.update({
      where: { image_id },
      data: {
        filter,
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update filter", error }, { status: 500 });
  }
}
