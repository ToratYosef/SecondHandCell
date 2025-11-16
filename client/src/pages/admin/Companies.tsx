import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StatusBadge } from "@/components/StatusBadge";

export default function Companies() {
  const { toast } = useToast();
  
  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/admin/companies"],
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, status, creditLimit }: { id: string; status?: string; creditLimit?: string }) => {
      return await apiRequest(`/api/admin/companies/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, creditLimit }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      toast({
        title: "Company updated",
        description: "Company status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Company Management</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const pendingCompanies = companies?.filter((c: any) => c.status === "pending") || [];
  const approvedCompanies = companies?.filter((c: any) => c.status === "approved") || [];
  const rejectedCompanies = companies?.filter((c: any) => c.status === "rejected") || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Company Management</h1>
        <p className="text-muted-foreground mt-1">Manage and approve company registrations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCompanies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCompanies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCompanies.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {companies?.map((company: any) => (
          <Card key={company.id} data-testid={`company-card-${company.id}`}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{company.legalName}</p>
                  </div>
                </div>
                <StatusBadge status={company.status} type="company" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tax ID</p>
                  <p className="text-sm font-mono">{company.taxId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm">{company.primaryPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="text-sm">{company.billingEmail}</p>
                </div>
                {company.website && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-muted-foreground">Credit Limit</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      defaultValue={company.creditLimit || "0"}
                      placeholder="0.00"
                      className="max-w-[200px]"
                      data-testid={`input-credit-${company.id}`}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value && parseFloat(value) !== parseFloat(company.creditLimit || "0")) {
                          updateCompanyMutation.mutate({
                            id: company.id,
                            creditLimit: value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {company.status !== "approved" && (
                    <Button
                      onClick={() => updateCompanyMutation.mutate({ id: company.id, status: "approved" })}
                      disabled={updateCompanyMutation.isPending}
                      data-testid={`button-approve-${company.id}`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {company.status !== "rejected" && (
                    <Button
                      variant="destructive"
                      onClick={() => updateCompanyMutation.mutate({ id: company.id, status: "rejected" })}
                      disabled={updateCompanyMutation.isPending}
                      data-testid={`button-reject-${company.id}`}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  )}
                  {company.status === "approved" && (
                    <Button
                      variant="outline"
                      onClick={() => updateCompanyMutation.mutate({ id: company.id, status: "suspended" })}
                      disabled={updateCompanyMutation.isPending}
                      data-testid={`button-suspend-${company.id}`}
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
