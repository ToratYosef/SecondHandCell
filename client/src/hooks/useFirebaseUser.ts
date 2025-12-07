import { useEffect, useMemo, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, signInWithGoogle } from "@/lib/firebase";
import type { User } from "@shared/schema";

interface FirebaseProfile extends User {
  role: User["role"];
}

export function useFirebaseUser() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<FirebaseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setLoading(true);

      if (user) {
        await ensureProfile(user);
        const profileDoc = doc(collection(db, "users"), user.uid);
        const stop = onSnapshot(profileDoc, (snapshot) => {
          const data = snapshot.data();
          setProfile(
            data
              ? {
                  id: user.uid,
                  email: data.email ?? user.email ?? undefined,
                  name: data.name ?? user.displayName ?? "",
                  role: data.role ?? "buyer",
                  companyName: data.companyName ?? null,
                  createdAt: data.createdAt,
                }
              : null
          );
          setLoading(false);
        });
        return () => stop();
      }

      setProfile(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => profile?.role === "admin" || profile?.role === "super_admin", [profile]);

  return { firebaseUser, profile, isAdmin, loading, signInWithGoogle };
}

async function ensureProfile(user: FirebaseUser) {
  const profileRef = doc(collection(db, "users"), user.uid);
  const existing = await getDoc(profileRef);

  if (!existing.exists()) {
    await setDoc(profileRef, {
      email: user.email ?? "",
      name: user.displayName ?? "New user",
      role: "buyer",
      createdAt: serverTimestamp(),
    });
  }
}
