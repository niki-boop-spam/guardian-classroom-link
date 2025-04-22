
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, BookOpen, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { dataStore } from "@/lib/data";

export function AdminDashboard() {
  const { user } = useAuth();
  const institution = user ? dataStore.getInstitution(user.institutionCode) : null;
  const faculty = user ? dataStore.getUsersByRole("faculty", user.institutionCode) : [];
  const students = user ? dataStore.getUsersByRole("student", user.institutionCode) : [];
  const classes = user ? dataStore.getClassesByInstitution(user.institutionCode) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, Admin</h2>
        <p className="text-muted-foreground">
          Here's an overview of your institution
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <School className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Institution Info */}
      <Card>
        <CardHeader>
          <CardTitle>Institution Information</CardTitle>
          <CardDescription>Details about your institution</CardDescription>
        </CardHeader>
        <CardContent>
          {institution ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{institution.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Code</p>
                  <p>{institution.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{institution.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p>{institution.classes.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Institution information not available</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <a href="/admin/users" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Users className="h-6 w-6 mb-2" />
            <span>Manage Users</span>
          </a>
          <a href="/admin/classes" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <BookOpen className="h-6 w-6 mb-2" />
            <span>Manage Classes</span>
          </a>
          <a href="/announcements/create" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Bell className="h-6 w-6 mb-2" />
            <span>Create Announcement</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
