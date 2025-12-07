import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "..", "serviceAccountKey.json");
const email = "sales@secondhandcell.com";
const password = "GPrs1234";
const displayName = "Sales Admin";

async function loadServiceAccount() {
  try {
    const json = await fs.readFile(serviceAccountPath, "utf8");
    return JSON.parse(json);
  } catch (error) {
    throw new Error(
      `Unable to read service account JSON at ${serviceAccountPath}. Place your Firebase admin key there before running.\n${error}`
    );
  }
}

async function ensureAdminUser() {
  const serviceAccount = await loadServiceAccount();

  initializeApp({
    credential: cert(serviceAccount),
  });

  const auth = getAuth();
  const db = getFirestore();

  let user = null;

  try {
    user = await auth.getUserByEmail(email);
    console.log(`Found existing user ${email} (${user.uid}). Updating password and profile…`);
    await auth.updateUser(user.uid, {
      password,
      displayName,
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.log(`Creating admin user ${email}…`);
      user = await auth.createUser({
        email,
        password,
        displayName,
      });
    } else {
      throw error;
    }
  }

  await auth.setCustomUserClaims(user.uid, { role: "admin" });
  console.log("Applied admin custom claim.");

  const profileRef = db.collection("users").doc(user.uid);
  const existingProfile = await profileRef.get();
  const createdAt = existingProfile.exists ? existingProfile.get("createdAt") : FieldValue.serverTimestamp();

  await profileRef.set(
    {
      email,
      name: displayName,
      role: "admin",
      createdAt,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Admin profile saved to users/${user.uid}.`);
}

ensureAdminUser()
  .then(() => {
    console.log("Finished provisioning admin user.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to provision admin user:", error);
    process.exit(1);
  });
