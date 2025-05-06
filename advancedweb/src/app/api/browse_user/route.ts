import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ message: "No queryparams recieved" }, { status: 400 });
  }

  try {
    const user = await prisma.User.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
