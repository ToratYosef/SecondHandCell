// @ts-nocheck
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Package, Search, DollarSign, TrendingUp, Eye, X, Send } from "lucide-react";
import type { Order } from "@shared/schema";

export default function AdminOrders() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [reofferAmount, setReofferAmount] = useState("");
  const [reofferReason, setReofferReason] = useState("");
  const [showReofferForm, setShowReofferForm] = useState(false);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status, trackingNumber }: { id: string; status?: string; trackingNumber?: string }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${id}`, { status, trackingNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Order Updated",
        description: "Order has been updated successfully",
      });
      setDetailsDialogOpen(false);
      setSelectedOrder(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    },
  });

  const reofferMutation = useMutation({
    mutationFn: async ({ id, newPrice, reason }: { id: string; newPrice: number; reason: string }) => {
      return await apiRequest("POST", `/api/admin/orders/${id}/reoffer`, { newPrice, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Re-offer Sent",
        description: "The re-offer has been sent to the customer",
      });
      setShowReofferForm(false);
      setReofferAmount("");
      setReofferReason("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send re-offer",
        variant: "destructive",
      });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/orders/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Order Cancelled",
        description: "The order has been cancelled successfully",
      });
      setDetailsDialogOpen(false);
      setSelectedOrder(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setDetailsDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;

    updateOrderMutation.mutate({
      id: selectedOrder.id,
      status: newStatus,
      trackingNumber: trackingNumber || undefined,
    });
  };

  const handleSendReoffer = () => {
    if (!selectedOrder || !reofferAmount || !reofferReason) return;

    reofferMutation.mutate({
      id: selectedOrder.id,
      newPrice: parseFloat(reofferAmount),
      reason: reofferReason,
    });
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;

    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate(selectedOrder.id);
    }
  };

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate stats
  const pendingOrders = orders?.filter((o) => o.status === "pending_payment").length || 0;
  const activeOrders = orders?.filter((o) => ["payment_review", "processing", "shipped"].includes(o.status)).length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Order Management</h1>
        <div className="h-96 bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground mt-1">Manage and fulfill customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" data-testid="select-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="payment_review">Payment Review</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} type="order" />
                  </TableCell>
                  <TableCell className="font-medium">${parseFloat(order.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                      data-testid={`button-view-${order.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details - {selectedOrder?.orderNumber}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order Date</Label>
                  <p className="font-medium">{format(new Date(selectedOrder.createdAt), "PPP")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="font-medium text-lg">${parseFloat(selectedOrder.total).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.status} type="order" />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.paymentStatus} type="payment" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Customer ID</Label>
                    <p>{selectedOrder.buyerId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Method</Label>
                    <p className="capitalize">{selectedOrder.paymentMethod?.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Update Status Section */}
              <div>
                <h3 className="font-semibold mb-3">Update Order Status</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending_payment">Pending Payment</SelectItem>
                        <SelectItem value="payment_review">Payment Review</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newStatus === "shipped" && (
                    <div>
                      <Label>Tracking Number (Optional)</Label>
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updateOrderMutation.isPending}
                    className="w-full"
                  >
                    {updateOrderMutation.isPending ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Re-offer Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Send Re-offer</h3>
                  {!showReofferForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReofferForm(true)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Create Re-offer
                    </Button>
                  )}
                </div>

                {showReofferForm && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label>New Offer Amount ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={reofferAmount}
                        onChange={(e) => setReofferAmount(e.target.value)}
                        placeholder="Enter new price"
                      />
                    </div>
                    <div>
                      <Label>Reason for Re-offer</Label>
                      <Textarea
                        value={reofferReason}
                        onChange={(e) => setReofferReason(e.target.value)}
                        placeholder="Explain why you're sending a new offer..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSendReoffer}
                        disabled={!reofferAmount || !reofferReason || reofferMutation.isPending}
                        className="flex-1"
                      >
                        {reofferMutation.isPending ? "Sending..." : "Send Re-offer"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowReofferForm(false);
                          setReofferAmount("");
                          setReofferReason("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Danger Zone */}
              <div>
                <h3 className="font-semibold text-destructive mb-3">Danger Zone</h3>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={cancelOrderMutation.isPending || selectedOrder.status === "cancelled"}
                  className="w-full"
                >
                  {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
