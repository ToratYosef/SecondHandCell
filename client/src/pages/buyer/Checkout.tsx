import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, MapPin, Package, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

function CheckoutForm({ orderId, amount, onSuccess }: { orderId: string; amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on backend
        await apiRequest("/api/confirm-payment", {
          method: "POST",
          body: JSON.stringify({
            orderId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        toast({
          title: "Payment successful",
          description: "Your order has been placed successfully",
        });
        onSuccess();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
        data-testid="button-complete-order"
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [selectedBillingId, setSelectedBillingId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [notes, setNotes] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["/api/cart"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
  });

  const { data: company } = useQuery({
    queryKey: user ? ["/api/companies", user.companyId] : undefined,
    enabled: !!user?.companyId,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          shippingAddressId: selectedShippingId,
          billingAddressId: selectedBillingId,
          paymentMethod,
          notes,
        }),
      });
    },
    onSuccess: async (order: any) => {
      setCurrentOrderId(order.id);

      if (paymentMethod === "card") {
        // Create payment intent for card payments
        const paymentIntent = await apiRequest("/api/create-payment-intent", {
          method: "POST",
          body: JSON.stringify({
            amount: order.total,
            orderId: order.id,
          }),
        });

        setClientSecret(paymentIntent.clientSecret);
      } else {
        // For other payment methods, just redirect to orders
        toast({
          title: "Order created",
          description: `Order ${order.orderNumber} created. Payment instructions will be sent to your email.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        setTimeout(() => setLocation("/buyer/orders"), 2000);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    },
  });

  if (cartLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    setLocation("/buyer/cart");
    return null;
  }

  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.unitPriceSnapshot) * item.quantity;
  }, 0);
  const shipping = 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const shippingAddresses = company?.shippingAddresses || [];
  const billingAddresses = company?.billingAddresses || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-1">Review and complete your order</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedShippingId} onValueChange={setSelectedShippingId}>
                <SelectTrigger data-testid="select-shipping">
                  <SelectValue placeholder="Select shipping address" />
                </SelectTrigger>
                <SelectContent>
                  {shippingAddresses.map((addr: any) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.contactName} - {addr.street1}, {addr.city}, {addr.state} {addr.postalCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBillingId} onValueChange={setSelectedBillingId}>
                <SelectTrigger data-testid="select-billing">
                  <SelectValue placeholder="Select billing address" />
                </SelectTrigger>
                <SelectContent>
                  {billingAddresses.map((addr: any) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.contactName} - {addr.street1}, {addr.city}, {addr.state} {addr.postalCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" data-testid="radio-payment-card" />
                  <Label htmlFor="card" className="font-normal cursor-pointer">
                    Credit Card (Pay now via Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wire" id="wire" data-testid="radio-payment-wire" />
                  <Label htmlFor="wire" className="font-normal cursor-pointer">
                    Wire Transfer (Instructions sent after order)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ach" id="ach" data-testid="radio-payment-ach" />
                  <Label htmlFor="ach" className="font-normal cursor-pointer">
                    ACH Payment (Instructions sent after order)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="terms" id="terms" data-testid="radio-payment-terms" />
                  <Label htmlFor="terms" className="font-normal cursor-pointer">
                    Net Terms (For approved accounts)
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any special instructions for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                data-testid="textarea-notes"
              />
            </CardContent>
          </Card>

          {clientSecret && paymentMethod === "card" && currentOrderId && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    orderId={currentOrderId}
                    amount={total}
                    onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
                      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
                      setLocation("/buyer/orders");
                    }}
                  />
                </Elements>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.variant?.deviceModel?.marketingName || item.variant?.deviceModel?.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(item.unitPriceSnapshot) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>

              {!clientSecret && (
                <Button
                  onClick={() => createOrderMutation.mutate()}
                  disabled={!selectedShippingId || !selectedBillingId || createOrderMutation.isPending}
                  className="w-full"
                  size="lg"
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? "Creating order..." : paymentMethod === "card" ? "Continue to Payment" : "Place Order"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
