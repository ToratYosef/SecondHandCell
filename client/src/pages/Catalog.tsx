import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronUp, ShoppingCart, Bell, FileText, Download, Upload, Settings as SettingsIcon, HelpCircle, AlertCircle, Plus, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [selectedLockStatuses, setSelectedLockStatuses] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<any | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [offerMode, setOfferMode] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(false);

  const { data: devices, isLoading: devicesLoading } = useQuery<PublicDevice[]>({
    queryKey: ["/api/public/catalog"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/public/categories"],
  });

  const { data: me } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await apiFetch("/api/auth/me");
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
        const res = await apiFetch(endpoint);
        if (!res.ok) throw new Error("Failed to load catalog");
        return await res.json();
      } catch (err) {
        return null;
      }
    },
  });

  // Cart data
  const { data: cartData } = useQuery({
    queryKey: ["/api/cart"],
    enabled: canSeePricing,
  });

  const cartItemCount = cartData?.items?.length || 0;

  // Prefer the full devices when available
  const effectiveDevices: any[] = devicesFull || devices || [];
  const effectiveDevicesLoading = devicesFullLoading || devicesLoading;

  useEffect(() => {
    if (effectiveDevices && effectiveDevices.length > 0) setLastUpdated(new Date());
  }, [effectiveDevices]);

  const [location] = useLocation();

  // Read `?category=` query param (slug or id) and set selectedCategory accordingly
  useEffect(() => {
    try {
      const query = (location && location.includes("?") && location.split("?")[1]) || window?.location?.search?.replace(/^\?/, "") || "";
      const params = new URLSearchParams(query);
      const categoryParam = params.get("category");
      if (!categoryParam || !categories || categories.length === 0) return;

      const foundBySlug = categories.find((c) => c.slug === categoryParam);
      const foundById = categories.find((c) => c.id === categoryParam);

      if (foundBySlug) {
        setSelectedCategories([foundBySlug.id]);
      } else if (foundById) {
        setSelectedCategories([foundById.id]);
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [location, categories]);

  // Extract all variants from devices
  const allVariants = effectiveDevices.flatMap((device: any) =>
    (device.variants || []).map((variant: any) => ({
      ...variant,
      device: {
        brand: device.brand,
        marketingName: device.marketingName || device.name,
        sku: device.sku,
        categoryId: device.categoryId,
      },
      unitPrice: variant.priceTiers?.[0]?.unitPrice,
    }))
  );

  // Derive filter options
  const warehouseOptions = Array.from(new Set(allVariants.map((v: any) => v.inventory?.location || "Unknown").filter(Boolean)));
  const gradeOptions = Array.from(new Set(allVariants.map((v: any) => v.conditionGrade).filter(Boolean)));

  // Toggle filter selections
  const toggleCategory = (id: string) => {
    setSelectedCategories((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };
  const toggleWarehouse = (w: string) => {
    setSelectedWarehouses((s) => s.includes(w) ? s.filter((x) => x !== w) : [...s, w]);
  };
  const toggleLockStatus = (status: string) => {
    setSelectedLockStatuses((s) => s.includes(status) ? s.filter((x) => x !== status) : [...s, status]);
  };
  const toggleGrade = (g: string) => {
    setSelectedGrades((s) => s.includes(g) ? s.filter((x) => x !== g) : [...s, g]);
  };

  // Filter variants
  const filteredVariants = allVariants.filter((variant: any) => {
    const qty = variant.inventory?.quantityAvailable ?? 0;
    if (!includeOutOfStock && qty === 0) return false;

    if (selectedCategories.length > 0 && !selectedCategories.includes(variant.device.categoryId)) return false;
    if (selectedWarehouses.length > 0) {
      const warehouse = variant.inventory?.location || "Unknown";
      if (!selectedWarehouses.includes(warehouse)) return false;
    }
    if (selectedLockStatuses.length > 0 && !selectedLockStatuses.includes(variant.networkLockStatus)) return false;
    if (selectedGrades.length > 0 && !selectedGrades.includes(variant.conditionGrade)) return false;

    return true;
  });

  // Group variants by device title + storage
  const groups = filteredVariants.reduce((acc: any, v: any) => {
    const key = `${v.device.brand} ${v.device.marketingName} ${v.storage}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {} as Record<string, any[]>);

  const groupKeys = Object.keys(groups).sort();
  const totalResults = groupKeys.length;
  const pagedKeys = groupKeys.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(totalResults / pageSize);

  const toggleGroup = (key: string) => setExpandedGroups((s) => ({ ...s, [key]: !s[key] }));

  const openProductModal = (variant: any, isOffer = false) => {
    setModalVariant(variant);
    setModalQty(variant.inventory?.minOrderQuantity || 1);
    setOfferMode(isOffer);
    setOfferPrice("");
    setAlertEnabled(false);
    setProductModalOpen(true);
  };

  const addToCart = async () => {
    if (!modalVariant) return;
    try {
      await apiRequest("POST", "/api/cart/items", { deviceVariantId: modalVariant.id, quantity: modalQty });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({ title: "Added", description: "Item added to cart" });
      setProductModalOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to add to cart", variant: "destructive" });
    }
  };

  const submitOffer = async () => {
    // Placeholder: offers are not implemented yet
    toast({ title: "Offer submitted", description: `Offer for $${offerPrice} submitted` });
    setProductModalOpen(false);
  };

  if (effectiveDevicesLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30 p-8">
          <div className="text-center"><Skeleton className="h-12 w-64 mx-auto" /></div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />

      {/* Notification Banner */}
      <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
        <div className="container px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-900 dark:text-amber-100">3 of your offers are expiring soon.</span>
          </div>
          <div className="flex gap-2">
            <Button variant="link" size="sm" className="text-amber-700 dark:text-amber-300">SEE OFFERS</Button>
            <Button variant="link" size="sm" className="text-amber-700 dark:text-amber-300">VIEW FAQ</Button>
          </div>
        </div>
      </div>

      {/* Main Header with Actions */}
      <div className="border-b bg-background">
        <div className="container px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Stock List</h1>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last Updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm"><HelpCircle className="h-4 w-4 mr-1" />Tutorial</Button>
              <Button variant="ghost" size="sm"><FileText className="h-4 w-4 mr-1" />Daily Report</Button>
              <Button variant="ghost" size="sm"><Upload className="h-4 w-4 mr-1" />Import</Button>
              <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
              <Button variant="ghost" size="sm"><SettingsIcon className="h-4 w-4 mr-1" />Alert Setting</Button>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
                {cartItemCount > 0 && (
                  <Badge className="ml-1 rounded-full px-1.5 py-0 text-xs">{cartItemCount}</Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar Filters */}
        <aside className="w-64 border-r bg-muted/30 p-4 space-y-4 overflow-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="out-of-stock" checked={includeOutOfStock} onCheckedChange={(c) => setIncludeOutOfStock(!!c)} />
              <Label htmlFor="out-of-stock" className="text-sm cursor-pointer">Include Out of Stock</Label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <div className="space-y-1.5">
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <Checkbox id={`cat-${cat.id}`} checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
                  <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">{cat.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Warehouse</h3>
            <div className="space-y-1.5 max-h-48 overflow-auto">
              {warehouseOptions.slice(0, 15).map((w) => (
                <div key={w} className="flex items-center gap-2">
                  <Checkbox id={`wh-${w}`} checked={selectedWarehouses.includes(w)} onCheckedChange={() => toggleWarehouse(w)} />
                  <Label htmlFor={`wh-${w}`} className="text-sm cursor-pointer">{w}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Lock Status</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Checkbox id="lock-locked" checked={selectedLockStatuses.includes("locked")} onCheckedChange={() => toggleLockStatus("locked")} />
                <Label htmlFor="lock-locked" className="text-sm cursor-pointer">LOCKED</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="lock-unlocked" checked={selectedLockStatuses.includes("unlocked")} onCheckedChange={() => toggleLockStatus("unlocked")} />
                <Label htmlFor="lock-unlocked" className="text-sm cursor-pointer">UNLOCKED</Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Grade Levels</h3>
            <div className="space-y-1.5">
              {gradeOptions.map((g) => (
                <div key={g} className="flex items-center gap-2">
                  <Checkbox id={`grade-${g}`} checked={selectedGrades.includes(g)} onCheckedChange={() => toggleGrade(g)} />
                  <Label htmlFor={`grade-${g}`} className="text-sm cursor-pointer">DLS {g}</Label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-4 overflow-auto">
          {pagedKeys.map((groupKey) => {
            const groupVariants = groups[groupKey];
            const itemsCount = groupVariants.length;
            const totalQty = groupVariants.reduce((sum, v) => sum + (v.inventory?.quantityAvailable || 0), 0);
            const prices = groupVariants.map((v) => v.unitPrice).filter((p) => typeof p === "number");
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            const hasMultiplePrices = new Set(prices).size > 1;
            const grade = groupVariants[0]?.conditionGrade || "";
            const isExpanded = expandedGroups[groupKey];

            return (
              <Card key={groupKey} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <CardTitle className="text-lg">{groupKey}</CardTitle>
                        <Badge variant="outline">DLS {grade}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {groupVariants.map((v) => v.networkLockStatus).join(", ")} • {groupVariants.map((v) => v.color).filter((c, i, a) => a.indexOf(c) === i).join(", ")}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span><strong>Items:</strong> {itemsCount}</span>
                        <span><strong>Qty:</strong> {totalQty}</span>
                        {minPrice !== null && (
                          <span><strong>Price:</strong> ${minPrice.toFixed(2)}{hasMultiplePrices ? "+" : ""}</span>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => toggleGroup(groupKey)}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {groupVariants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between border-t pt-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{variant.storage} {variant.color} ({variant.networkLockStatus})</p>
                            <p className="text-xs text-muted-foreground">Model: {variant.device.sku}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">Qty: {variant.inventory?.quantityAvailable || 0}</span>
                            {typeof variant.unitPrice === "number" && (
                              <span className="text-sm font-semibold">${variant.unitPrice.toFixed(2)}</span>
                            )}
                            <Button size="sm" variant="default" onClick={() => openProductModal(variant, false)}>BUY</Button>
                            <Button size="sm" variant="outline" onClick={() => openProductModal(variant, true)}>OFFER</Button>
                            <Button size="sm" variant="ghost"><Bell className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}>{p}</Button>
              ))}
              {totalPages > 5 && <span className="text-sm">...</span>}
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalVariant && `${modalVariant.device.brand} / ${modalVariant.device.marketingName} / ${modalVariant.storage} / ${modalVariant.color} / ${modalVariant.networkLockStatus.toUpperCase()} / DLS ${modalVariant.conditionGrade}`}
            </DialogTitle>
          </DialogHeader>
          {modalVariant && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Item #{modalVariant.id}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm"><strong>Avail:</strong> {modalVariant.inventory?.quantityAvailable || 0}</span>
                {typeof modalVariant.unitPrice === "number" && (
                  <span className="text-sm"><strong>Price:</strong> ${modalVariant.unitPrice.toFixed(2)} (USD)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label>Quantity:</Label>
                <Button variant="outline" size="icon" onClick={() => setModalQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <Input type="number" min="1" value={modalQty} onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center" />
                <Button variant="outline" size="icon" onClick={() => setModalQty((q) => q + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              {offerMode && (
                <div className="space-y-2">
                  <Label>Offer Price (USD):</Label>
                  <Input type="number" step="0.01" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Enter offer price" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox id="alert-me" checked={alertEnabled} onCheckedChange={(c) => setAlertEnabled(!!c)} />
                <Label htmlFor="alert-me" className="text-sm cursor-pointer flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  Alert me when more are available
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">Offers are cleared every day starting 11:00 AM Central Time.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductModalOpen(false)}>Cancel</Button>
            {offerMode ? (
              <Button onClick={submitOffer} disabled={!offerPrice}>Submit Offer</Button>
            ) : (
              <Button onClick={addToCart}>Add to Cart</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PublicFooter />
    </div>
  );
}
