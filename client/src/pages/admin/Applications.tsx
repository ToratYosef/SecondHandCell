import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WholesaleApplication } from "@shared/schema";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type ApplicationRecord = WholesaleApplication & { id: string };

const statusLabels: Record<NonNullable<WholesaleApplication["status"]>, string> = {
  submitted: "Submitted",
  in_review: "In review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as WholesaleApplication;
        return {
          ...data,
          id: docSnap.id,
        } as ApplicationRecord;
      });

      setApplications(records);
    });

    return () => unsubscribe();
  }, []);

  const counts = useMemo(() => {
    return applications.reduce(
      (acc, app) => {
        const key = app.status || "submitted";
        acc[key as keyof typeof acc] = (acc[key as keyof typeof acc] || 0) + 1;
        return acc;
      },
      { submitted: 0, in_review: 0, approved: 0, rejected: 0 }
    );
  }, [applications]);

  const handleStatusChange = async (applicationId: string, status: NonNullable<WholesaleApplication["status"]>) => {
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        status,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Status updated", description: `Application marked as ${statusLabels[status].toLowerCase()}.` });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Could not update application status.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageShell
      title="Applications"
      description="Review wholesale account requests in real time from Firestore."
      badge="Admin"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatusCard label="Submitted" value={counts.submitted} variant="secondary" />
        <StatusCard label="In review" value={counts.in_review} variant="outline" />
        <StatusCard label="Approved" value={counts.approved} variant="default" />
        <StatusCard label="Rejected" value={counts.rejected} variant="destructive" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Incoming applications</CardTitle>
          <CardDescription>Entries are loaded directly from the Firestore applications collection.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    No applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{app.companyName}</div>
                      <div className="text-xs text-muted-foreground">{app.businessType}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div>{app.email}</div>
                      <div>{app.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(app.status)}>{statusLabels[app.status || "submitted"]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(app.id, "in_review")}
                        disabled={app.status === "approved"}
                      >
                        In review
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusChange(app.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleStatusChange(app.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function StatusCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "default" | "secondary" | "destructive" | "outline";
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={variant}>{label}</Badge>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status?: WholesaleApplication["status"]) {
  switch (status) {
    case "approved":
      return "secondary" as const;
    case "rejected":
      return "destructive" as const;
    case "in_review":
      return "outline" as const;
    default:
      return "default" as const;
  }
}

function formatDate(value: WholesaleApplication["createdAt"]) {
  if (!value) return "–";

  if (typeof (value as any)?.toDate === "function") {
    return (value as any).toDate().toLocaleString();
  }

  const date = new Date(value as any);
  return Number.isNaN(date.getTime()) ? "–" : date.toLocaleString();
}
