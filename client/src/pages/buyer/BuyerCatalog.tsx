import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ShoppingCart, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ConditionBadge } from "@/components/ConditionBadge";

export default function BuyerCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const { toast } = useToast();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ["/api/catalog"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (variantId: string) => {
      return await apiRequest("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ deviceVariantId: variantId, quantity: 1 }),
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

  const filteredDevices = devices?.filter((device: any) => {
    const matchesSearch = device.marketingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || device.categoryId === selectedCategory;
    const matchesBrand = selectedBrand === "all" || device.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  }) || [];

  const brands = Array.from(new Set(devices?.map((d: any) => d.brand) || []));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Device Catalog</h1>
        <p className="text-muted-foreground mt-1">Browse our selection of premium refurbished devices</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]" data-testid="select-category">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[180px]" data-testid="select-brand">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand: any) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {devicesLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : filteredDevices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No devices found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedBrand("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device: any) => (
            <Card key={device.id} className="flex flex-col" data-testid={`card-device-${device.id}`}>
              <CardHeader>
                <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                  {device.imageUrl ? (
                    <img
                      src={device.imageUrl}
                      alt={device.marketingName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-muted-foreground">No image</span>
                  )}
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">{device.brand}</Badge>
                  <h3 className="font-semibold text-lg">{device.marketingName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {device.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {device.variants?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Available Variants:</p>
                    <div className="space-y-1">
                      {device.variants.slice(0, 3).map((variant: any) => (
                        <div key={variant.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {variant.storage} • {variant.color}
                          </span>
                          <ConditionBadge grade={variant.conditionGrade} />
                        </div>
                      ))}
                      {device.variants.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{device.variants.length - 3} more variants
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1" data-testid={`button-view-${device.id}`}>
                  <Link href={`/buyer/devices/${device.slug}`}>View Details</Link>
                </Button>
                {device.variants?.[0] && (
                  <Button
                    size="icon"
                    onClick={() => addToCartMutation.mutate(device.variants[0].id)}
                    disabled={addToCartMutation.isPending}
                    data-testid={`button-add-cart-${device.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
