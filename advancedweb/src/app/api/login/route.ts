import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    if (SECRET_KEY) {
      const token = jwt.sign({ user_id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

      const response = NextResponse.json({ message: "Login successful", status: 200 });

      response.cookies.set("access_token", token, {
        httpOnly: true,
        secure: false,
        // secure: process.env.NODE_ENV === "production", // Ensure secure cookie in production
        // sameSite: "strict",
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60,
      });

      return response;
    }
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
