
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Calendar, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = () => {
    if (!user) return "bg-gray-300";

    switch (user.role) {
      case "admin":
        return "bg-admin";
      case "faculty":
        return "bg-faculty";
      case "student":
        return "bg-student";
      case "parent":
        return "bg-parent";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">
              <Link to="/">Guardian Classroom Link</Link>
            </h1>
            {user && (
              <span className="ml-2 text-sm font-semibold text-muted-foreground">
                {user?.institutionCode}
              </span>
            )}
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <Link to="/messages">
              <Button variant="ghost" size="icon" title="Messages">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/announcements">
              <Button variant="ghost" size="icon" title="Announcements">
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/meetings">
              <Button variant="ghost" size="icon" title="Meetings">
                <Calendar className="w-5 h-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className={`h-8 w-8 ${getRoleColor()}`}>
                    <AvatarImage
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
