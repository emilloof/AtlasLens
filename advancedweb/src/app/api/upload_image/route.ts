import fs from "fs";
import path from "path";
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

  const formData = await req.formData();
  const files = formData.getAll("file") as File[];
  const album_id = formData.get("album_id") as string;

  if (!files || files.length === 0 || !album_id) {
    return NextResponse.json({ message: "Missing files or album_id" }, { status: 400 });
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

    const userExists = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      const imageUrl = `/uploads/${uniqueName}`;
      imageUrls.push(imageUrl);
    }

    const createdImages = [];
    for (const url of imageUrls) {
      try {
        const image = await prisma.image.create({
          data: {
            url,
            album_id,
            user_id,
          },
        });
        createdImages.push(image);
      } catch (imageError) {
        console.error(`Failed to create image record for ${url}:`, imageError);

        const filePath = path.join(uploadDir, path.basename(url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw imageError;
      }
    }

    return NextResponse.json(
      {
        message: "Images uploaded successfully",
        imageUrls,
        images: createdImages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message: "Failed to upload images",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
