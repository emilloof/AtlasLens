import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("access_token="))
    ?.split("=")[1];

  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY) as { user_id: string };
    const user = await prisma.user.findUnique({
      where: { user_id: payload.user_id },
      select: { user_id: true, email: true, username: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
