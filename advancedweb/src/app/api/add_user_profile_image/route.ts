import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("profile_image") as File;
  const user_id = formData.get("user_id") as string;
  if (!user_id || !file) {
    return NextResponse.json({ message: "No data received" }, { status: 400 });
  }
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFileName = file.name.replace(/\s+/g, "-");
    const uniqueName = `${Date.now()}-${safeFileName}`;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${uniqueName}`;
    const userExists = await prisma.user.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        user_id: user_id,
      },
      data: {
        profile_image: imageUrl,
      },
    });

    return NextResponse.json({ message: "Userprofile successfully added", data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("fail to add profileImage: ", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
