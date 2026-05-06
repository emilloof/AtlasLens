"use server";

import { cookies } from "next/headers";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export async function saveImageUrlToDB(imageUrl: string, album_id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token || !SECRET_KEY) {
      return { success: false, error: "Unauthorized" };
    }

    let user_id: string;
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { user_id: string };
      user_id = decoded.user_id;

      if (!user_id) {
        return { success: false, error: "Invalid user ID in token" };
      }
    } catch (err) {
      return { success: false, error: `Invalid token ${err}` };
    }

    if (!imageUrl || !album_id) {
      return { success: false, error: "Missing URL or album_id" };
    }

    const albumExists = await prisma.album.findUnique({
      where: { album_id },
      include: {
        users: {
          where: { user_id },
        },
      },
    });

    if (!albumExists) {
      return { success: false, error: "Album does not exist" };
    }

    if (albumExists.users.length === 0) {
      return { success: false, error: "You don't have permission to upload to this album" };
    }

    const userExists = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!userExists) {
      return { success: false, error: "User does not exist" };
    }

    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        album_id,
        user_id,
      },
    });

    return { success: true, image };

  } catch (error) {
    console.error("DB Save error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
