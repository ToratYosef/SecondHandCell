import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Smartphone, Zap, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "buyer@example.com",
      password: "password123",
    },
  });

  useEffect(() => {
    document.title = "Sign in | SecondHand(Whole)Cell";
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      return apiRequest("POST", "/api/auth/login", values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setLocation("/buyer/dashboard");
      toast({
        title: "Welcome back",
        description: "You are now signed in and ready to browse inventory",
      });
    },
    onError: () => {
      toast({
        title: "Unable to sign in",
        description: "Double-check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const featureHighlights = [
    {
      title: "Verified supply",
      description: "Every lot is test-verified with transparent grading.",
      icon: ShieldCheck,
    },
    {
      title: "Purpose-built for wholesale",
      description: "Tiered pricing, saved lists, and quote workflows built-in.",
      icon: Smartphone,
    },
    {
      title: "Lightning-fast checkout",
      description: "One-click reorders and saved payment methods keep you moving.",
      icon: Zap,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <UnifiedHeader />

      <main className="flex flex-1 items-center py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Secure wholesale access
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              Sign in to your buyer workspace
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/80">
              Access live inventory, submit quotes, and manage orders in one streamlined dashboard.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {featureHighlights.map((item) => (
                <div key={item.title} className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/40">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-primary-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                99.9% uptime
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                SOC2-ready infrastructure
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                Trusted by 2,000+ resellers
              </div>
            </div>
          </div>

          <Card className="border-0 bg-white text-foreground shadow-2xl">
            <CardHeader className="space-y-2 border-b bg-muted/40">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Signing in..." : "Access dashboard"}
                </Button>
              </form>

              <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                New to SecondHand(Whole)Cell? {" "}
                <Link href="/register" className="font-semibold text-primary">
                  Apply for a wholesale account
                </Link>
                <span className="inline-flex items-center gap-2 pl-2 text-xs font-medium text-emerald-600">
                  <ArrowRight className="h-3 w-3" /> Approval in one business day
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
