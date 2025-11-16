import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Will be implemented in backend integration
    toast({
      title: "Login functionality coming soon",
      description: "Backend integration in progress",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex flex-1 items-center justify-center py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
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

                <Button type="submit" className="w-full" data-testid="button-login">
                  Sign In
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
