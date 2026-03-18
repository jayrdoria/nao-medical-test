import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Document } from "@/models/Document";
import { DocumentShare } from "@/models/DocumentShare";
import { updateDocumentSchema } from "@/lib/validations";
import mongoose from "mongoose";

async function canAccess(docId: string, userId: string) {
  const doc = await Document.findById(docId).lean();
  if (!doc) return null;

  const isOwner = doc.ownerId.toString() === userId;
  if (isOwner) return { doc, isOwner: true };

  const share = await DocumentShare.findOne({
    documentId: docId,
    sharedWithId: userId,
  }).lean();

  if (share) return { doc, isOwner: false };
  return null;
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDB();

  const result = await canAccess(id, session.user.id);
  if (!result) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(result.doc);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDB();

  const result = await canAccess(id, session.user.id);
  if (!result) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await Document.findByIdAndUpdate(
    id,
    { ...parsed.data, updatedAt: new Date() },
    { new: true }
  ).lean();

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDB();

  const doc = await Document.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (doc.ownerId.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Promise.all([
    Document.findByIdAndDelete(id),
    DocumentShare.deleteMany({ documentId: id }),
  ]);

  return NextResponse.json({ success: true });
}
