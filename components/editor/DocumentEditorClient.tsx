"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor/Editor";
import { ShareModal } from "@/components/documents/ShareModal";

interface Doc {
  _id: string;
  title: string;
  content: Record<string, unknown>;
  ownerId: string;
}

interface Props {
  documentId: string;
  userId: string;
}

export function DocumentEditorClient({ documentId, userId }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [debouncedContent] = useDebounce(content, 1500);
  const [debouncedTitle] = useDebounce(title, 1500);

  useEffect(() => {
    fetch(`/api/documents/${documentId}`)
      .then((r) => {
        if (r.status === 403 || r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setDoc(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .finally(() => setLoading(false));
  }, [documentId]);

  const save = useCallback(
    async (patch: { title?: string; content?: Record<string, unknown> }) => {
      setSaving(true);
      await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setSaving(false);
    },
    [documentId]
  );

  useEffect(() => {
    if (!doc) return;
    if (debouncedContent !== doc.content) {
      save({ content: debouncedContent });
    }
  }, [debouncedContent, doc, save]);

  useEffect(() => {
    if (!doc) return;
    if (debouncedTitle && debouncedTitle !== doc.title) {
      save({ title: debouncedTitle });
    }
  }, [debouncedTitle, doc, save]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-lg mb-4">Document not found or access denied.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const isOwner = doc?.ownerId === userId;

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{saving ? "Saving..." : "Saved"}</span>
          {isOwner && (
            <Button size="sm" onClick={() => setShareOpen(true)}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-12 px-6">
          <input
            className="w-full text-3xl font-bold text-gray-900 outline-none border-none bg-transparent mb-8 placeholder:text-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Document"
          />
          <Editor content={content} onChange={setContent} />
        </div>
      </div>

      {isOwner && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          documentId={documentId}
        />
      )}
    </div>
  );
}
