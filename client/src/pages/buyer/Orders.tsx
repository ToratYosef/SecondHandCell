import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Package, Calendar, DollarSign, Truck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import type { Order } from "@shared/schema";

export default function Orders() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const sortedOrders = [...(orders ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>
              <p className="text-muted-foreground mt-1">View and track your order history</p>
            </div>

            {sortedOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start browsing to place your first order</p>
            <Button asChild data-testid="button-browse-catalog">
              <Link href="/buyer/catalog">Browse Catalog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id} data-testid={`order-card-${order.orderNumber}`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${order.total}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} type="order" />
                    <Button asChild variant="outline" data-testid={`button-view-${order.orderNumber}`}>
                      <Link href={`/buyer/orders/${order.orderNumber}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Payment Status</p>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Order Progress</p>
                    <StatusBadge status={order.status} type="order" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">Available on order detail</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tracking</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Track this shipment in the detail view</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
