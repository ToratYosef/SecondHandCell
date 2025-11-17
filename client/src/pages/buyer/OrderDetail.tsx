import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  MapPin, 
  CreditCard,
  ArrowLeft,
  Download
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function OrderDetail() {
  const params = useParams();
  const orderNumber = params.orderNumber;

  const { data: order, isLoading } = useQuery<any>({
    queryKey: [`/api/orders/${orderNumber}`],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="h-12 bg-muted rounded-md animate-pulse" />
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
                <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
                <Button asChild data-testid="button-back-to-orders">
                  <Link href="/buyer/orders">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Button variant="ghost" asChild className="mb-2" data-testid="button-back">
                  <Link href="/buyer/orders">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
                <h1 className="text-3xl font-semibold tracking-tight" data-testid="text-order-number">
                  Order #{order.orderNumber}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} type="order" />
                <Button variant="outline" data-testid="button-download-invoice">
                  <Download className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </div>
            </div>

            {/* Order Status Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusBadge status={order.status} type="order" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium" data-testid={`text-item-name-${index}`}>
                            {item.deviceName || "Device"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            SKU: {item.sku || "N/A"}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="text-muted-foreground">Price: ${item.unitPrice}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${item.lineTotal}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal}</span>
                  </div>
                  {order.taxAmount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${order.taxAmount}</span>
                    </div>
                  )}
                  {order.shippingCost && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${order.shippingCost}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span data-testid="text-total-amount">${order.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Billing Info */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.shippingAddress ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No shipping address provided</p>
                  )}
                </CardContent>
              </Card>

              {/* Payment & Tracking */}
              <div className="space-y-6">
                {/* Payment Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="capitalize">{order.paymentMethod || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={order.paymentStatus} type="payment" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Carrier</span>
                          <span>{order.carrier || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Tracking Number</span>
                          <span className="font-mono text-xs" data-testid="text-tracking-number">
                            {order.trackingNumber}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
