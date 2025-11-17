import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertSavedListSchema, type SavedList, type InsertSavedList } from "@shared/schema";

interface SaveToListButtonProps {
  deviceVariantId: string;
  deviceName: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SaveToListButton({ deviceVariantId, deviceName, variant = "outline", size = "sm" }: SaveToListButtonProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createNewOpen, setCreateNewOpen] = useState(false);

  const form = useForm<InsertSavedList>({
    resolver: zodResolver(insertSavedListSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: savedLists } = useQuery<SavedList[]>({
    queryKey: ["/api/saved-lists"],
    enabled: dialogOpen,
  });

  const createListMutation = useMutation({
    mutationFn: async (data: InsertSavedList) => {
      const response = await apiRequest("POST", "/api/saved-lists", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists"] });
      form.reset();
      setCreateNewOpen(false);
      toast({
        title: "List created",
        description: "You can now add items to your new list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      });
    },
  });

  const addToListMutation = useMutation({
    mutationFn: async (listId: string) => {
      const response = await apiRequest("POST", `/api/saved-lists/${listId}/items`, {
        deviceVariantId,
        defaultQuantity: 1,
      });
      return response.json();
    },
    onSuccess: (_data, listId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists", listId] });
      toast({
        title: "Added to list",
        description: `${deviceName} has been saved to your list`,
      });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      const isDuplicate = error.message.includes("already exists");
      toast({
        title: isDuplicate ? "Already in list" : "Error",
        description: isDuplicate ? "This item is already in the selected list" : "Failed to add to list",
        variant: isDuplicate ? "default" : "destructive",
      });
    },
  });

  const handleAddToList = (listId: string) => {
    addToListMutation.mutate(listId);
  };

  const onSubmitCreateList = (data: InsertSavedList) => {
    createListMutation.mutate(data);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        data-testid="button-save-to-list"
      >
        <Heart className="h-4 w-4 mr-2" />
        Save to List
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to List</DialogTitle>
            <DialogDescription>
              Choose a list to save {deviceName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {savedLists && savedLists.length > 0 ? (
              <div className="space-y-2">
                <Label>Select a list</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedLists.map((list) => (
                    <Button
                      key={list.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddToList(list.id)}
                      disabled={addToListMutation.isPending}
                      data-testid={`button-select-list-${list.id}`}
                    >
                      {list.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No saved lists yet</p>
                <p className="text-sm mt-1">Create your first list below</p>
              </div>
            )}

            <div className="border-t pt-3">
              {createNewOpen ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitCreateList)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New List Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Monthly Restock"
                              data-testid="input-new-list-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCreateNewOpen(false);
                          form.reset();
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createListMutation.isPending}
                        className="flex-1"
                        data-testid="button-create-new-list"
                      >
                        {createListMutation.isPending ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setCreateNewOpen(true)}
                  data-testid="button-show-create-new"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New List
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
