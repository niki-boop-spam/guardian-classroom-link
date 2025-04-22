
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, MessageSquare, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { dataStore } from "@/lib/data";
import { Student, Faculty } from "@/lib/types";

export function StudentDashboard() {
  const { user } = useAuth();
  const studentUser = user as Student | null;
  
  // Get student's class
  const classId = studentUser?.classId || "";
  const studentClass = dataStore.getClass(classId);
  
  // Get faculty teaching the student
  const facultyIds = studentClass?.facultyIds || [];
  const faculty = facultyIds
    .map(id => dataStore.getUserById(id))
    .filter(Boolean) as Faculty[];
  
  // Get messages for the student
  const messages = studentUser ? dataStore.getMessagesForUser(studentUser.id) : [];
  const unreadMessages = messages.filter(msg => !msg.read);
  
  // Get announcements for the student
  const announcements = studentUser ? dataStore.getAnnouncementsForUser(studentUser.id) : [];
  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {studentUser?.firstName}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your class and communications
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Class</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentClass?.name || "Not assigned"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Teachers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Announcements</CardTitle>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAnnouncements.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Class Information */}
      <Card>
        <CardHeader>
          <CardTitle>My Class</CardTitle>
          <CardDescription>Information about your class</CardDescription>
        </CardHeader>
        <CardContent>
          {studentClass ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class Name</p>
                  <p>{studentClass.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Grade</p>
                  <p>{studentClass.grade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Section</p>
                  <p>{studentClass.section}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Number of Students</p>
                  <p>{studentClass.studentIds.length}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">My Teachers</h4>
                {faculty.length > 0 ? (
                  <div className="space-y-2">
                    {faculty.map(f => (
                      <div key={f.id} className="p-3 border rounded-md">
                        <p className="font-medium">{f.firstName} {f.lastName}</p>
                        <p className="text-sm text-muted-foreground">Subjects: {f.subjects.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No teachers assigned yet</p>
                )}
              </div>
            </div>
          ) : (
            <p>Class information not available</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Latest updates from your teachers</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {recentAnnouncements.map(announcement => {
                const creator = dataStore.getUserById(announcement.creatorId);
                return (
                  <div key={announcement.id} className="p-4 border rounded-md">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {creator?.firstName} {creator?.lastName} • {new Date(announcement.timestamp).toLocaleDateString()}
                    </p>
                    <p className="line-clamp-2">{announcement.content}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No recent announcements</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common student tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <a href="/messages" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-6 w-6 mb-2" />
            <span>Messages</span>
          </a>
          <a href="/announcements" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Bell className="h-6 w-6 mb-2" />
            <span>Announcements</span>
          </a>
          <a href="/student/faculty" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Users className="h-6 w-6 mb-2" />
            <span>My Teachers</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
