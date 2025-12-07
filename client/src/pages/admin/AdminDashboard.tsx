import { AdminLayout } from "@/components/AdminLayout";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CheckCircle2, ShieldAlert } from "lucide-react";

const statCards = [
  { title: "New buyers", value: "28", change: "+6 vs last week", tone: "positive" },
  { title: "Pending reviews", value: "12", change: "Need compliance checks", tone: "warning" },
  { title: "Open orders", value: "94", change: "$482k in pipeline", tone: "neutral" },
  { title: "Tickets", value: "7", change: "2 escalations", tone: "warning" },
];

const revenueData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 180 },
  { name: "Wed", value: 260 },
  { name: "Thu", value: 220 },
  { name: "Fri", value: 310 },
];

const queue = [
  { title: "Review PO-2298", detail: "LTL freight routing", badge: "Logistics" },
  { title: "Compliance - New buyer", detail: "Verify resale certificate", badge: "Compliance" },
  { title: "Restock laptops", detail: "Sync Dallas and Newark counts", badge: "Inventory" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <PageShell
        title="Admin control center"
        description="Track onboarding, orders, and platform health in one view."
        badge="Admin"
        actions={<Button asChild><a href="/admin/reports">Open reports</a></Button>}
      >
        <div className="grid gap-4 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover-elevate">
              <CardHeader className="pb-2">
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">{stat.change}</CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue pace</CardTitle>
                <CardDescription>Trailing 7 days across all warehouses</CardDescription>
              </div>
              <Badge variant="outline">Live</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ops queue</CardTitle>
              <CardDescription>Prioritize what needs action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {queue.map((item) => (
                <div key={item.title} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="secondary">{item.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full" asChild>
                <a href="/admin/orders">View all tasks</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="buyers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="buyers">Buyer approvals</TabsTrigger>
            <TabsTrigger value="quality">Quality alerts</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
          </TabsList>
          <TabsContent value="buyers" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Northpoint Mobile", status: "Pending docs" },
              { name: "Atlas Wireless", status: "Manual review" },
              { name: "Bluefin Traders", status: "Approved" },
            ].map((buyer) => (
              <Card key={buyer.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{buyer.name}</CardTitle>
                  <Badge variant="secondary">{buyer.status}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Reseller documentation stored. Net terms pending.
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="quality" className="space-y-3">
            {["Zero DOA in last 7 days", "2 RMAs pending inspection"].map((note) => (
              <Card key={note} className="flex items-center gap-3 border-dashed p-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="text-sm">{note}</p>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="shipments" className="space-y-3">
            {["Dallas outbound capacity at 78%", "Newark inbound 2 pallets arriving"].map((update) => (
              <Card key={update} className="flex items-center gap-3 p-4">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <p className="text-sm">{update}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </PageShell>
    </AdminLayout>
  );
}
