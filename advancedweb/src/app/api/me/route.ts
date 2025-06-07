import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
const SECRET_KEY = process.env.SECRET_KEY;

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader); // ✅ parse cookie string to object
  const token = cookies.access_token;
  if (!token || !SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY) as { email: string };

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { user_id: true, email: true, username: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 401 });
  }
}
