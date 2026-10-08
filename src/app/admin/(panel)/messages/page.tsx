import type { Metadata } from "next";
import { MessagesList } from "@/components/admin/messages-list";
import { adminGetMessages } from "@/lib/data";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/admin/loading-skeleton";

export const metadata: Metadata = { title: "Messages" };

// Each page has its own Suspense boundary so navigating between admin pages
// shows a loading state instead of blocking on the session check.
export default function MessagesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const messages = await adminGetMessages();
  return <MessagesList messages={messages} />;
}
