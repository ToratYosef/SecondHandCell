// @ts-nocheck
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Package, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ConditionBadge } from "@/components/ConditionBadge";
import { SaveToListButton } from "@/components/SaveToListButton";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Input } from "@/components/ui/input";

export default function DeviceDetails() {
  const [, params] = useRoute("/buyer/devices/:slug");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const { data: devices, isLoading } = useQuery({
    queryKey: ["/api/catalog"],
  });

  const device = devices?.find((d: any) => d.slug === params?.slug);
  const selectedVariant = device?.variants?.find((v: any) => v.id === selectedVariantId) || device?.variants?.[0];

  useEffect(() => {
    if (selectedVariant) {
      setVariantQuantities((prev) => {
        if (prev[selectedVariant.id] !== undefined) return prev;
        const minOrder = Math.max(1, selectedVariant.inventory?.minOrderQuantity ?? 1);
        return { ...prev, [selectedVariant.id]: minOrder };
      });
    }
  }, [selectedVariant]);

  const getSelectedQuantity = () => {
    if (!selectedVariant) return 1;
    const minOrder = Math.max(1, selectedVariant.inventory?.minOrderQuantity ?? 1);
    return variantQuantities[selectedVariant.id] ?? minOrder;
  };

  const updateSelectedQuantity = (change: number) => {
    if (!selectedVariant) return;
    const maxAvailable = selectedVariant.inventory?.quantityAvailable ?? Number.MAX_SAFE_INTEGER;
    const minOrder = Math.max(1, selectedVariant.inventory?.minOrderQuantity ?? 1);
    const currentQty = getSelectedQuantity();
    const updatedQty = Math.max(minOrder, Math.min(maxAvailable, currentQty + change));
    setVariantQuantities((prev) => ({ ...prev, [selectedVariant.id]: updatedQty }));
  };

  const handleQuantityInput = (value: string) => {
    if (!selectedVariant) return;
    const maxAvailable = selectedVariant.inventory?.quantityAvailable ?? Number.MAX_SAFE_INTEGER;
    const minOrder = Math.max(1, selectedVariant.inventory?.minOrderQuantity ?? 1);
    const parsed = parseInt(value, 10);
    const safeValue = Number.isNaN(parsed) ? minOrder : parsed;
    const clamped = Math.max(minOrder, Math.min(maxAvailable, safeValue));
    setVariantQuantities((prev) => ({ ...prev, [selectedVariant.id]: clamped }));
  };

  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      return await apiRequest("POST", "/api/cart/items", {
        deviceVariantId: variantId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item successfully added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="h-8 w-64 bg-muted rounded-md animate-pulse" />
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-96 bg-muted rounded-md animate-pulse" />
                <div className="h-96 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h2 className="text-2xl font-semibold mb-2">Device not found</h2>
                  <p className="text-muted-foreground">The device you're looking for doesn't exist</p>
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
        <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">{device.brand}</Badge>
              <h1 className="text-3xl font-semibold tracking-tight">{device.marketingName}</h1>
              <p className="text-muted-foreground mt-1">SKU: {device.sku}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {device.imageUrl ? (
              <img
                src={device.imageUrl}
                alt={device.marketingName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-24 w-24 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Variant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedVariantId || device.variants?.[0]?.id || ""}
                onValueChange={setSelectedVariantId}
              >
                <SelectTrigger data-testid="select-variant">
                  <SelectValue placeholder="Choose a variant" />
                </SelectTrigger>
                <SelectContent>
                  {device.variants?.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.storage} • {variant.color} • Grade {variant.conditionGrade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedVariant && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Storage</p>
                      <p className="font-medium">{selectedVariant.storage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Color</p>
                      <p className="font-medium">{selectedVariant.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Condition</p>
                      <ConditionBadge grade={selectedVariant.conditionGrade} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Network</p>
                      <Badge variant="outline" className="capitalize">
                        {selectedVariant.networkLockStatus}
                      </Badge>
                    </div>
                  </div>

                  {selectedVariant.inventory && (
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Stock Available</p>
                          <p className="text-2xl font-bold">{selectedVariant.inventory.quantityAvailable} units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-muted-foreground">Min Order</p>
                          <p className="text-lg font-semibold">{selectedVariant.inventory.minOrderQuantity} units</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedVariant.priceTiers && selectedVariant.priceTiers.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Volume Pricing</p>
                      <div className="space-y-2">
                        {selectedVariant.priceTiers.map((tier: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                            <span>
                              {tier.minQuantity}
                              {tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} units
                            </span>
                            <span className="font-semibold">${tier.unitPrice}/ea</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateSelectedQuantity(-1)}
                          disabled={!selectedVariant}
                          data-testid="button-quantity-decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min={selectedVariant?.inventory?.minOrderQuantity ?? 1}
                          value={getSelectedQuantity()}
                          onChange={(event) => handleQuantityInput(event.target.value)}
                          className="w-24 text-center"
                          data-testid="input-quantity"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateSelectedQuantity(1)}
                          disabled={!selectedVariant}
                          data-testid="button-quantity-increase"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedVariant?.inventory?.quantityAvailable && (
                        <p className="text-xs text-muted-foreground">
                          {selectedVariant.inventory.quantityAvailable} units available
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() =>
                          addToCartMutation.mutate({
                            variantId: selectedVariant.id,
                            quantity: getSelectedQuantity(),
                          })
                        }
                        disabled={!selectedVariant || addToCartMutation.isPending}
                        className="flex-1"
                        data-testid="button-add-to-cart"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <SaveToListButton
                        deviceVariantId={selectedVariant.id}
                        deviceName={device.marketingName}
                        variant="outline"
                        size="default"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="grading">Grading Info</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{device.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specs" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Brand</p>
                  <p className="font-medium">{device.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p className="font-medium">{device.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Variants</p>
                  <p className="font-medium">{device.variants?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grading" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Grade A - Excellent</h3>
                <p className="text-sm text-muted-foreground">
                  Like new condition with minimal to no signs of wear. May have very minor cosmetic imperfections.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Grade B - Very Good</h3>
                <p className="text-sm text-muted-foreground">
                  Light signs of wear including minor scratches or scuffs. Fully functional with no impact on performance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Grade C - Good</h3>
                <p className="text-sm text-muted-foreground">
                  Moderate signs of wear including scratches, scuffs, or minor dents. Fully functional.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Grade D - Fair</h3>
                <p className="text-sm text-muted-foreground">
                  Heavy cosmetic wear but fully functional. May have dents, deep scratches, or discoloration.
                </p>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
