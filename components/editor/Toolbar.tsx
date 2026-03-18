"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  editor: TiptapEditor | null;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  active: boolean;
}

export function Toolbar({ editor }: Props) {
  if (!editor) return null;

  const buttons: ToolbarButton[] = [
    {
      icon: <Bold className="h-4 w-4" />,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: <Underline className="h-4 w-4" />,
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      label: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      label: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      label: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <List className="h-4 w-4" />,
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-4 p-2 border rounded-lg bg-gray-50">
      {buttons.map((btn) => (
        <Button
          key={btn.label}
          variant="ghost"
          size="icon"
          title={btn.label}
          onClick={btn.action}
          className={cn(
            "h-8 w-8",
            btn.active && "bg-gray-200 text-gray-900"
          )}
        >
          {btn.icon}
        </Button>
      ))}
    </div>
  );
}
