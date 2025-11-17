import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import type { User } from "@shared/schema";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "buyer" | "admin" | "super_admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/me"],
    retry: false,
  });

  // Handle authentication and authorization redirects
  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (error || !user) {
        setRedirectMessage("Redirecting to login...");
        setLocation("/login");
        return;
      }

      // Check role-based access
      if (requiredRole) {
        const isAdmin = user.role === "admin" || user.role === "super_admin";
        
        if (requiredRole === "admin" && !isAdmin) {
          // Non-admin trying to access admin portal
          setRedirectMessage("Access denied. Redirecting...");
          setLocation("/buyer/dashboard");
          return;
        }
        
        if (requiredRole === "buyer" && isAdmin) {
          // Admin trying to access buyer portal
          setRedirectMessage("Redirecting to admin portal...");
          setLocation("/admin/dashboard");
          return;
        }
      }

      // Clear redirect message if authorized
      setRedirectMessage(null);
    }
  }, [user, isLoading, error, requiredRole, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if redirecting
  if (redirectMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">{redirectMessage}</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show loading while redirecting
  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole) {
    const isAdmin = user.role === "admin" || user.role === "super_admin";
    
    if (requiredRole === "admin" && !isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Access denied. Redirecting...</p>
          </div>
        </div>
      );
    }
    
    if (requiredRole === "buyer" && isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to admin portal...</p>
          </div>
        </div>
      );
    }
  }

  // All checks passed - render protected content
  return <>{children}</>;
}
