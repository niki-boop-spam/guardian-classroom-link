
import * as React from "react";

// Remove demo data and present empty state message only
export function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <h3 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h3>
      <p className="text-secondary-foreground text-center mb-6">
        No data available. Start by adding institution or users.
      </p>
    </div>
  );
}
