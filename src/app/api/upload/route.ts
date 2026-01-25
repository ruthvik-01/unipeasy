import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin (server-side)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const subject = formData.get("subject") as string;
    const folder = formData.get("folder") as string;

    if (!file || !userId || !subject || !folder) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `documents/${userId}/${subject}/${folder}/${timestamp}_${safeName}`;

    const bucket = getStorage().bucket();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const fileRef = bucket.file(filePath);
    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make file publicly accessible and get URL
    await fileRef.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
