import type { Metadata } from "next";
import { ProfileForm } from "@/components/admin/profile-form";
import { adminGetProfile } from "@/lib/data";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/admin/loading-skeleton";

export const metadata: Metadata = { title: "Profile" };

// Each page has its own Suspense boundary so navigating between admin pages
// shows a loading state instead of blocking on the session check.
export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const profile = await adminGetProfile();
  return <ProfileForm profile={profile} />;
}
