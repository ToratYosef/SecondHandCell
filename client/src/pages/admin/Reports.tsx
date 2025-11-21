import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

function monthLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default function Reports() {
  const { data: orders } = useQuery<any[]>({ queryKey: ["/api/admin/orders"] });

  const monthly = useMemo(() => {
    if (!orders) return [];
    const map: Record<string, number> = {};
    for (const o of orders) {
      const label = monthLabel(o.createdAt || o.created_at || new Date().toISOString());
      const amount = parseFloat(o.total || o.totalAmount || 0) || 0;
      map[label] = (map[label] || 0) + amount;
    }
    return Object.keys(map).sort((a,b)=> new Date(a).getTime() - new Date(b).getTime()).map(k=>({ month: k, revenue: map[k] }));
  }, [orders]);

  const statusDist = useMemo(() => {
    if (!orders) return [];
    const counts: Record<string, number> = {};
    for (const o of orders) {
      const s = o.status || "unknown";
      counts[s] = (counts[s] || 0) + 1;
    }
    return Object.keys(counts).map(k=>({ name: k, value: counts[k] }));
  }, [orders]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8fd3ff"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Sales and platform metrics</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
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
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 300 }} className="flex items-center justify-center">
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
