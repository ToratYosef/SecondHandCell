import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import type { SavedList, SavedListItem } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";

interface SavedListWithItems extends SavedList {
  items: Array<
    SavedListItem & {
      deviceVariant?: {
        id: string;
        storage: string;
        color: string;
        conditionGrade: string;
        deviceModel?: {
          brand: string;
          name: string;
        };
      };
    }
  >;
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
        description: "Item has been removed from the saved list",
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

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: "Items have been added to your cart",
    });
  };

  const handleDeleteList = () => {
    deleteListMutation.mutate();
  };

  const headerActions = (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setLocation("/buyer/saved-lists")}> 
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button variant="outline" onClick={handleAddToCart} data-testid="button-add-to-cart">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add All to Cart
      </Button>
      <Button variant="destructive" onClick={handleDeleteList} data-testid="button-delete-list">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete List
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <BuyerLayout>
        <PageShell
          title="Saved list"
          description="Review and reorder your saved devices"
          className="mx-auto max-w-6xl"
          actions={headerActions}
        >
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        </PageShell>
      </BuyerLayout>
    );
  }

  if (!list) {
    return null;
  }

  return (
    <BuyerLayout>
      <PageShell
        title={list.name}
        description="Review and reorder your saved devices"
        className="mx-auto max-w-6xl"
        actions={headerActions}
      >
        <Card>
          <CardHeader>
            <CardTitle>{list.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {list.items && list.items.length > 0 ? (
              list.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{item.deviceVariant?.deviceModel?.name || "Device"}</p>
                    <p className="text-sm text-muted-foreground">
                      Storage: {item.deviceVariant?.storage || "N/A"} • Grade: {item.deviceVariant?.conditionGrade || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No items in this saved list.</p>
            )}
          </CardContent>
        </Card>

        <Dialog open={deleteListMutation.isPending}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Saved List</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this saved list? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PageShell>
    </BuyerLayout>
  );
}
