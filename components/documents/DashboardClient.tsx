"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { UploadModal } from "@/components/documents/UploadModal";
import { useToast } from "@/hooks/use-toast";

interface Doc {
  _id: string;
  title: string;
  updatedAt: string;
  ownerId: string;
  isShared?: boolean;
}

interface Props {
  userId: string;
}

export function DashboardClient({ userId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [owned, setOwned] = useState<Doc[]>([]);
  const [shared, setShared] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setOwned(data.owned ?? []);
      setShared(data.shared ?? []);
    } catch {
      toast({ title: "Failed to load documents", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  async function createDoc() {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled Document" }),
    });
    const doc = await res.json();
    if (res.ok) {
      router.push(`/documents/${doc._id}`);
    }
  }

  async function deleteDoc(id: string) {
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOwned((prev) => prev.filter((d) => d._id !== id));
      toast({ title: "Document deleted" });
    }
  }

  async function renameDoc(id: string, title: string) {
    const res = await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setOwned((prev) => prev.map((d) => (d._id === id ? { ...d, title } : d)));
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button onClick={createDoc}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : (
        <>
          {owned.length === 0 ? (
            <div className="text-center text-gray-400 py-16 border-2 border-dashed rounded-xl">
              <FileIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium">No documents yet</p>
              <p className="text-sm mt-1">Create a new document or upload a file</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {owned.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  doc={doc}
                  isOwner={true}
                  onDelete={deleteDoc}
                  onRename={renameDoc}
                />
              ))}
            </div>
          )}

          {shared.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Shared with Me</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shared.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    doc={doc}
                    isOwner={false}
                    onDelete={deleteDoc}
                    onRename={renameDoc}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={(id) => router.push(`/documents/${id}`)}
      />
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
