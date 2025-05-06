import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "eifjsdlkfjkj231$@";

export async function POST(req: Request) {
  const { id, password } = await req.json();

  try {
    const user = await prisma.User.findUnique({
      where: { user_id: id },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "1h" });

    const response = NextResponse.json({ message: "Login successful", status: 200 });
    console.log("response", response);
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Ensure secure cookie in production
      // sameSite: "strict",
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60,
    });
    console.log("token", token);
    return response;
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
