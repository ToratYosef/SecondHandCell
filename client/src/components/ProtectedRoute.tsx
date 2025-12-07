import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { AuthOverlay } from "@/components/AuthOverlay";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "buyer" | "admin" | "super_admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { profile, isAdmin, loading } = useFirebaseUser();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!loading && !profile) {
      setShowOverlay(true);
    } else if (!loading && requiredRole === "admin" && !isAdmin) {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [loading, profile, requiredRole, isAdmin]);

  useEffect(() => {
    if (requiredRole === "buyer" && isAdmin) {
      setLocation("/admin/dashboard");
    }
  }, [requiredRole, isAdmin, setLocation]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Checking your access...
      </div>
    );
  }

  if (showOverlay || !profile) {
    return (
      <div className="relative min-h-screen">
        <AuthOverlay
          title={requiredRole === "admin" ? "Admin access required" : "Sign in to continue"}
          description={
            requiredRole === "admin"
              ? "Only approved admins can open catalog operations. Sign in to request access."
              : "Sign in with Google or email to continue."
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
