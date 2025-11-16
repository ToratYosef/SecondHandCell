import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, AlertTriangle } from "lucide-react";
import { ConditionBadge } from "@/components/ConditionBadge";
import { useState } from "react";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: devices, isLoading } = useQuery({
    queryKey: ["/api/catalog"],
  });

  const allVariants = devices?.flatMap((device: any) => 
    device.variants?.map((variant: any) => ({
      ...variant,
      device: {
        brand: device.brand,
        marketingName: device.marketingName,
        sku: device.sku,
      },
    }))
  ) || [];

  const filteredVariants = allVariants.filter((variant: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      variant.device.marketingName.toLowerCase().includes(searchLower) ||
      variant.device.brand.toLowerCase().includes(searchLower) ||
      variant.device.sku.toLowerCase().includes(searchLower) ||
      variant.storage.toLowerCase().includes(searchLower) ||
      variant.color.toLowerCase().includes(searchLower)
    );
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
        <Button data-testid="button-add-inventory">
          <Package className="mr-2 h-4 w-4" />
          Add Inventory
        </Button>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredVariants.map((variant: any) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-4 border rounded-md"
                data-testid={`inventory-item-${variant.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{variant.device.brand}</Badge>
                    <h3 className="font-semibold">{variant.device.marketingName}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>SKU: {variant.device.sku}</span>
                    <span>•</span>
                    <span>{variant.storage} • {variant.color}</span>
                    <span>•</span>
                    <ConditionBadge grade={variant.conditionGrade} />
                  </div>
                </div>

                {variant.inventory && (
                  <div className="text-right">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
