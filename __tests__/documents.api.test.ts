import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next-auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

// Mock mongoose db
vi.mock("@/lib/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

// Mock models
vi.mock("@/models/Document", () => ({
  Document: {
    find: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("@/models/DocumentShare", () => ({
  DocumentShare: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock("@/models/User", () => ({
  User: {
    findOne: vi.fn(),
  },
}));

import { auth } from "@/lib/auth";
import { Document } from "@/models/Document";
import { DocumentShare } from "@/models/DocumentShare";
import { User } from "@/models/User";
import { POST as createDoc, GET as listDocs } from "@/app/api/documents/route";
import { GET as getDoc } from "@/app/api/documents/[id]/route";
import { POST as shareDoc } from "@/app/api/documents/[id]/share/route";

const mockSession = {
  user: { id: "user1", email: "alice@ajaia.dev", name: "Alice" },
};

describe("POST /api/documents", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue(mockSession as never);
  });

  it("creates a document and returns 201", async () => {
    const newDoc = {
      _id: "doc1",
      title: "My Doc",
      content: { type: "doc", content: [] },
      ownerId: "user1",
    };
    vi.mocked(Document.create).mockResolvedValue(newDoc as never);

    const req = new Request("http://localhost/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "My Doc" }),
    });

    const res = await createDoc(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data._id).toBe("doc1");
    expect(data.title).toBe("My Doc");
  });

  it("returns 400 for missing title", async () => {
    const req = new Request("http://localhost/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await createDoc(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/documents/[id]", () => {
  it("returns 403 if user is not owner or shared", async () => {
    vi.mocked(auth).mockResolvedValue(mockSession as never);
    vi.mocked(Document.findById).mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: "doc1",
        ownerId: { toString: () => "different-user" },
      }),
    } as never);
    vi.mocked(DocumentShare.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    } as never);

    const params = Promise.resolve({ id: "507f1f77bcf86cd799439011" });
    const res = await getDoc(new Request("http://localhost/api/documents/doc1"), {
      params,
    });

    expect(res.status).toBe(403);
  });
});

describe("POST /api/documents/[id]/share", () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue(mockSession as never);
    vi.mocked(Document.findById).mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        ownerId: { toString: () => "user1" },
      }),
    } as never);
  });

  it("returns 404 if target user does not exist", async () => {
    vi.mocked(User.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    } as never);

    const req = new Request("http://localhost/api/documents/507f1f77bcf86cd799439011/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "notareal@user.com" }),
    });

    const res = await shareDoc(req, { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) });
    expect(res.status).toBe(404);
  });

  it("returns 409 if already shared", async () => {
    vi.mocked(User.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: "user2", email: "bob@ajaia.dev" }),
    } as never);
    vi.mocked(DocumentShare.findOne).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: "share1" }),
    } as never);

    const req = new Request("http://localhost/api/documents/507f1f77bcf86cd799439011/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bob@ajaia.dev" }),
    });

    const res = await shareDoc(req, { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) });
    expect(res.status).toBe(409);
  });

  it("returns 400 when sharing with yourself", async () => {
    const req = new Request("http://localhost/api/documents/507f1f77bcf86cd799439011/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alice@ajaia.dev" }),
    });

    const res = await shareDoc(req, { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) });
    expect(res.status).toBe(400);
  });
});
