import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/sidebar";
import { isDbConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-theme md:grid md:grid-cols-[250px_1fr]">
      <Sidebar />
      <main className="min-w-0 px-4 py-6 md:px-10 md:py-10">
        {!isDbConfigured() ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
            <h1 className="font-display text-xl font-semibold">Connect a database to start editing</h1>
            <p className="mt-2 text-sm text-amber-800">
              Add <code className="rounded bg-amber-100 px-1.5 py-0.5">MONGODB_URI</code> to your environment variables (see <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.example</code> and the README), then restart the server. The public site shows starter content until then.
            </p>
          </div>
        ) : (
          // loading.tsx gives every admin page its own loading state on navigation.
          children
        )}
      </main>
    </div>
  );
}
