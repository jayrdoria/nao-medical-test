import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Document } from "@/models/Document";
import { DocumentShare } from "@/models/DocumentShare";
import { User } from "@/models/User";
import { shareDocumentSchema } from "@/lib/validations";
import mongoose from "mongoose";

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

  const doc = await Document.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (doc.ownerId.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const shares = await DocumentShare.find({ documentId: id })
    .populate({ path: "sharedWithId", model: User, select: "name email" })
    .lean();

  const result = shares.map((s) => {
    const u = s.sharedWithId as { name: string; email: string } | null;
    return { name: u?.name ?? "", email: u?.email ?? "" };
  });

  return NextResponse.json(result);
}

export async function POST(req: Request, { params }: Params) {
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

  const body = await req.json();
  const parsed = shareDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.email === session.user.email) {
    return NextResponse.json({ error: "Cannot share with yourself" }, { status: 400 });
  }

  const targetUser = await User.findOne({ email: parsed.data.email }).lean();
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await DocumentShare.findOne({
    documentId: id,
    sharedWithId: targetUser._id,
  }).lean();

  if (existing) {
    return NextResponse.json({ error: "Already shared with this user" }, { status: 409 });
  }

  await DocumentShare.create({
    documentId: id,
    sharedWithId: targetUser._id,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
