import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, AlertTriangle, Upload, Pencil, Trash2, Plus, Minus, SlidersHorizontal, RefreshCw, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { ConditionBadge } from "@/components/ConditionBadge";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

type VariantPayload = {
  storage?: string;
  networkLockStatus?: string;
  conditionGrade?: string;
  unitPrice?: number;
  quantity?: number;
};

type DevicePayload = {
  brand?: string;
  name?: string;
  device?: string;
  model?: string;
  slug?: string;
  imageUrl?: string;
  category?: string;
  variants?: VariantPayload[];
};

type ImportPreview = {
  brand: string;
  model: string;
  storage?: string;
  networkLockStatus?: string;
  condition?: string;
  price?: number;
  quantity?: number;
  category?: string;
  imageUrl?: string;
  slug?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseDeviceJson(raw: string): ImportPreview[] {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (error: any) {
    throw new Error("JSON could not be parsed. Check the payload.");
  }

  const entries: DevicePayload[] = Array.isArray(parsed)
    ? parsed
    : parsed?.devices || parsed?.items || [];

  if (!Array.isArray(entries)) {
    throw new Error("Expected an array or { devices: [] } payload.");
  }

  const previews: ImportPreview[] = [];

  entries.forEach((device) => {
    const baseBrand = device.brand || device.deviceBrand || device.make || "";
    const baseModel = device.name || device.model || device.device || "";
    const slug = device.slug || (baseModel ? slugify(baseModel) : undefined);
    const baseImage = device.imageUrl || (device as any).image || undefined;
    const variants = device.variants && Array.isArray(device.variants) ? device.variants : [];

    if (!baseBrand || !baseModel || variants.length === 0) return;

    variants.forEach((variant) => {
      previews.push({
        brand: baseBrand,
        model: baseModel,
        storage: variant.storage,
        networkLockStatus: variant.networkLockStatus,
        condition: variant.conditionGrade,
        price: typeof variant.unitPrice === "number" ? variant.unitPrice : Number(variant.unitPrice ?? 0),
        quantity: typeof variant.quantity === "number" ? variant.quantity : Number(variant.quantity ?? 0),
        category: device.category,
        imageUrl: baseImage,
        slug,
      });
    });
  });

  if (previews.length === 0) {
    throw new Error("No devices found. Include brand, name, and variants for each device.");
  }

  return previews;
}

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const { isAdmin, profile } = useFirebaseUser();
  const [editForm, setEditForm] = useState({
    storage: "",
    conditionGrade: "",
    networkLockStatus: "",
    unitPrice: "0",
    quantity: "0",
    minOrderQuantity: "1",
  });
  const [importJson, setImportJson] = useState(`[
  {
    "brand": "Iphone",
    "name": "IPHONE 12 PRO",
    "imageUrl": "https://raw.githubusercontent.com/ToratYosef/BuyBacking/main/iphone/assets/i12p",
    "category": "Smartphones",
    "variants": [
      { "storage": "128GB", "networkLockStatus": "Unlocked", "conditionGrade": "A", "unitPrice": 1000, "quantity": 100 }
    ]
  }
]`);
  const [parsedImports, setParsedImports] = useState<ImportPreview[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [form, setForm] = useState({
    brand: "",
    name: "",
    imageUrl: "",
    categorySlug: "",
    storage: "64GB",
    conditionGrade: "A",
    networkLockStatus: "unlocked",
    unitPrice: "0",
    quantity: "0",
    minOrderQuantity: "1",
  });
  const [filters, setFilters] = useState({
    brand: "",
    condition: "",
    stock: "all",
  });

  const { toast } = useToast();

  const { data: devices, isLoading } = useQuery<any[]>({
    queryKey: ["/api/catalog"],
  });

  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const addDeviceMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/device-models", {
        brand: form.brand,
        name: form.name,
        imageUrl: form.imageUrl || undefined,
        categorySlug: form.categorySlug || undefined,
        variant: {
          storage: form.storage,
          conditionGrade: form.conditionGrade,
          networkLockStatus: form.networkLockStatus,
          unitPrice: parseFloat(form.unitPrice || "0"),
          quantity: parseInt(form.quantity || "0", 10),
          minOrderQuantity: parseInt(form.minOrderQuantity || "1", 10),
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/catalog"] });
      toast({ title: "Device added", description: "New device is now available in inventory" });
      setAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add device",
        description: error.message || "Unable to save device",
        variant: "destructive",
      });
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      return await apiRequest("PATCH", `/api/admin/device-variants/${id}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/catalog"] });
      toast({ title: "Variant updated", description: "Inventory details saved" });
      setAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Unable to update variant",
        variant: "destructive",
      });
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/device-variants/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/catalog"] });
      toast({ title: "Variant removed", description: "The item has been deleted" });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Unable to delete variant",
        variant: "destructive",
      });
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDeviceMutation.mutate();
  };

  const handleConvertImport = () => {
    try {
      const parsed = parseDeviceJson(importJson);
      const sorted = [...parsed].sort((a, b) => {
        const brandCompare = a.brand.localeCompare(b.brand);
        if (brandCompare !== 0) return brandCompare;

        const modelCompare = a.model.localeCompare(b.model);
        if (modelCompare !== 0) return modelCompare;

        const storageCompare = (a.storage || "").localeCompare(b.storage || "");
        if (storageCompare !== 0) return storageCompare;

        const lockCompare = (a.networkLockStatus || "").localeCompare(b.networkLockStatus || "");
        if (lockCompare !== 0) return lockCompare;

        return (a.condition || "").localeCompare(b.condition || "");
      });

      setParsedImports(sorted);
      setImportError(null);
      toast({
        title: "Payload converted",
        description: `Ready to import ${sorted.length} variant${sorted.length === 1 ? "" : "s"}.`,
      });
    } catch (error: any) {
      setParsedImports([]);
      setImportError(error.message || "Unable to parse JSON");
      toast({
        title: "Invalid JSON",
        description: error.message || "Follow the devices.json format and try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmImport = async () => {
    if (!isAdmin) {
      toast({ title: "Admin required", description: "Sign in as an admin to import devices." });
      return;
    }

    if (parsedImports.length === 0) {
      toast({ title: "Nothing to import", description: "Convert JSON to preview devices first." });
      return;
    }

    try {
      setIsImporting(true);
      const batch = writeBatch(db);

      parsedImports.forEach((item) => {
        const ref = doc(collection(db, "catalog"));
        batch.set(ref, {
          brand: item.brand,
          model: item.model,
          slug: item.slug,
          storage: item.storage,
          condition: item.condition,
          networkLockStatus: item.networkLockStatus,
          price: item.price ?? 0,
          quantity: item.quantity ?? 0,
          category: item.category,
          imageUrl: item.imageUrl,
          status: "live",
          updatedAt: serverTimestamp(),
          createdBy: profile?.email ?? "",
        });
      });

      await batch.commit();
      toast({ title: "Import complete", description: `${parsedImports.length} variant(s) saved to Firestore.` });
      setParsedImports([]);
      setImportJson("");
      setImportDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "Could not save devices to Firestore.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const openEditDialog = (variant: any) => {
    setEditingVariant(variant);
    setEditForm({
      storage: variant.storage || "",
      conditionGrade: variant.conditionGrade || "",
      networkLockStatus: variant.networkLockStatus || "",
      unitPrice: typeof variant.unitPrice === "number" ? variant.unitPrice.toString() : "0",
      quantity: variant.inventory?.quantityAvailable?.toString() || "0",
      minOrderQuantity: variant.inventory?.minOrderQuantity?.toString() || "1",
    });
    setEditDialogOpen(true);
  };

  const handleVariantSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;
    updateVariantMutation.mutate({
      id: editingVariant.id,
      payload: {
        storage: editForm.storage,
        conditionGrade: editForm.conditionGrade,
        networkLockStatus: editForm.networkLockStatus,
        unitPrice: parseFloat(editForm.unitPrice || "0"),
        quantity: parseInt(editForm.quantity || "0", 10),
        minOrderQuantity: parseInt(editForm.minOrderQuantity || "1", 10),
      },
    });
  };

  const adjustQuantity = (variant: any, delta: number) => {
    const current = variant.inventory?.quantityAvailable ?? 0;
    const next = Math.max(0, current + delta);
    updateVariantMutation.mutate({
      id: variant.id,
      payload: { quantity: next },
    });
  };

  const handleDelete = (variant: any) => {
    setDeletingVariant(variant);
    setDeleteVariantDialogOpen(true);
  };

  const allVariants = devices?.flatMap((device: any) =>
    device.variants?.map((variant: any) => ({
      ...variant,
      device: {
        brand: device.brand,
        name: device.name,
      },
      unitPrice: variant.priceTiers?.[0]?.unitPrice,
    }))
  ) || [];

  const brandOptions = Array.from(new Set(devices?.map((d: any) => d.brand) || [])).filter(Boolean);
  const conditionOptions = Array.from(new Set(allVariants.map((v: any) => v.conditionGrade) || [])).filter(Boolean);

  const filteredVariants = allVariants.filter((variant: any) => {
    const searchLower = searchTerm.toLowerCase();
    const nameLower = (variant.device.name || "").toLowerCase();
    const matchesSearch =
      nameLower.includes(searchLower) ||
      (variant.device.brand || "").toLowerCase().includes(searchLower) ||
      (variant.storage || "").toLowerCase().includes(searchLower);

    const matchesBrand = filters.brand === "all" || !filters.brand || variant.device.brand === filters.brand;
    const matchesCondition = filters.condition === "all" || !filters.condition || variant.conditionGrade === filters.condition;
    const quantity = variant.inventory?.quantityAvailable ?? 0;
    const matchesStock =
      filters.stock === "all" ||
      (filters.stock === "low" && quantity > 0 && quantity < 20) ||
      (filters.stock === "out" && quantity === 0) ||
      (filters.stock === "in" && quantity >= 20);

    return matchesSearch && matchesBrand && matchesCondition && matchesStock;
  });

  const lowStockVariants = allVariants.filter((v: any) => 
    v.inventory && v.inventory.quantityAvailable < 20
  );

  // Stock List UI state
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Modal state for Buy / Offer
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<any | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [offerMode, setOfferMode] = useState(false);
  const [offerPrice, setOfferPrice] = useState<string>("");

  // Update lastUpdated when devices change
  useEffect(() => {
    if (devices) setLastUpdated(new Date());
  }, [devices]);

  const toggleGroup = (key: string) => setExpandedGroups((s) => ({ ...s, [key]: !s[key] }));

  // Group variants by device title (brand + name + storage)
  const groups = allVariants.reduce((acc: any, v: any) => {
    const displayName = v.device.name || v.device.modelName || "";
    const title = `${v.device.brand} ${displayName} ${v.storage}`.trim();
    if (!acc[title]) acc[title] = [];
    acc[title].push(v);
    return acc;
  }, {} as Record<string, any[]>);

  const groupKeys = Object.keys(groups).sort();
  const totalResults = groupKeys.length;
  const pagedKeys = groupKeys.slice((page - 1) * pageSize, page * pageSize);

  const openProductModal = (variant: any) => {
    setModalVariant(variant);
    setModalQty(1);
    setOfferMode(false);
    setOfferPrice("");
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
    // Placeholder: offers are client-side only for now
    toast({ title: "Offer submitted", description: `Offer for ${offerPrice} submitted` });
    setProductModalOpen(false);
  };

  const [deleteVariantDialogOpen, setDeleteVariantDialogOpen] = useState(false);
  const [deletingVariant, setDeletingVariant] = useState<any | null>(null);

  const performDeleteVariant = () => {
    if (!deletingVariant) return;
    deleteVariantMutation.mutate(deletingVariant.id);
    setDeleteVariantDialogOpen(false);
    setDeletingVariant(null);
  };

  const exportInventory = async () => {
    try {
      // reuse the admin export endpoint
      const res = await apiFetch('/api/admin/export/inventory.csv?pageSize=500');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to export inventory', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Inventory Management</h1>
        <div className="h-96 bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Inventory Management</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            <span className="font-semibold text-foreground">{allVariants.length}</span> total variants • 
            <span className="font-semibold text-yellow-600">{lowStockVariants.length}</span> low stock alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)} data-testid="button-import">
            <Upload className="mr-2 h-4 w-4" />
            Import Devices
          </Button>
          <Button onClick={() => setAddDialogOpen(true)} data-testid="button-add-inventory">
            <Package className="mr-2 h-4 w-4" />
            Add Device
          </Button>
          <Button onClick={exportInventory} data-testid="button-export-inventory" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Inventory CSV
          </Button>
        </div>
      </div>

      {lowStockVariants.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {lowStockVariants.length} variant{lowStockVariants.length !== 1 ? 's' : ''} running low on stock
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-inventory"
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </div>
              <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditionOptions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      Grade {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.stock} onValueChange={(value) => setFilters({ ...filters, stock: value })}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in">Healthy (20+)</SelectItem>
                  <SelectItem value="low">Low Stock (&lt;20)</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ brand: "", condition: "", stock: "all" })}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredVariants.map((variant: any) => (
              <div
                key={variant.id}
                className="flex flex-col gap-3 p-4 border rounded-md"
                data-testid={`inventory-item-${variant.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    {(() => {
                      const displayName = variant.device?.name || variant.device?.modelName;
                      return (
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">{variant.device.brand}</Badge>
                          <h3 className="font-semibold">{displayName}</h3>
                          <Badge variant="secondary">{variant.storage}</Badge>
                          <ConditionBadge grade={variant.conditionGrade} />
                        </div>
                      );
                    })()}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Network: {variant.networkLockStatus}</span>
                      <span>Min order: {variant.inventory?.minOrderQuantity ?? 1}</span>
                      {typeof variant.unitPrice === "number" && (
                        <span className="text-foreground font-semibold">${variant.unitPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {variant.inventory && (
                    <div className="text-right min-w-[150px]">
                      <p className="text-2xl font-bold">
                        {variant.inventory.quantityAvailable}
                      </p>
                      <p className="text-sm text-muted-foreground">units available</p>
                      {variant.inventory.quantityAvailable < 20 && (
                        <Badge variant="destructive" className="mt-1">Low Stock</Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(variant, -1)}
                      disabled={updateVariantMutation.isPending}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustQuantity(variant, 1)}
                      disabled={updateVariantMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditDialog(variant)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(variant)}
                      disabled={deleteVariantMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
            <DialogDescription>
              Update the details and pricing for this device variant.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleVariantSave}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Storage</Label>
                <Input value={editForm.storage} onChange={(e) => setEditForm({ ...editForm, storage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={editForm.conditionGrade}
                  onValueChange={(value) => setEditForm({ ...editForm, conditionGrade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A</SelectItem>
                    <SelectItem value="B">Grade B</SelectItem>
                    <SelectItem value="C">Grade C</SelectItem>
                    <SelectItem value="D">Grade D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Select
                  value={editForm.networkLockStatus}
                  onValueChange={(value) => setEditForm({ ...editForm, networkLockStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlocked">Unlocked</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.unitPrice}
                  onChange={(e) => setEditForm({ ...editForm, unitPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity Available</Label>
                <Input
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Order Qty</Label>
                <Input
                  type="number"
                  value={editForm.minOrderQuantity}
                  onChange={(e) => setEditForm({ ...editForm, minOrderQuantity: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateVariantMutation.isPending}>
                {updateVariantMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add a Device</DialogTitle>
            <DialogDescription>
              Create a new device model and add it to your inventory.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Model Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/device.jpg"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.categorySlug}
                  onValueChange={(value) => setForm({ ...form, categorySlug: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={form.conditionGrade}
                  onValueChange={(value) => setForm({ ...form, conditionGrade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A</SelectItem>
                    <SelectItem value="B">Grade B</SelectItem>
                    <SelectItem value="C">Grade C</SelectItem>
                    <SelectItem value="D">Grade D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Select
                  value={form.networkLockStatus}
                  onValueChange={(value) => setForm({ ...form, networkLockStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlocked">Unlocked</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Storage</Label>
                <Input value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Unit Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity Available</Label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Order Qty</Label>
                <Input
                  type="number"
                  value={form.minOrderQuantity}
                  onChange={(e) => setForm({ ...form, minOrderQuantity: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addDeviceMutation.isPending}>
                {addDeviceMutation.isPending ? "Saving..." : "Save Device"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-[95vw] sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Import devices from JSON</DialogTitle>
            <DialogDescription>
              Paste the <code>devices.json</code> payload, preview the variants, then publish to Firestore.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[70vh]">
            <div className="space-y-2">
              <Label>Paste JSON payload</Label>
              <Textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="min-h-[240px] font-mono"
                placeholder='[{ "brand": "Iphone", "name": "IPHONE 12 PRO", "variants": [...] }]'
              />
              <p className="text-xs text-muted-foreground">
                Format matches <code>devices.json</code>: brand, name, imageUrl, category, and a <code>variants</code> array with storage, networkLockStatus, conditionGrade, unitPrice, and quantity.
              </p>
              {importError && <p className="text-sm text-destructive">{importError}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleConvertImport}>
                Convert JSON to devices
              </Button>
              <Button variant="outline" onClick={() => setParsedImports([])}>
                Clear preview
              </Button>
            </div>

            {parsedImports.length > 0 && (
              <div className="flex flex-col gap-3 overflow-hidden rounded-lg border bg-muted/40">
                <div className="flex flex-col gap-2 border-b bg-background/70 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-medium">
                    Ready to import {parsedImports.length} variant{parsedImports.length === 1 ? "" : "s"}.
                  </div>
                  <div className="text-muted-foreground">Sorted by brand, model, storage, carrier, and grade.</div>
                </div>
                <div className="max-h-[45vh] overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-muted/60 text-left backdrop-blur">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Brand</th>
                        <th className="px-3 py-2 font-semibold">Model</th>
                        <th className="px-3 py-2 font-semibold">Category</th>
                        <th className="px-3 py-2 font-semibold">Storage</th>
                        <th className="px-3 py-2 font-semibold">Carrier</th>
                        <th className="px-3 py-2 font-semibold">Grade</th>
                        <th className="px-3 py-2 font-semibold">Price</th>
                        <th className="px-3 py-2 font-semibold">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedImports.map((device, idx) => (
                        <tr key={`${device.brand}-${device.model}-${idx}`} className="border-t">
                          <td className="px-3 py-2 font-medium">{device.brand}</td>
                          <td className="px-3 py-2 uppercase">{device.model}</td>
                          <td className="px-3 py-2">{device.category || "—"}</td>
                          <td className="px-3 py-2">{device.storage || "—"}</td>
                          <td className="px-3 py-2">{device.networkLockStatus || "—"}</td>
                          <td className="px-3 py-2">{device.condition || "—"}</td>
                          <td className="px-3 py-2">{typeof device.price === "number" ? `$${device.price.toFixed(2)}` : "—"}</td>
                          <td className="px-3 py-2">{device.quantity ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-2 border-t bg-background/80 p-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                  <div className="text-sm text-muted-foreground sm:mr-auto">
                    Preview is scrollable to keep actions visible while reviewing large imports.
                  </div>
                  <Button variant="outline" onClick={() => setParsedImports([])}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmImport} disabled={isImporting || !isAdmin}>
                    {isImporting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />} Confirm and import
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteVariantDialogOpen} onOpenChange={setDeleteVariantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Variant</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the variant from inventory.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>
              Are you sure you want to delete
              {" "}
              {deletingVariant
                ? `${deletingVariant.device.name || "this device"} (${deletingVariant.storage})`
                : "this variant"}
              ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteVariantDialogOpen(false)}>Cancel</Button>
            <Button onClick={performDeleteVariant} disabled={deleteVariantMutation.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

