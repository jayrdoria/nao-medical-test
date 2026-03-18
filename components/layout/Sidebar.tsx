"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FileText, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r flex flex-col h-screen">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Ajaia Docs</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link href="/dashboard">
          <span
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/dashboard"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </span>
        </Link>
      </nav>

      <div className="p-3 border-t">
        <div className="mb-2 px-3">
          <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
