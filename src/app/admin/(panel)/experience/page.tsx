import type { Metadata } from "next";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { adminGetCollection } from "@/lib/data";
import type { Experience } from "@/lib/types";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/admin/loading-skeleton";

export const metadata: Metadata = { title: "Experience" };

// Each page has its own Suspense boundary so navigating between admin pages
// shows a loading state instead of blocking on the session check.
export default function ExperienceAdminPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const items = await adminGetCollection<Experience>("experience");
  return <CollectionEditor name="experience" items={items} />;
}
