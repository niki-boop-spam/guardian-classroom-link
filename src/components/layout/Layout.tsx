
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth";
import { ChangePasswordDialog } from "../ui/AuthForms";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex flex-col flex-1 min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          {user?.isFirstLogin ? (
            <ChangePasswordDialog defaultOpen />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
