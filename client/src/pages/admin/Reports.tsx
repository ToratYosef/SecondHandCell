import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8fd3ff"];

export default function Reports() {
  const { data: topSkus } = useQuery({ queryKey: ["/api/admin/reports/top-skus"], queryFn: async () => { const res = await fetch('/api/admin/reports/top-skus'); return res.ok ? res.json() : []; }, retry: false });
  const { data: suppliers } = useQuery({ queryKey: ["/api/admin/reports/top-suppliers"], queryFn: async () => { const res = await fetch('/api/admin/reports/top-suppliers'); return res.ok ? res.json() : []; }, retry: false });
  const { data: byRegion } = useQuery({ queryKey: ["/api/admin/reports/sales-by-region"], queryFn: async () => { const res = await fetch('/api/admin/reports/sales-by-region'); return res.ok ? res.json() : []; }, retry: false });
  const { data: timeseries } = useQuery({ queryKey: ["/api/admin/reports/sales-timeseries"], queryFn: async () => { const res = await fetch('/api/admin/reports/sales-timeseries'); return res.ok ? res.json() : []; }, retry: false });

  const monthly = useMemo(() => {
    if (!timeseries) return [];
    return timeseries.map((t: any) => ({ month: t.month, revenue: t.total || 0, count: t.count || 0 }));
  }, [timeseries]);

  const statusDist = useMemo(() => {
    // derive from suppliers or topSkus fallback - keep small pie from topSkus counts
    if (!topSkus) return [];
    // create a simple distribution of top SKU quantities by first 5
    return topSkus.slice(0,5).map((s:any, i:number)=>({ name: s.sku || s.name || `sku-${i}`, value: s.qty || 0 }));
  }, [topSkus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Sales and platform metrics</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top SKUs</CardTitle>
            <CardDescription>Most sold items</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topSkus?.map((s: any, i: number) => (
                <li key={s.sku || i} className="flex justify-between">
                  <span>{s.name || s.sku}</span>
                  <span className="font-semibold">{s.qty}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
            <CardDescription>Suppliers by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suppliers?.map((s: any) => (
                <li key={s.companyId} className="flex justify-between">
                  <span>{s.name}</span>
                  <span className="font-semibold">${(s.revenue || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Revenue by state</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {byRegion?.map((r: any) => (
                <li key={r.state} className="flex justify-between">
                  <span>{r.state}</span>
                  <span className="font-semibold">${(r.total || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales (Monthly)</CardTitle>
            <CardDescription>Revenue by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v:number)=>`$${v.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution (Sample)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 260 }} className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
