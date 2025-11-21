import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, AlertTriangle, Upload, Pencil, Trash2, Plus, Minus, SlidersHorizontal, RefreshCw } from "lucide-react";
import { ConditionBadge } from "@/components/ConditionBadge";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importPayload, setImportPayload] = useState(`[
  {
    "brand": "Apple",
    "name": "iPhone 13",
    "marketingName": "iPhone 13",
    "sku": "IPH13-BASE",
    "variants": [{ "storage": "128GB", "color": "Black", "conditionGrade": "A", "networkLockStatus": "unlocked", "unitPrice": 499.99, "quantity": 10 }]
  }
]`);
  const [form, setForm] = useState({
    brand: "",
    name: "",
    marketingName: "",
    imageUrl: "",
    sku: "",
    categorySlug: "",
    storage: "64GB",
    color: "Black",
    conditionGrade: "A",
    networkLockStatus: "unlocked",
    unitPrice: "0",
    quantity: "0",
    minOrderQuantity: "1",
  });
  const [filters, setFilters] = useState({
    brand: "",
    color: "",
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
        marketingName: form.marketingName || form.name,
        imageUrl: form.imageUrl || undefined,
        sku: form.sku,
        categorySlug: form.categorySlug || undefined,
        variant: {
          storage: form.storage,
          color: form.color,
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

  const importDevicesMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await apiRequest("POST", "/api/admin/device-import", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/catalog"] });
      toast({ title: "Import completed", description: "Devices were imported successfully" });
      setImportDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Import failed",
        description: error.message || "Unable to import devices",
        variant: "destructive",
      });
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      return await apiRequest("PATCH", `/api/admin/device-variants/${id}", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/catalog"] });
      toast({ title: "Variant updated", description: "Inventory details saved" });
      setEditDialogOpen(false);
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

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importPayload);
      const payload = Array.isArray(parsed) ? { devices: parsed } : parsed;
      importDevicesMutation.mutate(payload);
    } catch (error: any) {
      toast({
        title: "Invalid import payload",
        description: "Please provide valid JSON for devices",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (variant: any) => {
    setEditingVariant(variant);
    setEditForm({
      storage: variant.storage,
      color: variant.color,
      conditionGrade: variant.conditionGrade,
      networkLockStatus: variant.networkLockStatus,
      unitPrice: String(variant.unitPrice || "0"),
      quantity: String(variant.inventory?.quantityAvailable ?? "0"),
      minOrderQuantity: String(variant.inventory?.minOrderQuantity ?? "1"),
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
        color: editForm.color,
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
    if (confirm(`Delete ${variant.device.marketingName} (${variant.storage} ${variant.color})?`)) {
      deleteVariantMutation.mutate(variant.id);
    }
  };

  const allVariants = devices?.flatMap((device: any) =>
    device.variants?.map((variant: any) => ({
      ...variant,
      device: {
        brand: device.brand,
        marketingName: device.marketingName,
        sku: device.sku,
      },
      unitPrice: variant.priceTiers?.[0]?.unitPrice,
    }))
  ) || [];

  const brandOptions = Array.from(new Set(devices?.map((d: any) => d.brand) || [])).filter(Boolean);
  const colorOptions = Array.from(new Set(allVariants.map((v: any) => v.color) || [])).filter(Boolean);
  const conditionOptions = Array.from(new Set(allVariants.map((v: any) => v.conditionGrade) || [])).filter(Boolean);

  const filteredVariants = allVariants.filter((variant: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      variant.device.marketingName.toLowerCase().includes(searchLower) ||
      variant.device.brand.toLowerCase().includes(searchLower) ||
      variant.device.sku.toLowerCase().includes(searchLower) ||
      variant.storage.toLowerCase().includes(searchLower) ||
      variant.color.toLowerCase().includes(searchLower);

    const matchesBrand = !filters.brand || variant.device.brand === filters.brand;
    const matchesColor = !filters.color || variant.color === filters.color;
    const matchesCondition = !filters.condition || variant.conditionGrade === filters.condition;
    const quantity = variant.inventory?.quantityAvailable ?? 0;
    const matchesStock =
      filters.stock === "all" ||
      (filters.stock === "low" && quantity > 0 && quantity < 20) ||
      (filters.stock === "out" && quantity === 0) ||
      (filters.stock === "in" && quantity >= 20);

    return matchesSearch && matchesBrand && matchesColor && matchesCondition && matchesStock;
  });

  const lowStockVariants = allVariants.filter((v: any) => 
    v.inventory && v.inventory.quantityAvailable < 20
  );

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
          <h1 className="text-3xl font-semibold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            {allVariants.length} total variants • {lowStockVariants.length} low stock
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
                  <SelectItem value="">All Brands</SelectItem>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.color} onValueChange={(value) => setFilters({ ...filters, color: value })}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Colors</SelectItem>
                  {colorOptions.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
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
                onClick={() => setFilters({ brand: "", color: "", condition: "", stock: "all" })}
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
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline">{variant.device.brand}</Badge>
                      <h3 className="font-semibold">{variant.device.marketingName}</h3>
                      <Badge variant="secondary">{variant.storage}</Badge>
                      <Badge variant="secondary">{variant.color}</Badge>
                      <ConditionBadge grade={variant.conditionGrade} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>SKU: {variant.device.sku}</span>
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
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleVariantSave}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Storage</Label>
                <Input value={editForm.storage} onChange={(e) => setEditForm({ ...editForm, storage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} />
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
                <Label>Marketing Name</Label>
                <Input value={form.marketingName} onChange={(e) => setForm({ ...form, marketingName: e.target.value })} />
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
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
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
                <Label>Color</Label>
                <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Devices</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Paste JSON payload</Label>
            <Textarea
              value={importPayload}
              onChange={(e) => setImportPayload(e.target.value)}
              className="min-h-[180px]"
            />
            <p className="text-xs text-muted-foreground">
              Provide an array of devices or an object with a <code>devices</code> array.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportSubmit} disabled={importDevicesMutation.isPending}>
              {importDevicesMutation.isPending ? "Importing..." : "Start Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
