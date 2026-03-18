import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Document } from "@/models/Document";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowed = [".txt", ".md"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!allowed.includes(ext)) {
    return NextResponse.json(
      { error: "Only .txt and .md files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 1MB)" }, { status: 400 });
  }

  const text = await file.text();
  const title = file.name.replace(/\.(txt|md)$/i, "");

  await connectDB();

  const doc = await Document.create({
    title,
    content: {
      type: "doc",
      content: text.split("\n").filter(Boolean).map((line) => ({
        type: "paragraph",
        content: [{ type: "text", text: line }],
      })),
    },
    ownerId: session.user.id,
  });

  return NextResponse.json({ id: doc._id.toString() }, { status: 201 });
}
