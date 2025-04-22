
import * as React from "react";
import { Layout } from "@/components/layout/Layout";

export default function Meetings() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h2 className="text-3xl font-bold text-primary mb-4">Meetings</h2>
        <p className="text-secondary-foreground text-center mb-6">
          No meetings scheduled.
        </p>
      </div>
    </Layout>
  );
}
