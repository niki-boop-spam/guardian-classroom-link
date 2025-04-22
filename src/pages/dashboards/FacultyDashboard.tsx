
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { dataStore } from "@/lib/data";
import { Faculty, Student } from "@/lib/types";

export function FacultyDashboard() {
  const { user } = useAuth();
  const facultyUser = user as Faculty | null;
  
  // Get faculty's classes
  const classIds = facultyUser?.classesAssigned || [];
  const classes = classIds.map(id => dataStore.getClass(id)).filter(Boolean);
  
  // Get students in those classes
  const studentsInClasses = classes.flatMap(cls => 
    cls ? cls.studentIds.map(id => dataStore.getUserById(id)) : []
  ).filter(Boolean) as Student[];
  
  // Get messages for the faculty
  const messages = facultyUser ? dataStore.getMessagesForUser(facultyUser.id) : [];
  const unreadMessages = messages.filter(msg => !msg.read);
  
  // Get upcoming meetings
  const meetings = facultyUser ? dataStore.getMeetingsForUser(facultyUser.id) : [];
  const upcomingMeetings = meetings.filter(
    meet => new Date(meet.startTime) > new Date() && meet.status === "scheduled"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {facultyUser?.firstName}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your classes and communications
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsInClasses.length}</div>
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
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Classes */}
      <Card>
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
          <CardDescription>Classes you are teaching</CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length > 0 ? (
            <div className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 border rounded-md">
                  <h3 className="font-medium">{cls.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p>{cls.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Section</p>
                      <p>{cls.section}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p>{cls.studentIds.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No classes assigned yet</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common faculty tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-4">
          <a href="/messages" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-6 w-6 mb-2" />
            <span>Messages</span>
          </a>
          <a href="/announcements/create" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span>Create Announcement</span>
          </a>
          <a href="/meetings/create" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span>Schedule Meeting</span>
          </a>
          <a href="/faculty/students" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Users className="h-6 w-6 mb-2" />
            <span>View Students</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
