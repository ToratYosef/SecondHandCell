import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ConditionBadge } from "@/components/ConditionBadge";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: cart, isLoading } = useQuery<any>({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return await apiRequest("PATCH", `/api/cart/items/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await apiRequest("DELETE", `/api/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <h1 className="text-3xl font-semibold tracking-tight text-center sm:text-left">Shopping Cart</h1>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
                <div className="h-64 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.unitPrice) * item.quantity;
  }, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <h1 className="text-3xl font-semibold tracking-tight text-center sm:text-left">Shopping Cart</h1>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-6">Add some devices to get started</p>
                  <Button asChild data-testid="button-browse-catalog">
                    <Link href="/buyer/catalog">Browse Catalog</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
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
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
              <p className="text-muted-foreground mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item: any) => (
                  <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-muted rounded-md flex-shrink-0">
                          {item.variant?.deviceModel?.imageUrl && (
                            <img
                              src={item.variant.deviceModel.imageUrl}
                              alt={item.variant.deviceModel.marketingName}
                              className="w-full h-full object-cover rounded-md"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold">{item.variant?.deviceModel?.marketingName}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.variant?.storage} • {item.variant?.color}
                              </p>
                              <div className="mt-2">
                                <ConditionBadge grade={item.variant?.conditionGrade} />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItemMutation.mutate(item.id)}
                              disabled={removeItemMutation.isPending}
                              data-testid={`button-remove-${item.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantityMutation.mutate({
                                      itemId: item.id,
                                      quantity: item.quantity - 1,
                                    });
                                  }
                                }}
                                disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                                data-testid={`button-decrease-${item.id}`}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value);
                                  if (qty > 0) {
                                    updateQuantityMutation.mutate({
                                      itemId: item.id,
                                      quantity: qty,
                                    });
                                  }
                                }}
                                className="w-20 text-center"
                                data-testid={`input-quantity-${item.id}`}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  updateQuantityMutation.mutate({
                                    itemId: item.id,
                                    quantity: item.quantity + 1,
                                  });
                                }}
                                disabled={updateQuantityMutation.isPending}
                                data-testid={`button-increase-${item.id}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">${item.unitPrice} each</p>
                              <p className="font-semibold text-lg">
                                ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span data-testid="text-total">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button 
                      asChild 
                      className="w-full" 
                      size="lg"
                      data-testid="button-checkout"
                    >
                      <Link href="/buyer/checkout">Proceed to Checkout</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/buyer/catalog">Continue Shopping</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
