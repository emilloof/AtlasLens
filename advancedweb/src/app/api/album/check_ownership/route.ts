import { NextResponse } from "next/server";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { prisma } from "@/libs/prisma";

const SECRET_KEY = process.env.SECRET_KEY;

export async function GET(req: Request) {
  if (!SECRET_KEY) {
    return NextResponse.json({ error: "Secret key is missing" }, { status: 500 });
  }

  const url = new URL(req.url);
  const album_id = url.searchParams.get("album_id");

  if (!album_id) {
    return NextResponse.json({ error: "album_id is required" }, { status: 400 });
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.access_token;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user_id: string;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: string };
    user_id = decoded.user_id;

    if (!user_id) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const album = await prisma.userAlbum.findUnique({
      where: {
        user_id_album_id: {
          user_id,
          album_id,
        },
      },
    });

    const isOwner = !!album;

    return NextResponse.json({ isOwner }, { status: 200 });
  } catch (err) {
    console.error("Ownership check error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
