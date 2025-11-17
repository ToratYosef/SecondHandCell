import { useState } from "react";
import { Link, useLocation } from "wouter";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // Get redirect parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiRequest("POST", "/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data: {
        success: boolean;
        user: {
          id: string;
          name: string;
          email: string;
          role: string;
        };
      } = await res.json();

      // Invalidate any cached user data
      await queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/profile"] });

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Redirect to specified page or default based on user role
      const userRole = data.user.role;
      if (redirectTo) {
        setLocation(redirectTo);
      } else if (userRole === "admin" || userRole === "super_admin") {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/buyer/dashboard");
      }
    } catch (error: any) {
      let errorMessage = "Failed to sign in. Please try again.";

      // Parse error message from apiRequest
      // Format is "statusCode: {json}" e.g., "401: {"error":"Invalid credentials"}"
      if (error.message) {
        try {
          const parts = error.message.split(": ");
          if (parts.length > 1) {
            const jsonPart = parts.slice(1).join(": ");
            const errorData = JSON.parse(jsonPart);
            errorMessage = errorData.error || errorMessage;
          }
        } catch {
          // If parsing fails, use the full error message
          errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      
      <main className="flex flex-1 items-center justify-center py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl" data-testid="text-login-title">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to your wholesale account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline" data-testid="link-forgot-password">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    data-testid="input-password"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remember: checked as boolean }))}
                    data-testid="checkbox-remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-login"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Need a wholesale account? </span>
                  <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
                    Apply now
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
