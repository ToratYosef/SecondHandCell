import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User as UserType, Company } from "@shared/schema";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

interface ProfileData extends Omit<UserType, "passwordHash"> {
  company: Company | null;
  roleInCompany: string | null;
}

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().nullable(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

export default function EditProfile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading, error, refetch } = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
  });

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phone: profile.phone || "",
      });
    }
  }, [profile, form]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading profile",
        description: error instanceof Error ? error.message : "Failed to load profile data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await apiRequest("PATCH", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      setLocation("/buyer/account");
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileUpdateData) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" data-testid="button-back">
                  <Link href="/buyer/account">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold">Edit Profile</h1>
                  <p className="text-muted-foreground mt-1">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" data-testid="button-back">
                  <Link href="/buyer/account">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold">Edit Profile</h1>
                  <p className="text-muted-foreground mt-1">Update your personal information</p>
                </div>
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>Failed to load profile data. Please try again.</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    data-testid="button-retry"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon" data-testid="button-back">
                <Link href="/buyer/account">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Edit Profile</h1>
                <p className="text-muted-foreground mt-1">Update your personal information</p>
              </div>
            </div>

            <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name and contact information. Email cannot be changed for security reasons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        data-testid="input-name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed across the platform
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        data-testid="input-phone"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Your contact phone number for order-related communications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-email">{profile.email}</p>
                      <p className="text-xs text-muted-foreground mt-2" data-testid="text-email-note">
                        Your email address cannot be changed. Contact support if you need to update it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/buyer/account")}
                    className="flex-1"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending || !form.formState.isDirty}
                    className="flex-1"
                    data-testid="button-save"
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
