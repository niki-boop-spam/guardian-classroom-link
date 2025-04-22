
import * as React from "react";

export function ParentDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <h3 className="text-2xl font-bold text-primary mb-4">Parent Dashboard</h3>
      <p className="text-secondary-foreground text-center mb-6">
        No children or records found.
      </p>
    </div>
  );
}
