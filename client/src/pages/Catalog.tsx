import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Lock, Smartphone, Search, Loader2, Plus, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PublicDevice {
  id: string;
  brand: string;
  marketingName: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string | null;
  description: string | null;
  variantCount: number;
  availableConditions: string[];
  availableStorage: string[];
  availableColors: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data: devices, isLoading: devicesLoading } = useQuery<PublicDevice[]>({
    queryKey: ["/api/public/catalog"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/public/categories"],
  });

  // Current authenticated user (if any) - used to allow admins to see pricing
  const { data: me } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return null;
        return await res.json();
      } catch (err) {
        return null;
      }
    },
    retry: false,
  });

  const canSeePricing = !!me && (me.role === "buyer" || me.role === "admin" || me.role === "super_admin");

  // Fetch richer catalog for authenticated buyers/admins, otherwise public catalog
  const { data: devicesFull, isLoading: devicesFullLoading } = useQuery({
    queryKey: ["/api/catalog", canSeePricing],
    queryFn: async () => {
      try {
        const endpoint = canSeePricing ? "/api/catalog" : "/api/public/catalog";
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to load catalog");
        return await res.json();
      } catch (err) {
        return null;
      }
    },
  });

  // Prefer the full devices when available
  const effectiveDevices: any[] = devicesFull || devices || [];
  const effectiveDevicesLoading = devicesFullLoading || devicesLoading;

  const [location] = useLocation();

  // Read `?category=` query param (slug or id) and set selectedCategory accordingly
  useEffect(() => {
    try {
      const query = (location && location.includes("?") && location.split("?")[1]) || window?.location?.search?.replace(/^\?/, "") || "";
      const params = new URLSearchParams(query);
      const categoryParam = params.get("category");
      if (!categoryParam) return;

      // If categories are not loaded yet, wait until they load
      if (!categories || categories.length === 0) return;

      // Try to find by slug first, then by id. If not found and value is 'all', clear filter.
      const foundBySlug = categories.find((c) => c.slug === categoryParam);
      const foundById = categories.find((c) => c.id === categoryParam);

      if (foundBySlug) {
        setSelectedCategory(foundBySlug.id);
      } else if (foundById) {
        setSelectedCategory(foundById.id);
      } else if (categoryParam === "all") {
        setSelectedCategory("all");
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [location, categories]);

  // Filter devices (from effectiveDevices)
  const filteredDevices = effectiveDevices?.filter((device: any) => {
    const matchesSearch = 
      (device.marketingName || device.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.brand || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || device.categoryId === selectedCategory || device.categoryId === selectedCategory;
    const matchesBrand = selectedBrand === "all" || device.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  }) || [];

  // Get unique brands
  const brands = Array.from(new Set((effectiveDevices || []).map((d: any) => d.brand))).sort();

  // Quantity management
  const getQuantity = (deviceId: string) => quantities[deviceId] || 1;
  
  const updateQuantity = (deviceId: string, change: number) => {
    const currentQty = getQuantity(deviceId);
    const newQty = Math.max(1, currentQty + change);
    setQuantities(prev => ({ ...prev, [deviceId]: newQty }));
  };
  
  const handleQuantityInput = (deviceId: string, value: string) => {
    const num = parseInt(value) || 1;
    setQuantities(prev => ({ ...prev, [deviceId]: Math.max(1, num) }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-12">
          <div className="container px-4 sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight" data-testid="text-catalog-headline">
              Wholesale Device Catalog
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Browse our inventory of certified pre-owned devices. Sign in to see wholesale pricing.
            </p>
          </div>
        </section>

        {/* Catalog Content */}
        <section className="py-12">
          <div className="container px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="mb-8 space-y-4">
              {/* Login Notice (only show when user cannot see pricing) */}
              {!canSeePricing && (
                <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    <p className="text-sm">
                      <strong>Sign in to view wholesale pricing</strong> — Approved wholesale buyers get access to tiered pricing and bulk ordering
                    </p>
                  </div>
                  <Button asChild data-testid="button-catalog-login">
                    <Link href="/login?redirect=/buyer/catalog">Login</Link>
                  </Button>
                </CardContent>
                </Card>
              )}

              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48" data-testid="select-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-48" data-testid="select-brand">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              {!effectiveDevicesLoading && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredDevices.length} of {effectiveDevices?.length || 0} devices
                </p>
              )}
            </div>

            {/* Loading State */}
            {effectiveDevicesLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="rounded-lg shadow-sm">
                    <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-20 mb-2" />
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Device Grid */}
            {!effectiveDevicesLoading && filteredDevices.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDevices.map((device) => (
                    <Card key={device.id} className="hover-elevate rounded-lg shadow-md overflow-hidden" data-testid={`card-device-${device.id}`}>
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                      {device.imageUrl ? (
                        <img 
                          src={device.imageUrl} 
                          alt={`${device.brand} ${device.marketingName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Smartphone className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{device.categoryName}</Badge>
                        {device.variantCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {device.variantCount} variant{device.variantCount !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg md:text-xl">
                        {device.brand} {device.marketingName}
                      </CardTitle>
                      {device.description && (
                        <CardDescription className="line-clamp-2">
                          {device.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {device.availableStorage.length > 0 && (
                          <div>
                            <p className="text-muted-foreground mb-1">Storage:</p>
                            <div className="flex flex-wrap gap-1">
                              {device.availableStorage.slice(0, 4).map((storage) => (
                                <Badge key={storage} variant="outline" className="text-xs">
                                  {storage}
                                </Badge>
                              ))}
                              {device.availableStorage.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{device.availableStorage.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {device.availableConditions.length > 0 && (
                          <div>
                            <p className="text-muted-foreground mb-1">Conditions:</p>
                            <div className="flex flex-wrap gap-1">
                              {device.availableConditions.map((condition) => (
                                <Badge key={condition} variant="outline" className="text-xs">
                                  Grade {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(device.id, -1)}
                            data-testid={`button-decrease-${device.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={getQuantity(device.id)}
                            onChange={(e) => handleQuantityInput(device.id, e.target.value)}
                            className="h-8 w-16 text-center"
                            data-testid={`input-quantity-${device.id}`}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(device.id, 1)}
                            data-testid={`button-increase-${device.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {canSeePricing ? (
                        <Button variant="outline" className="mt-3 w-full" asChild data-testid={`button-view-${device.id}`}>
                          <Link href={`/catalog/models/${device.slug || device.id}`}>View Pricing</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="mt-3 w-full" asChild data-testid={`button-view-${device.id}`}>
                          <Link href="/login?redirect=/buyer/catalog">Sign In to View Pricing</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!effectiveDevicesLoading && filteredDevices.length === 0 && effectiveDevices && effectiveDevices.length > 0 && (
              <div className="py-16 text-center">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No devices found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search term</p>
              </div>
            )}

            {/* No Devices at All */}
            {!effectiveDevicesLoading && effectiveDevices && effectiveDevices.length === 0 && (
              <div className="py-16 text-center">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No devices available</p>
                <p className="text-muted-foreground">Check back later for new inventory</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
