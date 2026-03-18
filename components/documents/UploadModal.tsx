"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export function UploadModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const ALLOWED = [".txt", ".md"];

  function validateAndSet(f: File) {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED.includes(ext)) {
      toast({ title: "Only .txt and .md files are allowed", variant: "destructive" });
      return;
    }
    setFile(f);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast({ title: "File uploaded successfully" });
      setFile(null);
      onClose();
      onSuccess(data.id);
    } else {
      toast({ title: data.error ?? "Upload failed", variant: "destructive" });
    }
  }

  function handleClose() {
    setFile(null);
    setDragging(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-sm text-gray-500">
            Accepted formats: <strong>.txt</strong> and <strong>.md</strong> only
          </p>

          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-150",
              dragging
                ? "border-blue-500 bg-blue-50 scale-[1.01]"
                : file
                ? "border-green-400 bg-green-50"
                : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
            )}
            onClick={() => !file && inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-green-500" />
                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload
                  className={cn(
                    "h-10 w-10 transition-colors",
                    dragging ? "text-blue-500" : "text-gray-300"
                  )}
                />
                <p className="text-sm font-medium text-gray-600">
                  {dragging ? "Drop it here!" : "Drag & drop or click to browse"}
                </p>
                <p className="text-xs text-gray-400">.txt or .md · max 1MB</p>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) validateAndSet(f);
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
