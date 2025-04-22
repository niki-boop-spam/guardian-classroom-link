
import * as React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { dataStore } from "@/lib/data";
import { User, Message as MessageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search, User as UserIcon } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [messageText, setMessageText] = React.useState("");
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Get available recipients based on user role
  const availableRecipients = React.useMemo(() => {
    if (!user) return [];
    
    let recipients: User[] = [];
    
    switch (user.role) {
      case "admin":
        // Admin can message anyone
        recipients = dataStore.getUsersByRole("faculty", user.institutionCode)
          .concat(dataStore.getUsersByRole("student", user.institutionCode))
          .concat(dataStore.getUsersByRole("parent", user.institutionCode));
        break;
      
      case "faculty":
        // Faculty can message students and parents
        recipients = dataStore.getUsersByRole("student", user.institutionCode)
          .concat(dataStore.getUsersByRole("parent", user.institutionCode));
        break;
      
      case "student":
        // Students can message faculty only
        recipients = dataStore.getUsersByRole("faculty", user.institutionCode);
        break;
      
      case "parent":
        // Parents can message faculty only
        recipients = dataStore.getUsersByRole("faculty", user.institutionCode);
        break;
    }
    
    return recipients;
  }, [user]);

  // Filter recipients based on search term
  const filteredRecipients = React.useMemo(() => {
    if (!searchTerm) return availableRecipients;
    
    const term = searchTerm.toLowerCase();
    return availableRecipients.filter(
      recipient => 
        recipient.firstName.toLowerCase().includes(term) || 
        recipient.lastName.toLowerCase().includes(term) ||
        recipient.username.toLowerCase().includes(term)
    );
  }, [availableRecipients, searchTerm]);

  // Load messages when a user is selected
  React.useEffect(() => {
    if (!user || !selectedUser) return;
    
    const allMessages = dataStore.getMessagesForUser(user.id);
    const conversation = allMessages.filter(
      msg => 
        (msg.senderId === user.id && msg.recipientIds.includes(selectedUser.id)) ||
        (msg.senderId === selectedUser.id && msg.recipientIds.includes(user.id))
    );
    
    setMessages(conversation.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ));
  }, [user, selectedUser]);

  // Scroll to bottom of messages when new messages are added
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const sendMessage = () => {
    if (!user || !selectedUser || !messageText.trim()) return;
    
    const newMessageId = dataStore.sendMessage({
      senderId: user.id,
      recipientIds: [selectedUser.id],
      content: messageText,
      attachments: [],
    });
    
    // Add new message to the displayed messages
    const newMessage = dataStore.getMessagesForUser(user.id)
      .find(msg => msg.id === newMessageId);
    
    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
      setMessageText("");
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-9rem)]">
        {/* Contacts sidebar */}
        <Card className="md:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="px-4 py-2 space-y-1">
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-secondary flex items-center gap-2 ${
                      selectedUser?.id === recipient.id ? "bg-secondary" : ""
                    }`}
                    onClick={() => setSelectedUser(recipient)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground
                      ${recipient.role === "faculty" ? "bg-faculty" : 
                        recipient.role === "student" ? "bg-student" : 
                        recipient.role === "parent" ? "bg-parent" : "bg-primary"}`}
                    >
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{recipient.firstName} {recipient.lastName}</p>
                      <p className="text-xs text-muted-foreground">{recipient.role}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No contacts found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="md:col-span-2 flex flex-col h-full">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground
                    ${selectedUser.role === "faculty" ? "bg-faculty" : 
                      selectedUser.role === "student" ? "bg-student" : 
                      selectedUser.role === "parent" ? "bg-parent" : "bg-primary"}`}
                  >
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <CardTitle>{selectedUser.firstName} {selectedUser.lastName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isSentByMe = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            isSentByMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No messages yet. Start the conversation!
                  </p>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[40px] flex-1 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <UserIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select a contact to start messaging</h3>
                <p className="text-muted-foreground">
                  Choose a recipient from the contacts list
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
