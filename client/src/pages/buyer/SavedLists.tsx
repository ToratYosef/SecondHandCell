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
import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";

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
    if (!listName.trim()) return;
    createListMutation.mutate(listName.trim());
  };

  const handleDeleteList = (id: string) => {
    deleteListMutation.mutate(id);
  };

  return (
    <BuyerLayout>
      <PageShell
        title="Saved Lists"
        description="Organize and reorder your favorite device mixes"
        className="mx-auto max-w-6xl"
        actions={
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-list">
            <Plus className="mr-2 h-4 w-4" />
            New List
          </Button>
        }
      >
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : savedLists && savedLists.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {savedLists.map((list) => (
              <Card key={list.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-4 w-4 text-primary" />
                      {list.name}
                    </CardTitle>
                    <CardDescription>
                      {list.items?.length || 0} items • Updated {format(new Date(list.updatedAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" data-testid={`button-open-${list.id}`}>
                      <Link href={`/buyer/saved-lists/${list.id}`}>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Open
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteList(list.id)}
                      data-testid={`button-delete-${list.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-semibold">No saved lists yet</h2>
              <p className="mb-6 text-center text-muted-foreground">Create your first saved list to keep devices handy.</p>
              <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first-list">
                <Plus className="mr-2 h-4 w-4" />
                Create Saved List
              </Button>
            </CardContent>
          </Card>
        )}
      </PageShell>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Saved List</DialogTitle>
            <DialogDescription>Give your list a name to group related devices.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="listName">List name</Label>
              <Input
                id="listName"
                placeholder="e.g. Grade A iPhones"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                data-testid="input-list-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={createListMutation.isLoading}>
              {createListMutation.isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BuyerLayout>
  );
}
