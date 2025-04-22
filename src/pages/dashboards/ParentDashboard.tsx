
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Bell, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { dataStore } from "@/lib/data";
import { Parent, Student, Faculty } from "@/lib/types";

export function ParentDashboard() {
  const { user } = useAuth();
  const parentUser = user as Parent | null;
  
  // Get parent's children
  const studentIds = parentUser?.studentIds || [];
  const children = studentIds
    .map(id => dataStore.getUserById(id))
    .filter(Boolean) as Student[];
  
  // Get classes for all children
  const classIds = children.map(child => child.classId);
  const classes = classIds.map(id => dataStore.getClass(id)).filter(Boolean);
  
  // Get faculty teaching the children
  const facultyIds = classes.flatMap(cls => cls.facultyIds);
  const faculty = facultyIds
    .map(id => dataStore.getUserById(id))
    .filter(Boolean) as Faculty[];
  
  // Get messages for the parent
  const messages = parentUser ? dataStore.getMessagesForUser(parentUser.id) : [];
  const unreadMessages = messages.filter(msg => !msg.read);
  
  // Get announcements for the parent
  const announcements = parentUser ? dataStore.getAnnouncementsForUser(parentUser.id) : [];
  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {parentUser?.firstName}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your children's education
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Children</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(faculty.map(f => f.id)).size}</div>
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

      {/* Children Information */}
      <Card>
        <CardHeader>
          <CardTitle>My Children</CardTitle>
          <CardDescription>Information about your children</CardDescription>
        </CardHeader>
        <CardContent>
          {children.length > 0 ? (
            <div className="space-y-6">
              {children.map(child => {
                const childClass = dataStore.getClass(child.classId);
                const childFaculty = childClass
                  ? childClass.facultyIds
                      .map(id => dataStore.getUserById(id))
                      .filter(Boolean) as Faculty[]
                  : [];
                
                return (
                  <div key={child.id} className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium">{child.firstName} {child.lastName}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Enrollment Number</p>
                        <p>{child.enrollmentNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Class</p>
                        <p>{childClass?.name || "Not assigned"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Teachers</h4>
                      {childFaculty.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {childFaculty.map(f => (
                            <div key={f.id} className="p-2 border rounded-md">
                              <p className="font-medium">{f.firstName} {f.lastName}</p>
                              <p className="text-xs text-muted-foreground">
                                {f.subjects.join(", ")}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No teachers assigned yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No children information available</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Latest updates from teachers</CardDescription>
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
          <CardDescription>Common parent tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-4">
          <a href="/messages" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-6 w-6 mb-2" />
            <span>Messages</span>
          </a>
          <a href="/meetings/create" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span>Request Meeting</span>
          </a>
          <a href="/announcements" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Bell className="h-6 w-6 mb-2" />
            <span>Announcements</span>
          </a>
          <a href="/parent/faculty" className="p-4 border rounded-md hover:bg-secondary flex flex-col items-center justify-center text-center">
            <Users className="h-6 w-6 mb-2" />
            <span>View Teachers</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
