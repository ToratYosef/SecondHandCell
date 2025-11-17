import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { FileText, Search, DollarSign, Package } from "lucide-react";
import type { Quote } from "@shared/schema";

interface QuoteWithCompany extends Quote {
  company: {
    id: string;
    name: string;
    contactEmail: string;
  };
}

export default function AdminQuotes() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithCompany | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [subtotal, setSubtotal] = useState("");
  const [shippingEstimate, setShippingEstimate] = useState("");
  const [taxEstimate, setTaxEstimate] = useState("");
  const [totalEstimate, setTotalEstimate] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { data: quotes, isLoading } = useQuery<QuoteWithCompany[]>({
    queryKey: ["/api/admin/quotes"],
  });

  const { data: quoteDetails } = useQuery({
    queryKey: ["/api/quotes", selectedQuote?.id],
    enabled: !!selectedQuote?.id && editDialogOpen,
  });

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Parse values
    const sub = parseFloat(subtotal || "0");
    const ship = parseFloat(shippingEstimate || "0");
    const tax = parseFloat(taxEstimate || "0");
    const total = parseFloat(totalEstimate || "0");
    
    // Check for invalid numbers
    if (isNaN(sub)) errors.push("Subtotal must be a valid number");
    if (isNaN(ship)) errors.push("Shipping must be a valid number");
    if (isNaN(tax)) errors.push("Tax must be a valid number");
    if (isNaN(total)) errors.push("Total must be a valid number");
    
    // Check for negative numbers
    if (sub < 0) errors.push("Subtotal cannot be negative");
    if (ship < 0) errors.push("Shipping cannot be negative");
    if (tax < 0) errors.push("Tax cannot be negative");
    if (total < 0) errors.push("Total cannot be negative");
    
    // If sending quote, ensure total > 0 and math adds up
    if (newStatus === "sent") {
      if (total <= 0) {
        errors.push("Cannot send quote with zero or negative total");
      }
      
      // Check if math adds up (allow small floating point differences)
      const calculatedTotal = sub + ship + tax;
      const diff = Math.abs(calculatedTotal - total);
      if (diff > 0.01) {
        errors.push(`Total ($${total.toFixed(2)}) must equal Subtotal + Shipping + Tax ($${calculatedTotal.toFixed(2)})`);
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const updateQuoteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/quotes/${selectedQuote!.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
          subtotal,
          shippingEstimate,
          taxEstimate,
          totalEstimate,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes", selectedQuote?.id] });
      toast({
        title: "Quote updated",
        description: "Quote has been successfully updated",
      });
      setEditDialogOpen(false);
      setSelectedQuote(null);
      setValidationErrors([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update quote",
        variant: "destructive",
      });
    },
  });

  const openEditDialog = (quote: QuoteWithCompany) => {
    setSelectedQuote(quote);
    // Preserve exact values (keep existing or use empty string for not-set)
    setSubtotal(quote.subtotal || "0");
    setShippingEstimate(quote.shippingEstimate || "0");
    setTaxEstimate(quote.taxEstimate || "0");
    setTotalEstimate(quote.totalEstimate || "0");
    setNewStatus(quote.status);
    setValidationErrors([]);
    setEditDialogOpen(true);
  };

  const handleSaveQuote = () => {
    if (validateForm()) {
      updateQuoteMutation.mutate();
    }
  };

  const filteredQuotes = quotes?.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Quote Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage customer quote requests</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by quote number or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50 animate-pulse" />
              <p>Loading quotes...</p>
            </div>
          ) : filteredQuotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote Number</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Total Estimate</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} data-testid={`row-quote-${quote.id}`}>
                    <TableCell className="font-mono">{quote.quoteNumber}</TableCell>
                    <TableCell>{quote.company.name}</TableCell>
                    <TableCell>
                      <StatusBadge type="quote" status={quote.status} />
                    </TableCell>
                    <TableCell>{format(new Date(quote.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {quote.totalEstimate !== "0" ? (
                        `$${parseFloat(quote.totalEstimate).toFixed(2)}`
                      ) : (
                        <span className="text-muted-foreground">Not priced</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(quote)}
                        data-testid={`button-edit-${quote.id}`}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No quotes found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quote: {selectedQuote?.quoteNumber}</DialogTitle>
            <DialogDescription>
              Update pricing and status for {selectedQuote?.company.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {quoteDetails?.items && quoteDetails.items.length > 0 && (
              <div className="space-y-2">
                <Label>Quote Items</Label>
                <div className="border rounded-md">
                  {quoteDetails.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 border-b last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {item.model?.marketingName || `${item.model?.brand} ${item.model?.name}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.variant?.storage} | {item.variant?.color} | Grade {item.variant?.conditionGrade}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status" data-testid="select-edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtotal">Subtotal</Label>
                <Input
                  id="subtotal"
                  type="number"
                  step="0.01"
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  data-testid="input-subtotal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping Estimate</Label>
                <Input
                  id="shipping"
                  type="number"
                  step="0.01"
                  value={shippingEstimate}
                  onChange={(e) => setShippingEstimate(e.target.value)}
                  data-testid="input-shipping"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax">Tax Estimate</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={taxEstimate}
                  onChange={(e) => setTaxEstimate(e.target.value)}
                  data-testid="input-tax"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="total">Total Estimate</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={totalEstimate}
                  onChange={(e) => setTotalEstimate(e.target.value)}
                  data-testid="input-total"
                />
              </div>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Validation Errors:</p>
              <ul className="text-sm text-destructive/90 space-y-1 list-disc list-inside">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuote}
              disabled={updateQuoteMutation.isPending}
              data-testid="button-save-quote"
            >
              {updateQuoteMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
