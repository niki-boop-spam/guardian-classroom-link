
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="mb-8 text-center">
        <img
          src="/lovable-uploads/187ef544-faa5-435c-9cce-74bfe4793c18.png"
          alt="V.E.D Logo"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-primary mb-2 tracking-wide animate-fade-in">
          V.E.D - Void Educational Dashboard
        </h1>
        <p className="text-secondary-text text-lg">
          A product of <span className="font-semibold text-accent4">Void Company</span>
        </p>
      </div>
      <div className="w-full max-w-md bg-card border border-alternate rounded-lg shadow-lg p-8 animate-fade-in">
        <LoginForm />
      </div>
      <footer className="mt-12 text-secondary-text text-xs text-center">
        &copy; {new Date().getFullYear()} Void Company. All rights reserved.
      </footer>
    </div>
  );
}
