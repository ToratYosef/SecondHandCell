import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CatalogItem } from "@shared/schema";

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const catalogQuery = query(collection(db, "catalog"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(catalogQuery, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CatalogItem[];
      setItems(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const summary = useMemo(() => {
    const active = items.filter((item) => item.status !== "archived");
    const brands = new Set(active.map((item) => item.brand).filter(Boolean));
    const avgPrice =
      active.length === 0
        ? 0
        : active.reduce((sum, item) => sum + (item.price || 0), 0) / active.length;

    return {
      total: active.length,
      brands: brands.size,
      avgPrice: Number.isFinite(avgPrice) ? avgPrice : 0,
    };
  }, [items]);

  return { items, summary, loading };
}
