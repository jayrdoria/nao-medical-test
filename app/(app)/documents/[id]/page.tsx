import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DocumentEditorClient } from "@/components/editor/DocumentEditorClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  return <DocumentEditorClient documentId={id} userId={session.user.id} />;
}
