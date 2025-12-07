import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Package, Calendar, DollarSign, Truck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  if (isLoading) {
    return (
      <BuyerLayout>
        <PageShell
          title="My Orders"
          description="View and track your order history"
          className="mx-auto max-w-6xl"
        >
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        </PageShell>
      </BuyerLayout>
    );
  }

  const sortedOrders = Array.isArray(orders)
    ? [...orders].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  return (
    <BuyerLayout>
      <PageShell
        title="My Orders"
        description="View and track your order history"
        className="mx-auto max-w-6xl"
      >
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-semibold">No orders yet</h2>
              <p className="mb-6 text-muted-foreground">Start browsing to place your first order</p>
              <Button asChild data-testid="button-browse-catalog">
                <Link href="/buyer/catalog">Browse Catalog</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <Badge variant="secondary">{order.items?.length || 0} items</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking</p>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{order.trackingNumber || "Not available"}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="border-t bg-muted/50 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Paid via {order.paymentMethod || "Wire"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/buyer/orders/${order.id}`} data-testid={`button-view-order-${order.id}`}>
                          View details
                        </Link>
                      </Button>
                      <Button variant="secondary">Download invoice</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageShell>
    </BuyerLayout>
  );
}
