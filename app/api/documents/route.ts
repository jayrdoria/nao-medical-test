import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Document } from "@/models/Document";
import { DocumentShare } from "@/models/DocumentShare";
import { createDocumentSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [owned, shared] = await Promise.all([
    Document.find({ ownerId: session.user.id }).sort({ updatedAt: -1 }).lean(),
    DocumentShare.find({ sharedWithId: session.user.id })
      .populate({ path: "documentId", model: Document })
      .lean(),
  ]);

  const sharedDocs = shared
    .filter((s) => s.documentId)
    .map((s) => ({ ...(s.documentId as Record<string, unknown>), isShared: true }));

  return NextResponse.json({ owned, shared: sharedDocs });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const body = await req.json();
  const parsed = createDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const doc = await Document.create({
    title: parsed.data.title,
    content: parsed.data.content ?? { type: "doc", content: [{ type: "paragraph" }] },
    ownerId: session.user.id,
  });

  return NextResponse.json(doc, { status: 201 });
}
