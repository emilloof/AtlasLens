import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY || "slifjlej35434#$%@";

export async function POST(req: NextRequest) {
  try {
    const { userName, password, email } = await req.json();

    if (!userName || !password || !email) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // store data in db
    await prisma.user.create({
      data: {
        username: userName,
        password: hashedPassword,
        user_id: crypto.randomUUID(), //random string
        email: email,
      },
    });

    // JWT token
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "6h" });

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
