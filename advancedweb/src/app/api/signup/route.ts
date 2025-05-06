import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY || "slifjlej35434#$%@";

export async function POST(req: NextRequest) {
  try {
    const { username, password, user_id } = await req.json();

    if (!username || !password || !user_id) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // store data in db
    await prisma.User.create({
      data: {
        username,
        password: hashedPassword,
        id: crypto.randomUUID(), //random string
        user_id: user_id,
      },
    });

    // JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    const response = NextResponse.json({ message: "Signup successful" }, { status: 200 });

    // put token to cookie
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, //one hour
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
