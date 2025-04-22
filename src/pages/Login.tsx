
import * as React from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/ui/AuthForms";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Guardian Classroom Link
        </h1>
        <p className="text-muted-foreground">
          by Void Company
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
