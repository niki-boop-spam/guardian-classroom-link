
import * as React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { FacultyDashboard } from "./dashboards/FacultyDashboard";
import { StudentDashboard } from "./dashboards/StudentDashboard";
import { ParentDashboard } from "./dashboards/ParentDashboard";
import { initializeDemoData } from "@/lib/data";

export default function Dashboard() {
  const { user } = useAuth();

  // Initialize demo data if not already initialized
  React.useEffect(() => {
    initializeDemoData();
  }, []);

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "faculty":
        return <FacultyDashboard />;
      case "student":
        return <StudentDashboard />;
      case "parent":
        return <ParentDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
}
