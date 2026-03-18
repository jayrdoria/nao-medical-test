"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Doc {
  _id: string;
  title: string;
  updatedAt: string;
  isShared?: boolean;
}

interface Props {
  doc: Doc;
  isOwner: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function DocumentCard({ doc, isOwner, onDelete, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(doc.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function handleRenameSubmit() {
    const trimmed = title.trim();
    if (trimmed && trimmed !== doc.title) {
      onRename(doc._id, trimmed);
    } else {
      setTitle(doc.title);
    }
    setEditing(false);
  }

  return (
    <div className="group relative bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
      <Link href={`/documents/${doc._id}`} className="block">
        <div className="flex items-start gap-3">
          <FileText className="h-8 w-8 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                ref={inputRef}
                className="w-full text-sm font-medium border-b border-blue-400 outline-none bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                  if (e.key === "Escape") {
                    setTitle(doc.title);
                    setEditing(false);
                  }
                }}
                onClick={(e) => e.preventDefault()}
              />
            ) : (
              <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(doc.updatedAt).toLocaleDateString()}
            </p>
            {doc.isShared && (
              <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                Shared
              </span>
            )}
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setEditing(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(doc._id);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
