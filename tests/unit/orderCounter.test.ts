import type { DocumentReference, Firestore, Transaction } from "firebase-admin/firestore";
import { allocateOrderNumber } from "@web/lib/orderCounter";

class MockDoc {
  constructor(private store: Map<string, number>, public readonly path: string) {}

  async get() {
    const value = this.store.get(this.path);
    return {
      exists: value !== undefined,
      data: () => ({ value }),
    };
  }
}

class MockFirestore implements Partial<Firestore> {
  private store = new Map<string, number>();

  doc(path: string) {
    return new MockDoc(this.store, path) as unknown as DocumentReference;
  }

  async runTransaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    const tx = {
      get: async (docRef: MockDoc) => docRef.get(),
      set: (docRef: MockDoc, data: { value: number }) => {
        this.store.set(docRef.path, data.value);
      },
    } as unknown as Transaction;
    const result = await fn(tx);
    return result;
  }
}

describe("allocateOrderNumber", () => {
  it("increments sequentially", async () => {
    const mock = new MockFirestore();

    const first = await allocateOrderNumber(mock as unknown as Firestore);
    const second = await allocateOrderNumber(mock as unknown as Firestore);

    expect(first).toBe("ORD-0000001");
    expect(second).toBe("ORD-0000002");
  });
});
