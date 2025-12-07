import { BuyerLayout } from "@/components/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, FileText, Package, RefreshCcw, Truck } from "lucide-react";
import { PageShell } from "@/components/PageShell";

const stats = [
  { title: "Open Orders", value: "18", change: "+3", tone: "positive" },
  { title: "Quotes in Review", value: "7", change: "2 awaiting approval", tone: "neutral" },
  { title: "Avg. Lead Time", value: "2.4 days", change: "Expedited available", tone: "positive" },
  { title: "Fill Rate", value: "98.4%", change: "Past 90 days", tone: "positive" },
];

const shipmentTimeline = [
  {
    status: "Arriving today",
    reference: "PO-2298",
    carrier: "UPS Freight",
    progress: 90,
    highlight: true,
  },
  {
    status: "In transit",
    reference: "PO-2284",
    carrier: "FedEx",
    progress: 62,
  },
  {
    status: "Preparing pick",
    reference: "PO-2310",
    carrier: "Dallas Warehouse",
    progress: 35,
  },
];

const quickActions = [
  { label: "Create quote", href: "/buyer/quotes/new" },
  { label: "View catalog", href: "/buyer/catalog" },
  { label: "Reorder favorites", href: "/buyer/saved-lists" },
  { label: "Book freight pickup", href: "/buyer/orders" },
];

const savedLists = [
  { name: "Grade A iPhone mix", items: 42, updated: "2h ago" },
  { name: "Enterprise laptops", items: 18, updated: "Yesterday" },
  { name: "Carrier unlocked lot", items: 26, updated: "This week" },
];

export default function BuyerDashboard() {
  return (
    <BuyerLayout>
      <PageShell
        title="Buyer overview"
        description="A single view of your orders, shipments, and quick actions to keep procurement moving."
        badge="Workspace"
        actions={<Button asChild><a href="/buyer/catalog">Browse catalog</a></Button>}
      >
        <div className="grid gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-elevate">
              <CardHeader className="pb-2">
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                {stat.change}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shipments in motion</CardTitle>
                <CardDescription>Live updates from our US warehouses</CardDescription>
              </div>
              <Badge variant="outline" className="px-3 py-1">Updated just now</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {shipmentTimeline.map((item) => (
                <div key={item.reference} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{item.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.carrier} • {item.reference}</p>
                    </div>
                    <Badge variant={item.highlight ? "default" : "outline"}>
                      {item.highlight ? "Priority" : "Standard"}
                    </Badge>
                  </div>
                  <Progress value={item.progress} className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Stay a step ahead of procurement</CardDescription>
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
              <CardTitle>Recent orders</CardTitle>
              <CardDescription>High-level status on your latest transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "PO-2298", amount: "$48,400", status: "Packing", eta: "Arrives today" },
                { id: "PO-2284", amount: "$22,100", status: "In transit", eta: "ETA Friday" },
                { id: "PO-2281", amount: "$9,600", status: "Delivered", eta: "Signed by F. Brown" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.status} • {order.eta}</p>
                  </div>
                  <div className="text-right text-sm font-semibold">{order.amount}</div>
                </div>
              ))}
              <Button variant="ghost" className="w-full" asChild>
                <a href="/buyer/orders">View all orders</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Saved lists</CardTitle>
              <CardDescription>Reorder proven device mixes fast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedLists.map((list) => (
                <div key={list.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{list.name}</p>
                    <p className="text-sm text-muted-foreground">{list.items} devices • Updated {list.updated}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/buyer/saved-lists">Open</a>
                  </Button>
                </div>
              ))}
              <Button variant="secondary" className="w-full" asChild>
                <a href="/buyer/saved-lists">Manage lists</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Need to secure pricing?</CardTitle>
              <CardDescription>Start a quote and lock inventory for 48 hours.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/buyer/quotes/new">Create a quote</a>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    </BuyerLayout>
  );
}
