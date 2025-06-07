import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("file") as File[];
  const album_id = formData.get("album_id") as string;

  if (!files || files.length === 0) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
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
  const albumExists = await prisma.album.findUnique({
    where: { album_id },
  });

  if (!albumExists) {
    return NextResponse.json({ error: "Album does not exist" }, { status: 404 });
  }

  if (Array.isArray(imageUrls)) {
    await Promise.all(
      imageUrls.map((url: string) =>
        prisma.image.create({
          data: {
            url,
            albumId: album_id,
          },
        })
      )
    );
  }
  // if (!fs.existsSync(uploadDir)) {
  //   fs.mkdirSync(uploadDir, { recursive: true });
  // }

  // Use a unique filename to avoid overwriting

  // Optionally: Save imageUrl to your DB here

  return NextResponse.json({ message: "Image uploaded successfully", imageUrls }, { status: 200 });
}
