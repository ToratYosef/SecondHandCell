import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Building2, Phone, Mail, Shield, Calendar, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, Company } from "@shared/schema";
import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";

interface ProfileData extends Omit<UserType, "passwordHash"> {
  company: Company | null;
  roleInCompany: string | null;
}

export default function Account() {
  const { toast } = useToast();
  const { data: profile, isLoading, error, refetch } = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading profile",
        description: error instanceof Error ? error.message : "Failed to load account information",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const loadingShell = (
    <BuyerLayout>
      <PageShell
        title="Account"
        description="Manage your account settings and information"
        className="mx-auto max-w-6xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </PageShell>
    </BuyerLayout>
  );

  if (isLoading) {
    return loadingShell;
  }

  if (error || !profile) {
    return (
      <BuyerLayout>
        <PageShell
          title="Account"
          description="Manage your account settings and information"
          className="mx-auto max-w-6xl"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span data-testid="text-error-message">Failed to load account information. Please try again.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-retry">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </PageShell>
      </BuyerLayout>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending_review":
        return "outline";
      case "rejected":
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <BuyerLayout>
      <PageShell
        title="Account"
        description="Manage your account settings and information"
        className="mx-auto max-w-6xl"
      >
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold" data-testid="text-page-title">
                Account
              </h1>
              <p className="text-muted-foreground mt-1">Manage your account settings and information</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" data-testid="button-edit-profile">
                <Link href="/buyer/account/edit">Edit Profile</Link>
              </Button>
              <Button asChild variant="outline" data-testid="button-change-password">
                <Link href="/buyer/account/password">Change Password</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="text-base mt-1" data-testid="text-user-name">
                    {profile.name}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-user-email">{profile.email}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-user-phone">{profile.phone || "Not provided"}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Account Role</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" data-testid="badge-user-role">
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Member Since</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-member-since">{formatDate(new Date(profile.createdAt).toISOString())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
                <CardDescription>Your company account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                  <div className="text-base mt-1" data-testid="text-company-name">
                    {profile.company?.name || "Not provided"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Type</div>
                  <div className="text-base mt-1" data-testid="text-company-type">
                    {profile.company?.type || "Not provided"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Website</div>
                  <div className="text-base mt-1" data-testid="text-company-website">
                    {profile.company?.website || "Not provided"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="text-base mt-1" data-testid="text-company-address">
                    {profile.company?.address || "Not provided"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
              <CardDescription>Your account verification and compliance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={getStatusBadgeVariant(profile.status)} data-testid="badge-account-status">
                  {formatStatus(profile.status)}
                </Badge>
                {profile.verifiedAt && (
                  <span className="text-sm text-muted-foreground" data-testid="text-verified-at">
                    Verified on {formatDate(new Date(profile.verifiedAt).toISOString())}
                  </span>
                )}
              </div>

              <Alert variant="default" className="border-dashed">
                <AlertTitle>Keep your account current</AlertTitle>
                <AlertDescription>
                  Make sure your company details and documentation are up to date to maintain uninterrupted service.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </BuyerLayout>
  );
}
