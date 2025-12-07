import { BuyerLayout } from "@/components/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { PageShell } from "@/components/PageShell";

const quickActions = [
  { label: "Create quote", href: "/buyer/quotes/new" },
  { label: "View catalog", href: "/buyer/catalog" },
  { label: "Reorder favorites", href: "/buyer/saved-lists" },
  { label: "Book freight pickup", href: "/buyer/orders" },
];

export default function BuyerDashboard() {
  return (
    <BuyerLayout>
      <PageShell
        title="Buyer workspace"
        description="Track orders, quotes, and fulfillment in one place."
        badge="Workspace"
        actions={<Button asChild><a href="/buyer/catalog">Browse catalog</a></Button>}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Orders & quotes</CardTitle>
              <CardDescription>Navigate to your live activity without placeholder data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                You don&apos;t have a summary yet. Visit Orders or Quotes to review real transactions as they happen.
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a href="/buyer/orders">Open orders</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/buyer/quotes">View quotes</a>
                </Button>
                <Button asChild>
                  <a href="/buyer/quotes/new">Create quote</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Common workflows at your fingertips.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Button key={action.label} variant="outline" className="w-full justify-between" asChild>
                  <a href={action.href}>
                    {action.label}
                    <RefreshCcw className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Shipment tracking</CardTitle>
              <CardDescription>Live milestones appear here once a purchase order is in motion.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                No shipments to display yet. Place an order to start receiving status updates.
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Account & support</CardTitle>
              <CardDescription>Keep your profile current and reach the team quickly.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href="/buyer/account">Manage account</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/support">Contact support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </BuyerLayout>
  );
}
