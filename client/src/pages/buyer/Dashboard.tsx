import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Package, ShoppingCart, FileText, Heart, TrendingUp, Clock } from "lucide-react";

export default function BuyerDashboard() {
  const { data: user } = useQuery({ queryKey: ["/api/me"] });
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });
  const { data: cart } = useQuery({ queryKey: ["/api/cart"] });

  const stats = [
    {
      title: "Active Orders",
      value: recentOrders?.filter((o: any) => o.status !== "delivered").length || 0,
      icon: Package,
      link: "/buyer/orders",
    },
    {
      title: "Cart Items",
      value: cart?.items?.length || 0,
      icon: ShoppingCart,
      link: "/buyer/cart",
    },
    {
      title: "Pending Quotes",
      value: 0,
      icon: FileText,
      link: "/buyer/quotes",
    },
    {
      title: "Saved Lists",
      value: 0,
      icon: Heart,
      link: "/buyer/saved-lists",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your account</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your latest orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <Link key={order.id} href={`/buyer/orders/${order.orderNumber}`}>
                    <div className="flex items-center justify-between p-3 rounded-md border hover-elevate active-elevate-2 cursor-pointer">
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.totalAmount}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No orders yet</p>
                <Button asChild className="mt-4" size="sm">
                  <Link href="/buyer/catalog">Browse Catalog</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start" data-testid="button-browse-catalog">
              <Link href="/buyer/catalog">
                <Package className="mr-2 h-4 w-4" />
                Browse Catalog
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-cart">
              <Link href="/buyer/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Cart
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" data-testid="button-request-quote">
              <Link href="/buyer/quotes/new">
                <FileText className="mr-2 h-4 w-4" />
                Request Quote
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-orders">
              <Link href="/buyer/orders">
                <Clock className="mr-2 h-4 w-4" />
                View All Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
