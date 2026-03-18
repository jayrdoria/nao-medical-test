"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, X } from "lucide-react";

interface SharedUser {
  name: string;
  email: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  documentId: string;
}

export function ShareModal({ open, onClose, documentId }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedWith, setSharedWith] = useState<SharedUser[]>([]);
  const [fetching, setFetching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setFetching(true);
    fetch(`/api/documents/${documentId}/share`)
      .then((r) => r.json())
      .then((data) => setSharedWith(Array.isArray(data) ? data : []))
      .catch(() => setSharedWith([]))
      .finally(() => setFetching(false));
  }, [open, documentId]);

  async function handleShare() {
    if (!email.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/documents/${documentId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast({ title: "Document shared successfully" });
      setEmail("");
      // optimistically add to list
      setSharedWith((prev) => [...prev, { name: email, email }]);
    } else {
      toast({ title: data.error ?? "Failed to share", variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="share-email">Invite by email</Label>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="bob@ajaia.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShare()}
                className="flex-1"
              />
              <Button onClick={handleShare} disabled={loading || !email.trim()}>
                {loading ? "..." : "Share"}
              </Button>
            </div>
          </div>

          {/* Shared with list */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Shared with</span>
            </div>
            {fetching ? (
              <p className="text-sm text-gray-400 pl-6">Loading...</p>
            ) : sharedWith.length === 0 ? (
              <p className="text-sm text-gray-400 pl-6">Not shared with anyone yet</p>
            ) : (
              <ul className="space-y-2 pl-1">
                {sharedWith.map((u) => (
                  <li
                    key={u.email}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border"
                  >
                    <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                      {(u.name || u.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{u.name || u.email}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
