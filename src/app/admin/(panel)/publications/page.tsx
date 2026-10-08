import type { Metadata } from "next";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { adminGetCollection } from "@/lib/data";
import type { Publication } from "@/lib/types";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/admin/loading-skeleton";

export const metadata: Metadata = { title: "Research" };

// Each page has its own Suspense boundary so navigating between admin pages
// shows a loading state instead of blocking on the session check.
export default function ResearchAdminPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const items = await adminGetCollection<Publication>("publications");
  return <CollectionEditor name="publications" items={items} />;
}
