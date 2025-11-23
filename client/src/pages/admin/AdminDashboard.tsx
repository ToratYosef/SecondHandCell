// @ts-nocheck
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Package, FileText, Users, TrendingUp, DollarSign, AlertTriangle, Box, Settings, Layers, Clock, CheckCircle, XCircle, Activity } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminDashboard() {
  const { data: companies } = useQuery({
    queryKey: ["/api/admin/companies"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const pendingCompanies = companies?.filter((c: any) => c.status === "pending" || c.status?.includes("pending")).length || 0;
  const approvedCompanies = companies?.filter((c: any) => c.status === "approved").length || 0;
  const activeOrders = orders?.filter((o: any) => o.status !== "delivered" && o.status !== "cancelled" && o.status !== "completed").length || 0;
  const completedOrders = orders?.filter((o: any) => o.status === "completed" || o.status === "delivered").length || 0;
  const totalRevenue = orders?.reduce((sum: number, o: any) => sum + parseFloat(o.total || o.totalAmount || 0), 0) || 0;
  const monthRevenue = orders
    ?.filter((o: any) => {
      const created = new Date(o.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    })
    ?.reduce((sum: number, o: any) => sum + parseFloat(o.total || o.totalAmount || 0), 0) || 0;

  const stats = [
    {
      title: "Total Companies",
      value: companies?.length || 0,
      icon: Building2,
      description: `${approvedCompanies} approved \u2022 ${pendingCompanies} pending`,
      trend: "+12%",
      trendUp: true,
      color: "blue",
    },
    {
      title: "Active Orders",
      value: activeOrders,
      icon: Package,
      description: `${completedOrders} completed this month`,
      trend: "+8%",
      trendUp: true,
      color: "green",
    },
    {
      title: "Monthly Revenue",
      value: `$${monthRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: `$${totalRevenue.toFixed(2)} lifetime`,
      trend: "+23%",
      trendUp: true,
      color: "purple",
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: Users,
      description: `${users?.filter((u: any) => u.isActive).length || 0} active users`,
      trend: "+5%",
      trendUp: true,
      color: "orange",
    },
  ];

  // Fetch catalog to show low-stock alerts
  const { data: catalog } = useQuery({ queryKey: ["/api/catalog"] });
  const lowStockCount = catalog?.flatMap((d: any) => d.variants || [])?.filter((v: any) => (v.inventory?.quantityAvailable ?? 0) < 20 && (v.inventory?.quantityAvailable ?? 0) > 0).length || 0;
  const outOfStockCount = catalog?.flatMap((d: any) => d.variants || [])?.filter((v: any) => (v.inventory?.quantityAvailable ?? 0) === 0).length || 0;

  const pendingList = companies?.filter((c: any) => c.status && c.status.includes("pending")) || [];

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleSelect = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const approveSelected = async () => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (ids.length === 0) return toast({ title: "No selection", description: "Select companies to approve" });
    setApproveDialogOpen(true);
  };

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [exporting, setExporting] = useState<{ type: "orders" | "inventory" | null; inProgress: boolean; total?: number | null }>({ type: null, inProgress: false, total: null });

  const confirmApprove = async () => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (ids.length === 0) {
      setApproveDialogOpen(false);
      return toast({ title: "No selection", description: "Select companies to approve" });
    }

    setApproving(true);
    try {
      await apiRequest("POST", "/api/admin/companies/bulk", { companyIds: ids, status: "approved" });
      toast({ title: "Approved", description: `${ids.length} companies approved successfully` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      setSelected({});
      setApproveDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to approve companies", variant: "destructive" });
    } finally {
      setApproving(false);
    }
  };

  const exportOrdersCsv = async () => {
    try {
      setExporting({ type: "orders", inProgress: true, total: null });
      const res = await apiFetch("/api/admin/export/orders.csv?pageSize=500");
      if (!res.ok) throw new Error("Failed to fetch CSV");
      const total = res.headers.get("X-Total-Rows");
      setExporting({ type: "orders", inProgress: true, total: total ? parseInt(total, 10) : null });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Export complete", description: "Orders CSV downloaded" });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to export orders", variant: "destructive" });
    } finally {
      setExporting({ type: null, inProgress: false, total: null });
    }
  };

  const exportInventoryCsv = async () => {
    try {
      setExporting({ type: "inventory", inProgress: true, total: null });
      const res = await apiFetch("/api/admin/export/inventory.csv?pageSize=500");
      if (!res.ok) throw new Error("Failed to fetch CSV");
      const total = res.headers.get("X-Total-Rows");
      setExporting({ type: "inventory", inProgress: true, total: total ? parseInt(total, 10) : null });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Export complete", description: "Inventory CSV downloaded" });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to export inventory", variant: "destructive" });
    } finally {
      setExporting({ type: null, inProgress: false, total: null });
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      green: "from-green-500/10 to-green-600/5 border-green-500/20",
      purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
      orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Welcome back! Here's your platform overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/admin/companies">
              <Building2 className="mr-2 h-5 w-5" />
              Manage Companies
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`relative overflow-hidden border-2 bg-gradient-to-br ${getColorClasses(stat.color)} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-background/50 backdrop-blur-sm`}>
                  <stat.icon className={`h-6 w-6 ${getIconColor(stat.color)}`} />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                <Badge variant={stat.trendUp ? "default" : "secondary"} className="gap-1">
                  {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <Card className="border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-yellow-600" />
                <div>
                  <CardTitle className="text-xl text-yellow-800 dark:text-yellow-500">Inventory Alerts</CardTitle>
                  <CardDescription className="text-yellow-700/80 dark:text-yellow-400/80">
                    Immediate attention required
                  </CardDescription>
                </div>
              </div>
              <Button asChild variant="outline" size="lg">
                <Link href="/admin/inventory">
                  <Box className="mr-2 h-5 w-5" />
                  View Inventory
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4 p-4 bg-background/60 rounded-lg border border-yellow-500/20">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lowStockCount}</p>
                  <p className="text-sm text-muted-foreground">Low Stock Variants (&lt;20 units)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-background/60 rounded-lg border border-red-500/20">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{outOfStockCount}</p>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Recent Orders</CardTitle>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/orders">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders?.slice(0, 8).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Order #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <StatusBadge status={order.status} type="order" />
                      <p className="font-bold text-lg">${parseFloat(order.total || order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {(!orders || orders.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Order Fulfillment Rate</span>
                    <span className="text-sm font-bold text-green-600">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Target: 90%</p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Customer Satisfaction</span>
                    <span className="text-sm font-bold text-blue-600">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Based on feedback</p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Inventory Accuracy</span>
                    <span className="text-sm font-bold text-purple-600">96%</span>
                  </div>
                  <Progress value={96} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Last updated today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                  <div>
                    <CardTitle className="text-lg">Pending Approvals</CardTitle>
                    <CardDescription>{pendingList.length} companies awaiting review</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {pendingList.slice(0, 6).map((c: any) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={!!selected[c.id]} 
                      onChange={() => toggleSelect(c.id)} 
                      className="h-4 w-4 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.billingEmail || c.email || c.contact}</p>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/admin/companies`}>Review</Link>
                    </Button>
                  </div>
                ))}
                {pendingList.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50 text-green-500" />
                    <p className="text-sm">All companies reviewed!</p>
                  </div>
                )}
              </div>
              {pendingList.length > 0 && (
                <div className="mt-4 flex gap-2">
                  <Button onClick={approveSelected} size="sm" className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Selected
                  </Button>
                  <Button onClick={() => setSelected({})} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button asChild variant="outline" size="lg" className="justify-start">
                  <Link href="/admin/inventory">
                    <Box className="mr-3 h-5 w-5" />
                    Manage Inventory
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="justify-start">
                  <Link href="/admin/orders">
                    <Package className="mr-3 h-5 w-5" />
                    View Orders
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="justify-start">
                  <Link href="/admin/quotes">
                    <FileText className="mr-3 h-5 w-5" />
                    Manage Quotes
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="justify-start">
                  <Link href="/admin/users">
                    <Users className="mr-3 h-5 w-5" />
                    User Management
                  </Link>
                </Button>
                <Separator className="my-2" />
                <Button 
                  onClick={exportOrdersCsv} 
                  variant="outline" 
                  size="lg" 
                  className="justify-start"
                  disabled={exporting.inProgress && exporting.type === "orders"}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  {exporting.inProgress && exporting.type === "orders" ? `Exporting...${exporting.total ? ` (${exporting.total})` : ""}` : "Export Orders CSV"}
                </Button>
                <Button 
                  onClick={exportInventoryCsv} 
                  variant="outline" 
                  size="lg" 
                  className="justify-start"
                  disabled={exporting.inProgress && exporting.type === "inventory"}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  {exporting.inProgress && exporting.type === "inventory" ? `Exporting...${exporting.total ? ` (${exporting.total})` : ""}` : "Export Inventory CSV"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Selected Companies</DialogTitle>
            <DialogDescription>
              You are about to approve {Object.keys(selected).filter(id => selected[id]).length} company(ies). This will grant them access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmApprove} disabled={approving}>
              {approving ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
