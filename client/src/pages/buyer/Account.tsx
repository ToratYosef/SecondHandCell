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
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Account</h1>
                <p className="text-muted-foreground mt-1" data-testid="text-loading-message">Loading your account information...</p>
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
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Account</h1>
                <p className="text-muted-foreground mt-1" data-testid="text-page-description">Manage your account settings and information</p>
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span data-testid="text-error-message">Failed to load account information. Please try again.</span>
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
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Account</h1>
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
        {/* Personal Information Card */}
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
              <div className="text-base mt-1" data-testid="text-user-name">{profile.name}</div>
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

        {/* Company Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Your company account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.company ? (
              <>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                  <div className="text-base mt-1" data-testid="text-company-name">{profile.company.name}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Legal Name</div>
                  <div className="text-base mt-1" data-testid="text-company-legal-name">
                    {profile.company.legalName}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge
                      variant={getStatusBadgeVariant(profile.company.status)}
                      data-testid="badge-company-status"
                    >
                      {formatStatus(profile.company.status)}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Your Role</div>
                  <div className="mt-1">
                    <Badge variant="outline" data-testid="badge-role-in-company">
                      {profile.roleInCompany
                        ? profile.roleInCompany.charAt(0).toUpperCase() +
                          profile.roleInCompany.slice(1)
                        : "Member"}
                    </Badge>
                  </div>
                </div>
                {profile.company.website && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Website</div>
                      <a
                        href={profile.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-1 inline-block"
                        data-testid="link-company-website"
                      >
                        {profile.company.website}
                      </a>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No company associated with this account</p>
                <p className="text-sm mt-1">Contact support to link your company account</p>
              </div>
            )}
          </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
