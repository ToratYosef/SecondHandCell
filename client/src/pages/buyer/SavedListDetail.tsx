import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import type { SavedList, SavedListItem } from "@shared/schema";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

interface SavedListWithItems extends SavedList {
  items: Array<SavedListItem & {
    deviceVariant?: {
      id: string;
      storage: string;
      color: string;
      conditionGrade: string;
      deviceModel?: {
        brand: string;
        name: string;
        marketingName?: string;
      };
    };
  }>;
}

export default function SavedListDetail({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: list, isLoading } = useQuery<SavedListWithItems>({
    queryKey: ["/api/saved-lists", params.id],
  });

  const deleteListMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/saved-lists/${params.id}`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the lists query to ensure cache is fresh
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists"] });
      toast({
        title: "List deleted",
        description: "Saved list has been deleted successfully",
      });
      setLocation("/buyer/saved-lists");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete saved list",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("DELETE", `/api/saved-lists/${params.id}/items/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists", params.id] });
      toast({
        title: "Item removed",
        description: "Item has been removed from the list",
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

  const addAllToCartMutation = useMutation({
    mutationFn: async () => {
      if (!list?.items) return;
      
      const promises = list.items.map(async (item) => {
        const response = await apiRequest("POST", "/api/cart/items", {
          deviceVariantId: item.deviceVariantId,
          quantity: item.defaultQuantity,
        });
        return response.json();
      });

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `Added ${list?.items.length} items to your cart`,
      });
      setLocation("/buyer/cart");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add items to cart",
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
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setLocation("/buyer/saved-lists")} data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lists
                </Button>
              </div>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading list...</p>
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setLocation("/buyer/saved-lists")} data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lists
                </Button>
              </div>
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">List not found</p>
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
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setLocation("/buyer/saved-lists")} data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lists
                </Button>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">{list.name}</h1>
                  <p className="text-muted-foreground mt-1">
                    {list.items.length} {list.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm(`Delete "${list.name}"?`)) {
                      deleteListMutation.mutate();
                    }
                  }}
                  disabled={deleteListMutation.isPending}
                  data-testid="button-delete-list"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete List
                </Button>
                {list.items.length > 0 && (
                  <Button
                    onClick={() => addAllToCartMutation.mutate()}
                    disabled={addAllToCartMutation.isPending}
                    data-testid="button-add-all-to-cart"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {addAllToCartMutation.isPending ? "Adding..." : "Add All to Cart"}
                  </Button>
                )}
              </div>
            </div>

            {list.items.length > 0 ? (
        <div className="space-y-3">
          {list.items.map((item) => {
            const variant = item.deviceVariant;
            const model = variant?.deviceModel;
            const displayName = model?.marketingName || (model ? `${model.brand} ${model.name}` : "Unknown Device");

            return (
              <Card key={item.id} data-testid={`card-item-${item.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{displayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {variant?.storage} | {variant?.color} | Grade {variant?.conditionGrade}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Default Quantity: {item.defaultQuantity}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItemMutation.mutate(item.id)}
                      disabled={removeItemMutation.isPending}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No items in this list</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add devices from the catalog to save them here
            </p>
          </CardContent>
            </Card>
          )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
