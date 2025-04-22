
import { dataStore } from "./data";
import { User } from "./types";
import * as React from "react";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    error: null,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    // Check for stored auth on initialization
    this.loadAuthFromStorage();
  }

  // Login with username and password
  login(username: string, password: string): boolean {
    const user = dataStore.getUser(username, password);
    
    if (user) {
      this.state = {
        user,
        isAuthenticated: true,
        error: null,
      };
      
      // Save auth state to localStorage
      this.saveAuthToStorage();
      this.notifyListeners();
      return true;
    } else {
      this.state = {
        user: null,
        isAuthenticated: false,
        error: "Invalid username or password",
      };
      this.notifyListeners();
      return false;
    }
  }

  // Logout current user
  logout(): void {
    this.state = {
      user: null,
      isAuthenticated: false,
      error: null,
    };
    
    // Remove auth state from localStorage
    localStorage.removeItem("authState");
    this.notifyListeners();
  }

  // Change password (including first-time login)
  changePassword(oldPassword: string, newPassword: string): boolean {
    if (!this.state.user) return false;
    
    // Verify old password
    if (this.state.user.password !== oldPassword) {
      this.state.error = "Current password is incorrect";
      this.notifyListeners();
      return false;
    }
    
    // Update password
    const success = dataStore.updateUserPassword(this.state.user.id, newPassword);
    
    if (success) {
      // Update local user object
      this.state.user.password = newPassword;
      this.state.user.isFirstLogin = false;
      this.state.error = null;
      
      // Save updated auth state
      this.saveAuthToStorage();
      this.notifyListeners();
    }
    
    return success;
  }

  // Get current auth state
  getState(): AuthState {
    return this.state;
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Save auth state to localStorage
  private saveAuthToStorage(): void {
    if (this.state.user) {
      localStorage.setItem(
        "authState",
        JSON.stringify({
          userId: this.state.user.id,
          username: this.state.user.username,
        })
      );
    }
  }

  // Load auth state from localStorage
  private loadAuthFromStorage(): void {
    const authJson = localStorage.getItem("authState");
    if (authJson) {
      try {
        const { username, userId } = JSON.parse(authJson);
        const user = dataStore.getUserById(userId);
        
        if (user) {
          this.state = {
            user,
            isAuthenticated: true,
            error: null,
          };
          this.notifyListeners();
        }
      } catch (error) {
        // Invalid stored auth data
        localStorage.removeItem("authState");
      }
    }
  }

  // Notify all listeners of state change
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.state);
    });
  }

  // Check if the current user is admin
  isAdmin(): boolean {
    return this.state.isAuthenticated && this.state.user?.role === "admin";
  }

  // Check if the current user is faculty
  isFaculty(): boolean {
    return this.state.isAuthenticated && this.state.user?.role === "faculty";
  }

  // Check if the current user is student
  isStudent(): boolean {
    return this.state.isAuthenticated && this.state.user?.role === "student";
  }

  // Check if the current user is parent
  isParent(): boolean {
    return this.state.isAuthenticated && this.state.user?.role === "parent";
  }
}

// Export a singleton instance
export const authManager = new AuthManager();

// React hook for auth state
export function useAuth() {
  const [authState, setAuthState] = React.useState(() => authManager.getState());
  
  React.useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);
  
  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    changePassword: authManager.changePassword.bind(authManager),
    isAdmin: authManager.isAdmin.bind(authManager),
    isFaculty: authManager.isFaculty.bind(authManager),
    isStudent: authManager.isStudent.bind(authManager),
    isParent: authManager.isParent.bind(authManager),
  };
}
