import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthOverlay } from "@/components/AuthOverlay";
import { useCatalog } from "@/hooks/useCatalog";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Activity, Clock, PackageSearch, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  hint: string;
}

interface TimelineItem {
  title: string;
  meta: string;
  badge?: string;
}

export default function AdminDashboard() {
  const { summary, loading } = useCatalog();
  const { isAdmin } = useFirebaseUser();

  const kpis: KpiCardProps[] = useMemo(
    () => [
      { title: "Orders today", value: "24", hint: "+12% vs yesterday" },
      { title: "Quotes in review", value: "7", hint: "2 awaiting approval" },
      { title: "Active companies", value: "32", hint: "New this week: 4" },
      {
        title: "Live listings",
        value: loading ? "–" : summary.total.toString(),
        hint: loading ? "Syncing catalog" : `${summary.brands} brands live`,
      },
    ],
    [loading, summary.brands, summary.total],
  );

  const pipeline: TimelineItem[] = [
    { title: "Orders", meta: "18 open • 3 expedited", badge: "Priority" },
    { title: "Quotes", meta: "7 pending • 2 approvals", badge: "Review" },
    { title: "Shipments", meta: "6 in motion • 2 arriving today", badge: "Logistics" },
  ];

  const activity: TimelineItem[] = [
    { title: "Dallas Warehouse", meta: "PO-2310 preparing pick" },
    { title: "UPS Freight", meta: "PO-2298 arriving today" },
    { title: "FedEx", meta: "PO-2284 in transit" },
    { title: "Account approvals", meta: "3 buyers verified" },
  ];

  const supplyHealth = useMemo(
    () => ({
      live: loading ? "–" : summary.total.toString(),
      avgPrice: loading ? "–" : `$${summary.avgPrice.toFixed(2)}`,
      brands: loading ? "–" : summary.brands.toString(),
    }),
    [loading, summary.avgPrice, summary.brands, summary.total],
  );

  return (
    <PageShell
      title="Admin dashboard"
      description="Track orders, customer health, and supply performance."
      badge="Admin"
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="/admin/orders">View orders</a>
          </Button>
          <Button asChild>
            <a href="/admin/reports">Export reports</a>
          </Button>
        </div>
      }
    >
      {!isAdmin && <AuthOverlay title="Admin access required" description="Sign in to manage the workspace." />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Operations pulse</CardTitle>
              <CardDescription>Stay ahead of procurement and logistics</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipeline.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.meta}</p>
                </div>
                {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supply health</CardTitle>
            <CardDescription>Snapshot of live catalog performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HealthRow icon={<PackageSearch className="h-4 w-4" />} label="Live listings" value={supplyHealth.live} />
            <HealthRow icon={<Activity className="h-4 w-4" />} label="Average price" value={supplyHealth.avgPrice} />
            <HealthRow icon={<Clock className="h-4 w-4" />} label="Brands" value={supplyHealth.brands} />
            <Separator />
            <p className="text-sm text-muted-foreground">
              Data refreshes automatically from the catalog feed. Publish updates in Inventory when you are ready.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Live updates from warehouses and approvals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.meta}</p>
                </div>
                <Badge variant="outline">Live</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick admin actions</CardTitle>
            <CardDescription>Stay a step ahead of procurement</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            <ActionLink href="/admin/quotes" label="Create quote" />
            <ActionLink href="/admin/inventory" label="View catalog" />
            <ActionLink href="/admin/orders" label="Reorder favorites" />
            <ActionLink href="/admin/reports" label="Book freight pickup" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function KpiCard({ title, value, hint }: KpiCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">{hint}</CardContent>
    </Card>
  );
}

function HealthRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3 text-sm">
        <div className="rounded-full bg-muted p-2 text-muted-foreground">{icon}</div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-muted-foreground">Updated just now</p>
        </div>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" className="justify-start">
      <a href={href}>{label}</a>
    </Button>
  );
}
