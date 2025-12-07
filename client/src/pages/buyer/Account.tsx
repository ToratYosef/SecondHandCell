import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Building2, Phone, Mail, Shield, Calendar, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function Account() {
  const { profile, loading } = useFirebaseUser();

  if (loading) {
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

  if (!profile) {
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
                <AlertTitle>Sign in required</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span data-testid="text-error-message">You need to sign in to view your account.</span>
                  <Button asChild variant="outline" size="sm" data-testid="button-retry">
                    <Link href="/login">Sign in</Link>
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

  const parseDate = (value: unknown) => {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value === "string" || typeof value === "number") {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    if (typeof value === "object" && value !== null && "toDate" in value) {
      // Support Firestore Timestamp objects
      const parsed = (value as { toDate: () => Date }).toDate();
      return parsed instanceof Date && !isNaN(parsed.getTime()) ? parsed : null;
    }
    return null;
  };

  const formatDate = (dateString: unknown) => {
    const parsed = parseDate(dateString);
    if (!parsed) return "Not available";

    return parsed.toLocaleDateString("en-US", {
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
              <div className="text-base mt-1" data-testid="text-user-name">{profile.name || "No name on file"}</div>
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span data-testid="text-user-email">{profile.email || "No email on file"}</span>
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span data-testid="text-user-phone">{"phone" in profile && (profile as any).phone ? (profile as any).phone : "Not provided"}</span>
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
                <span data-testid="text-member-since">{formatDate(profile.createdAt)}</span>
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
            {profile.companyName ? (
              <>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                  <div className="text-base mt-1" data-testid="text-company-name">{profile.companyName}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant("approved")}>Verified</Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Your Role</div>
                  <div className="mt-1">
                    <Badge variant="outline" data-testid="badge-role-in-company">Member</Badge>
                  </div>
                </div>
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
