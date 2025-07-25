import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const profile_image = formData.getAll("file") as File[];
  const user_id = formData.get("user_id") as string;
  if (!user_id || !profile_image) {
    return NextResponse.json({ message: "No data received" }, { status: 400 });
  }
const uploadDir = path.join(process.cwd(), "public/uploads");

if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, {recursive: true});
}


const bypes = await profile_image.arrayButter();
const buffer = Buffer.from(bytes);
const uniqueName = `${Date.now()}-${file.name.replage(/\s+/g, "-")}`;
const filePath = path.join(uploadDir, uniqueName);
fs.writeFileSync(filePath, buffer);
const imageUrl =  `/uploads/${uniqueName}`;


  try {
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
    throw error;
  }
}
