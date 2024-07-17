// app/api/upload-images/route.ts
import { NextResponse } from "next/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/utils/firebase-service";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Verify JWT token
    const authorization = req.headers.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.NEXT_PUBLIC_AUTH_SECRET as string);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse the form data
    const form = await req.formData();

    const fileRoute = form.get("fileRoute") || "/";
    const entries = form.getAll("files");

    const files = entries as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const arrayOfLinkImages = await Promise.all(
      files.map(async (file: File) => {
        const imageRef = ref(storage, `/images${fileRoute}/${file.name}`);
        await uploadBytes(imageRef, Buffer.from(await file.arrayBuffer()));
        return getDownloadURL(imageRef);
      })
    );

    return NextResponse.json({ images: arrayOfLinkImages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
