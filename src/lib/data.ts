
import { User, Institution, Class, Message, Meeting, Announcement, UserRole, Faculty, Student, Parent } from "./types";

// Mock data store to simulate a backend
class DataStore {
  private users: User[] = [];
  private institutions: Institution[] = [];
  private classes: Class[] = [];
  private messages: Message[] = [];
  private meetings: Meeting[] = [];
  private announcements: Announcement[] = [];

  // Institution management
  addInstitution(institution: Omit<Institution, "id" | "adminId">) {
    const institutionId = `inst-${Date.now()}`;
    const adminUsername = `ADM${institution.code}VOID`;
    
    // Create admin for this institution
    const adminId = this.createUser({
      username: adminUsername,
      password: "12345678", // Default password
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      institutionCode: institution.code,
      isFirstLogin: true,
    });

    const newInstitution: Institution = {
      ...institution,
      id: institutionId,
      adminId,
      classes: [],
    };

    this.institutions.push(newInstitution);
    return institutionId;
  }

  getInstitution(code: string) {
    return this.institutions.find((inst) => inst.code === code);
  }

  // User management
  createUser(userData: Omit<User | Faculty | Student | Parent, "id">): string {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newUser = {
      ...userData,
      id: userId,
    };
    this.users.push(newUser as User);
    return userId;
  }

  getUser(username: string, password: string) {
    return this.users.find(
      (user) => user.username === username && user.password === password
    );
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  getUsersByRole(role: UserRole, institutionCode: string) {
    return this.users.filter(
      (user) => user.role === role && user.institutionCode === institutionCode
    );
  }
  
  updateUserPassword(userId: string, newPassword: string) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        password: newPassword,
        isFirstLogin: false,
      };
      return true;
    }
    return false;
  }

  // Class management
  createClass(classData: Omit<Class, "id">): string {
    const classId = `class-${Date.now()}`;
    const newClass: Class = {
      ...classData,
      id: classId,
    };
    this.classes.push(newClass);
    
    // Update institution
    const institution = this.institutions.find(
      (inst) => inst.id === this.findInstitutionByClassId(classId)?.id
    );
    if (institution) {
      institution.classes.push(newClass);
    }
    
    return classId;
  }

  getClass(classId: string) {
    return this.classes.find((cls) => cls.id === classId);
  }

  getClassesByInstitution(institutionCode: string) {
    return this.classes.filter((cls) => {
      const institution = this.findInstitutionByClassId(cls.id);
      return institution?.code === institutionCode;
    });
  }

  findInstitutionByClassId(classId: string) {
    return this.institutions.find((inst) => 
      inst.classes.some((cls) => cls.id === classId)
    );
  }

  // Messaging system
  sendMessage(message: Omit<Message, "id" | "timestamp" | "read">): string {
    const messageId = `msg-${Date.now()}`;
    const newMessage: Message = {
      ...message,
      id: messageId,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.messages.push(newMessage);
    return messageId;
  }

  getMessagesForUser(userId: string) {
    return this.messages.filter(
      (msg) => msg.senderId === userId || msg.recipientIds.includes(userId)
    );
  }

  // Meeting system
  createMeeting(meeting: Omit<Meeting, "id">): string {
    const meetingId = `meet-${Date.now()}`;
    const newMeeting: Meeting = {
      ...meeting,
      id: meetingId,
    };
    this.meetings.push(newMeeting);
    return meetingId;
  }

  getMeetingsForUser(userId: string) {
    return this.meetings.filter(
      (meet) => meet.creatorId === userId || meet.participantIds.includes(userId)
    );
  }

  // Announcement system
  createAnnouncement(announcement: Omit<Announcement, "id" | "timestamp">): string {
    const announcementId = `ann-${Date.now()}`;
    const newAnnouncement: Announcement = {
      ...announcement,
      id: announcementId,
      timestamp: new Date().toISOString(),
    };
    this.announcements.push(newAnnouncement);
    return announcementId;
  }

  getAnnouncementsForUser(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return [];
    
    return this.announcements.filter((ann) => {
      // Always return announcements created by the user
      if (ann.creatorId === userId) return true;
      
      // Check if the user's role is included in the target groups
      if (user.role === "admin" && ann.targetGroups.faculty) return true;
      if (user.role === "faculty" && ann.targetGroups.faculty) return true;
      if (user.role === "student" && ann.targetGroups.students) return true;
      if (user.role === "parent" && ann.targetGroups.parents) return true;
      
      // Check if the user's class is included in the target groups
      if (
        (user.role === "student" || user.role === "parent") &&
        "classId" in user &&
        ann.targetGroups.classIds.includes((user as Student).classId)
      ) {
        return true;
      }
      
      return false;
    });
  }

  // Username generation based on user type and institution code
  generateUsername(
    role: UserRole, 
    institutionCode: string, 
    firstName: string, 
    lastName: string,
    uniqueIdentifier?: string
  ): string {
    let username = "";
    
    switch (role) {
      case "admin":
        username = `ADM${institutionCode}VOID`;
        break;
      case "faculty":
        username = `FAC${institutionCode}${firstName.substring(0, 1)}${lastName.substring(0, 1)}${uniqueIdentifier || ""}`;
        break;
      case "student":
        username = `STU${institutionCode}${firstName.substring(0, 1)}${lastName.substring(0, 1)}${uniqueIdentifier || ""}`;
        break;
      case "parent":
        username = `PAR${institutionCode}${firstName.substring(0, 1)}${lastName.substring(0, 1)}${uniqueIdentifier || ""}`;
        break;
    }
    
    return username.toUpperCase();
  }

  // Helper to check if username already exists
  usernameExists(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }
}

// Create and export a singleton instance
export const dataStore = new DataStore();

// Initialize with demo data for testing
export function initializeDemoData() {
  // Demo institution
  const instId = dataStore.addInstitution({
    name: "Void Academy",
    code: "VOID01",
    address: "123 Education St, Learning City",
    classes: []
  });

  const inst = dataStore.getInstitution("VOID01");
  if (!inst) return;

  // Demo classes
  const class10A = dataStore.createClass({
    name: "10th Grade A",
    grade: "10th",
    section: "A",
    facultyIds: [],
    studentIds: []
  });

  const class11B = dataStore.createClass({
    name: "11th Grade B",
    grade: "11th",
    section: "B",
    facultyIds: [],
    studentIds: []
  });

  // Demo faculty
  const faculty1Id = dataStore.createUser({
    username: "FACVOID01JS",
    password: "12345678",
    firstName: "John",
    lastName: "Smith",
    role: "faculty" as const,
    institutionCode: "VOID01",
    isFirstLogin: true,
    classesAssigned: [class10A],
    subjects: ["Mathematics", "Physics"]
  } as Omit<Faculty, "id">);

  const faculty2Id = dataStore.createUser({
    username: "FACVOID01MD",
    password: "12345678",
    firstName: "Mary",
    lastName: "Davis",
    role: "faculty" as const,
    institutionCode: "VOID01",
    isFirstLogin: true,
    classesAssigned: [class11B],
    subjects: ["English", "History"]
  } as Omit<Faculty, "id">);

  // Update classes with faculty
  const classObj10A = dataStore.getClass(class10A);
  const classObj11B = dataStore.getClass(class11B);
  
  if (classObj10A) {
    classObj10A.facultyIds = [faculty1Id];
  }
  
  if (classObj11B) {
    classObj11B.facultyIds = [faculty2Id];
  }

  // Demo students
  const student1Id = dataStore.createUser({
    username: "STUVOID01AJ001",
    password: "12345678",
    firstName: "Alex",
    lastName: "Johnson",
    role: "student" as const,
    institutionCode: "VOID01",
    isFirstLogin: true,
    classId: class10A,
    enrollmentNumber: "ST001",
    parentIds: []
  } as Omit<Student, "id">);

  const student2Id = dataStore.createUser({
    username: "STUVOID01MM002",
    password: "12345678",
    firstName: "Maya",
    lastName: "Miller",
    role: "student" as const,
    institutionCode: "VOID01",
    isFirstLogin: true,
    classId: class11B,
    enrollmentNumber: "ST002",
    parentIds: []
  } as Omit<Student, "id">);

  // Demo parents
  const parent1Id = dataStore.createUser({
    username: "PARVOID01RJ001",
    password: "12345678",
    firstName: "Robert",
    lastName: "Johnson",
    role: "parent" as const,
    institutionCode: "VOID01",
    isFirstLogin: true,
    studentIds: [student1Id],
    relation: "Father"
  } as Omit<Parent, "id">);

  const parent2Id = dataStore.createUser({
    username: "PARVOID01SM002",
    password: "12345678",
    firstName: "Sarah",
    lastName: "Miller",
    role: "parent" as const,
    institutionCode: "VOID01",
    isFirstLogin: true,
    studentIds: [student2Id],
    relation: "Mother"
  } as Omit<Parent, "id">);

  // Update students with parent IDs
  const student1 = dataStore.getUserById(student1Id) as Student;
  const student2 = dataStore.getUserById(student2Id) as Student;
  
  if (student1) {
    student1.parentIds = [parent1Id];
  }
  
  if (student2) {
    student2.parentIds = [parent2Id];
  }

  // Demo announcements
  dataStore.createAnnouncement({
    title: "Welcome to the New School Year",
    content: "We are excited to welcome all students back to Void Academy for the new academic year. Please check your schedules and be prepared for classes starting next Monday.",
    creatorId: inst.adminId,
    targetGroups: {
      faculty: true,
      students: true,
      parents: true,
      classIds: [],
    },
    important: true,
  });

  dataStore.createAnnouncement({
    title: "10th Grade Mathematics Test",
    content: "A mathematics test will be held next Friday. Please prepare chapters 1-5 from your textbook.",
    creatorId: faculty1Id,
    targetGroups: {
      faculty: false,
      students: true,
      parents: true,
      classIds: [class10A],
    },
    important: false,
  });

  // Demo messages
  dataStore.sendMessage({
    senderId: faculty1Id,
    recipientIds: [student1Id],
    content: "Alex, please complete your homework assignment by Friday.",
    attachments: [],
  });

  dataStore.sendMessage({
    senderId: parent1Id,
    recipientIds: [faculty1Id],
    content: "When is the next parent-teacher meeting scheduled?",
    attachments: [],
  });

  // Demo meeting
  dataStore.createMeeting({
    title: "Parent-Teacher Conference",
    description: "Discussion about student progress and upcoming curriculum",
    creatorId: faculty1Id,
    participantIds: [parent1Id],
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour duration
    location: "Room 101",
    isOnline: false,
    status: "scheduled",
  });
}
