import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
  //const { searchParams } = new URL(req.url);
  //const keyword = searchParams.get("keyword");
  const { keyword } = await req.json();
  if (!keyword) {
    return NextResponse.json({ message: "No keyword recieved" }, { status: 400 });
  }

  try {
    // Assume `input` is your search string
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { username: { startsWith: keyword} },
              { email: { startsWith: keyword} }
            ]
          }
});

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
