
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  UserRound,
  MessageSquare,
  Bell,
  Calendar,
  BookOpen,
  User,
  Settings,
  School,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-x-2 py-2 px-3 rounded-md text-sm font-medium",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-secondary"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { isAdmin, isFaculty, isStudent, isParent } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col w-64 bg-white border-r shadow-sm transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b">
        <h2 className="text-xl font-bold text-primary">GCL</h2>
      </div>

      <div className="flex flex-col flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Common Navigation */}
        <div className="space-y-1">
          <NavItem
            to="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            isActive={isActive("/")}
          />
          <NavItem
            to="/messages"
            icon={<MessageSquare size={18} />}
            label="Messages"
            isActive={isActive("/messages")}
          />
          <NavItem
            to="/announcements"
            icon={<Bell size={18} />}
            label="Announcements"
            isActive={isActive("/announcements")}
          />
          <NavItem
            to="/meetings"
            icon={<Calendar size={18} />}
            label="Meetings"
            isActive={isActive("/meetings")}
          />
        </div>

        {/* Admin-specific navigation */}
        {isAdmin() && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground">
              Administration
            </h3>
            <NavItem
              to="/admin/users"
              icon={<Users size={18} />}
              label="Manage Users"
              isActive={isActive("/admin/users")}
            />
            <NavItem
              to="/admin/classes"
              icon={<BookOpen size={18} />}
              label="Manage Classes"
              isActive={isActive("/admin/classes")}
            />
            <NavItem
              to="/admin/institution"
              icon={<School size={18} />}
              label="Institution"
              isActive={isActive("/admin/institution")}
            />
          </div>
        )}

        {/* Faculty-specific navigation */}
        {isFaculty() && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground">
              Faculty
            </h3>
            <NavItem
              to="/faculty/classes"
              icon={<BookOpen size={18} />}
              label="My Classes"
              isActive={isActive("/faculty/classes")}
            />
            <NavItem
              to="/faculty/students"
              icon={<Users size={18} />}
              label="Students"
              isActive={isActive("/faculty/students")}
            />
          </div>
        )}

        {/* Student-specific navigation */}
        {isStudent() && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground">
              Student
            </h3>
            <NavItem
              to="/student/classes"
              icon={<BookOpen size={18} />}
              label="My Class"
              isActive={isActive("/student/classes")}
            />
            <NavItem
              to="/student/faculty"
              icon={<UserRound size={18} />}
              label="Faculty"
              isActive={isActive("/student/faculty")}
            />
          </div>
        )}

        {/* Parent-specific navigation */}
        {isParent() && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground">
              Parent
            </h3>
            <NavItem
              to="/parent/children"
              icon={<User size={18} />}
              label="My Children"
              isActive={isActive("/parent/children")}
            />
            <NavItem
              to="/parent/faculty"
              icon={<UserRound size={18} />}
              label="Faculty"
              isActive={isActive("/parent/faculty")}
            />
          </div>
        )}
      </div>

      <div className="p-3 border-t">
        <NavItem
          to="/settings"
          icon={<Settings size={18} />}
          label="Settings"
          isActive={isActive("/settings")}
        />
      </div>
    </aside>
  );
}
