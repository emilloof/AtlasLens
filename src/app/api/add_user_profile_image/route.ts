import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { parse } from "cookie";

export async function POST(req: Request) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.access_token;

  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl, user_id } = await req.json();

  if (!user_id || !imageUrl) {
    return NextResponse.json({ message: "No data received" }, { status: 400 });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { profile_image: imageUrl },
    });

    return NextResponse.json({ message: "Profile image updated", data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("fail to add profileImage: ", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
