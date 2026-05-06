import { prisma } from "@/libs/prisma";
import { parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ image_id: string }> }) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.access_token;

  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user_id: string;
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: string };
    user_id = decoded.user_id;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const { image_id } = await params;
  const body = await req.json();
  const { filter } = body;

  if (!filter || typeof filter !== "string") {
    return NextResponse.json({ message: "Invalid filter" }, { status: 400 });
  }

  try {
    const image = await prisma.image.findUnique({
      where: { image_id },
      select: { user_id: true },
    });

    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    if (image.user_id !== user_id) {
      return NextResponse.json({ error: "Forbidden: Not your image" }, { status: 403 });
    }

    const updated = await prisma.image.update({
      where: { image_id },
      data: { filter },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update filter", error }, { status: 500 });
  }
}
