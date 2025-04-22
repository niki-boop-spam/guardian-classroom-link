
import * as React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";

// All dashboards are shown as "empty state" until data exists.
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Welcome to v.e.d - Void Education Dashboard
        </h2>
        <p className="text-secondary-foreground text-center mb-6">
          {user
            ? "You have no data to display yet. Use the options in the sidebar to get started."
            : "Please log in to access dashboard features."}
        </p>
        {/* Empty State Illustration (optional) */}
        <img src="/lovable-uploads/58c34551-25c0-41e2-809f-7f7f7d694c72.png" alt="Empty State" className="max-w-xs my-8 opacity-70" />
      </div>
    </Layout>
  );
}
