import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(req: Request) {
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

    if (!user_id) {
      return NextResponse.json({ error: "Invalid user ID in token" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: `Invalid token ${err}` }, { status: 401 });
  }

  const { urls, album_id } = await req.json();

  if (!urls || !Array.isArray(urls) || urls.length === 0 || !album_id) {
    return NextResponse.json({ message: "Missing urls or album_id" }, { status: 400 });
  }

  try {
    const albumExists = await prisma.album.findUnique({
      where: { album_id },
      include: {
        users: {
          where: { user_id },
        },
      },
    });

    if (!albumExists) {
      return NextResponse.json({ error: "Album does not exist" }, { status: 404 });
    }

    if (albumExists.users.length === 0) {
      return NextResponse.json({ error: "You don't have permission to upload to this album" }, { status: 403 });
    }

    const userExists = await prisma.user.findUnique({ where: { user_id } });

    if (!userExists) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    const createdImages = await Promise.all(
      (urls as string[]).map((url) =>
        prisma.image.create({
          data: { url, album_id, user_id },
        })
      )
    );

    return NextResponse.json(
      { message: "Images uploaded successfully", imageUrls: urls, images: createdImages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload images", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
