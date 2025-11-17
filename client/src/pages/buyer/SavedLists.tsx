import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { format } from "date-fns";
import { Heart, Plus, Trash2, FolderOpen } from "lucide-react";
import type { SavedList } from "@shared/schema";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function SavedLists() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [listName, setListName] = useState("");

  const { data: savedLists, isLoading } = useQuery<SavedList[]>({
    queryKey: ["/api/saved-lists"],
  });

  const createListMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/saved-lists", { name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists"] });
      toast({
        title: "List created",
        description: "Saved list has been created successfully",
      });
      setCreateDialogOpen(false);
      setListName("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create saved list",
        variant: "destructive",
      });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/saved-lists/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists"] });
      toast({
        title: "List deleted",
        description: "Saved list has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete saved list",
        variant: "destructive",
      });
    },
  });

  const handleCreateList = () => {
    if (!listName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }
    createListMutation.mutate(listName);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Saved Lists</h1>
                <p className="text-muted-foreground mt-1">Organize devices for quick ordering</p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-list">
                <Plus className="h-4 w-4 mr-2" />
                Create New List
              </Button>
            </div>

            {isLoading ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse" />
          <p className="text-muted-foreground">Loading saved lists...</p>
        </div>
      ) : savedLists && savedLists.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedLists.map((list) => (
            <Card key={list.id} data-testid={`card-list-${list.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                    <CardDescription>
                      Created {format(new Date(list.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Delete "${list.name}"?`)) {
                        deleteListMutation.mutate(list.id);
                      }
                    }}
                    disabled={deleteListMutation.isPending}
                    data-testid={`button-delete-${list.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/buyer/saved-lists/${list.id}`}>
                  <Button variant="outline" className="w-full" data-testid={`button-view-${list.id}`}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    View List
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No saved lists yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a list to save devices for quick ordering
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Saved List</DialogTitle>
            <DialogDescription>
              Give your new list a descriptive name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="listName">List Name</Label>
              <Input
                id="listName"
                placeholder="e.g., Monthly Restock, iPhone Batch #1"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateList();
                  }
                }}
                data-testid="input-list-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateList}
              disabled={createListMutation.isPending}
              data-testid="button-save-list"
            >
              {createListMutation.isPending ? "Creating..." : "Create List"}
            </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
