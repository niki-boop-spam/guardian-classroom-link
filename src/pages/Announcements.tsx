
import * as React from "react";
import { Layout } from "@/components/layout/Layout";

export default function Announcements() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            View and manage announcements
          </p>
        </div>
        
        <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Announcement functionality will be implemented soon</p>
        </div>
      </div>
    </Layout>
  );
}
