// @ts-nocheck
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Package, FileText, Users, TrendingUp, DollarSign, AlertTriangle, Box, Settings, Layers } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";

export default function AdminDashboard() {
  const { data: companies } = useQuery({
    queryKey: ["/api/admin/companies"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
  });

  const pendingCompanies = companies?.filter((c: any) => c.status === "pending").length || 0;
  const activeOrders = orders?.filter((o: any) => o.status !== "delivered").length || 0;
  const totalRevenue = orders?.reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount), 0) || 0;

  const stats = [
    {
      title: "Total Companies",
      value: companies?.length || 0,
      icon: Building2,
      description: `${pendingCompanies} pending approval`,
    },
    {
      title: "Active Orders",
      value: activeOrders,
      icon: Package,
      description: "Orders in progress",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Lifetime revenue",
    },
    {
      title: "Pending Quotes",
      value: 0,
      icon: FileText,
      description: "Awaiting response",
    },
  ];

  // Fetch catalog to show low-stock alerts
  const { data: catalog } = useQuery({ queryKey: ["/api/catalog"] });
  const lowStockCount = catalog?.flatMap((d: any) => d.variants || [])?.filter((v: any) => (v.inventory?.quantityAvailable ?? 0) < 20).length || 0;

  const pendingList = companies?.filter((c: any) => c.status && c.status.includes("pending")) || [];

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleSelect = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const approveSelected = async () => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (ids.length === 0) return toast({ title: "No selection", description: "Select companies to approve" });

    // Open confirmation dialog
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
      toast({ title: "Approved", description: `${ids.length} companies approved` });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      setSelected({});
      setApproveDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to approve companies", variant: "destructive" });
    } finally {
      setApproving(false);
    }
  };

  const downloadCsv = (filename: string, csv: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost"><Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></Button>
          <Button asChild><Link href="/admin/companies">Manage Companies</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </div>
              
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}

        {/* Low stock card */}
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{lowStockCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Variants below threshold (&lt;20)</p>
              </div>
              <div>
                <Button asChild size="sm"><Link href="/admin/inventory">View Inventory</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders?.slice(0, 8).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold">${order.totalAmount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Order Fulfillment</span>
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pending Approvals
                <span className="text-xs text-muted-foreground">{pendingList.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingList.slice(0, 6).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={!!selected[c.id]} onChange={() => toggleSelect(c.id)} />
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email || c.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm"><Link href={`/admin/companies`}>Review</Link></Button>
                    </div>
                  </div>
                ))}
                {pendingList.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pending approvals</p>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="mt-3 flex gap-2">
            <Button onClick={approveSelected} size="sm">Approve Selected</Button>
            <Button onClick={() => setSelected({})} variant="outline" size="sm">Clear</Button>
          </div>

          <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Selected Companies</DialogTitle>
                <DialogDescription>
                  You are about to approve {Object.keys(selected).filter(id => selected[id]).length} company(ies). This action will mark them as approved.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
                <Button onClick={confirmApprove} disabled={approving}>{approving ? "Approving..." : "Confirm Approve"}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button asChild size="sm"><Link href="/admin/inventory">Inventory</Link></Button>
                <Button asChild size="sm"><Link href="/admin/orders">Orders</Link></Button>
                <Button asChild size="sm"><Link href="/admin/quotes">Quotes</Link></Button>
                <Button asChild size="sm"><Link href="/admin/users">Users</Link></Button>
                <Button asChild size="sm"><Link href="/admin/settings">Settings</Link></Button>
                <Button onClick={exportOrdersCsv} size="sm" disabled={exporting.inProgress && exporting.type === "orders"}>
                  {exporting.inProgress && exporting.type === "orders" ? `Exporting Orders${exporting.total ? ` (${exporting.total})` : ""}` : "Export Orders CSV"}
                </Button>
                <Button onClick={exportInventoryCsv} size="sm" disabled={exporting.inProgress && exporting.type === "inventory"}>
                  {exporting.inProgress && exporting.type === "inventory" ? `Exporting Inventory${exporting.total ? ` (${exporting.total})` : ""}` : "Export Inventory CSV"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
