import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { CheckCircle2, Zap, Shield, RotateCcw, DollarSign, Clock, Award, Star, Chrome } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginNew() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      
      // Invalidate queries and redirect based on role
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      if (data.user?.role === "admin" || data.user?.role === "super_admin") {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/buyer/dashboard");
      }
    } catch (err: any) {
      setLoginError(err.message || "An error occurred");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 8) {
      setRegisterError("Password must be at least 8 characters");
      return;
    }

    if (!acceptedTerms) {
      setRegisterError("You must accept the Terms & Conditions");
      return;
    }

    setRegisterLoading(true);

    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          phone: registerPhone || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      setLocation("/register/thanks");
    } catch (err: any) {
      setRegisterError(err.message || "An error occurred");
    } finally {
      setRegisterLoading(false);
    }
  };

  const benefits = [
    { icon: DollarSign, text: "Highest payouts in the industry" },
    { icon: Zap, text: "Fast 48-hour payments" },
    { icon: RotateCcw, text: "Free return labels if you change your mind" },
    { icon: Shield, text: "Instant quote adjustments with full transparency" },
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: "Fast Payment",
      description: "Get paid within 48 hours via Zelle, PayPal, or ACH.",
    },
    {
      icon: Award,
      title: "Best Price Guarantee",
      description: "We beat most competitors by 10–20%.",
    },
    {
      icon: CheckCircle2,
      title: "Transparent Re-offers",
      description: "See EXACT reasons for price changes.",
    },
    {
      icon: RotateCcw,
      title: "Free Returns",
      description: "Changed your mind? We ship it back free.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <BrandLogo variant="white" size="lg" />
          </div>

          {/* Main Headline */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Sell your device <span className="text-white/90">smarter.</span>
            </h1>
            <p className="text-xl text-white/90 font-medium">
              Trusted by thousands. Instant quotes, fast payments, zero stress.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <span className="text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-md">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/90 mb-2 italic">
              "I got paid in less than 2 days. Easiest experience ever."
            </p>
            <p className="text-white/70 text-sm">– A.H., Verified Seller</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="relative z-10 flex gap-6 text-sm text-white/70">
          <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/support" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-2 bg-background/95 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                  <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
                </TabsList>
              </CardHeader>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold">Welcome Back</h2>
                      <p className="text-muted-foreground">Sign in to your account</p>
                    </div>

                    {loginError && (
                      <Alert variant="destructive">
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@company.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={loginLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={loginLoading}
                      />
                    </div>

                    <div className="flex justify-end">
                      <a href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  </CardContent>

                  <CardFooter className="flex-col space-y-4">
                    <Button
                      type="submit"
                      className="w-full text-lg h-12"
                      disabled={loginLoading}
                    >
                      {loginLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="text-primary hover:underline font-medium"
                      >
                        Create one →
                      </button>
                    </p>

                    <div className="relative w-full">
                      <Separator className="my-4" />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                        Or continue with
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button variant="outline" type="button" className="h-11">
                        <Chrome className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button variant="outline" type="button" className="h-11">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        Apple
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold">Create Account</h2>
                      <p className="text-muted-foreground">Join thousands of satisfied sellers</p>
                    </div>

                    {registerError && (
                      <Alert variant="destructive">
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@company.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Confirm Password</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Phone Number (Optional)</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        disabled={registerLoading}
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        disabled={registerLoading}
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                  </CardContent>

                  <CardFooter className="flex-col space-y-4">
                    <Button
                      type="submit"
                      className="w-full text-lg h-12"
                      disabled={registerLoading}
                    >
                      {registerLoading ? "Creating account..." : "Create Account"}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="text-primary hover:underline font-medium"
                      >
                        Log in →
                      </button>
                    </p>

                    <div className="relative w-full">
                      <Separator className="my-4" />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                        Or continue with
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button variant="outline" type="button" className="h-11">
                        <Chrome className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button variant="outline" type="button" className="h-11">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        Apple
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Why Choose Us Section */}
          <div className="mt-12 space-y-6">
            <h3 className="text-center text-xl font-bold">Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border-2 bg-card hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
