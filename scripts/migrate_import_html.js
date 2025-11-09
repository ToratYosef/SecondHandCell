#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

function getFirebase() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: getEnv("FIREBASE_PROJECT_ID"),
        clientEmail: getEnv("FIREBASE_CLIENT_EMAIL"),
        privateKey: getEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return { db: getFirestore(), storage: getStorage().bucket() };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walk(res) : res;
    })
  );
  return files.flat();
}

function extractDevice(html, fallbackSlug) {
  const titleMatch = html.match(/<title>([^<]+)<\\/title>/i);
  const headingMatch = html.match(/<h1[^>]*>([^<]+)<\\/h1>/i);
  const title = (headingMatch?.[1] || titleMatch?.[1] || fallbackSlug).trim();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const specs = {};
  const specMatches = html.matchAll(/<li[^>]*data-spec="([^"]+)"[^>]*>([^<]+)<\\/li>/gi);
  for (const match of specMatches) {
    specs[match[1]] = match[2].trim();
  }

  const capacities = Array.from(html.matchAll(/data-capacity="([^"]+)"/gi), (m) => m[1]);
  const networks = Array.from(html.matchAll(/data-network="([^"]+)"/gi), (m) => m[1]);
  const conditions = Array.from(html.matchAll(/data-condition="([^"]+)"/gi), (m) => m[1]);
  const images = Array.from(html.matchAll(/<img[^>]*src="([^"]+)"/gi), (m) => m[1]);

  return { title, slug, specs, capacities, networks, conditions, images };
}

async function uploadImages(storage, htmlFile, slug, images) {
  const uploaded = [];
  for (const imagePath of images) {
    const resolved = path.resolve(path.dirname(htmlFile), imagePath);
    const buffer = await fs.readFile(resolved).catch(() => null);
    if (!buffer) continue;
    const fileName = path.basename(imagePath);
    const dest = `images/devices/${slug}/${fileName}`;
    const file = storage.file(dest);
    await file.save(buffer, { contentType: "image/jpeg", resumable: false });
    uploaded.push(dest);
  }
  return uploaded;
}

async function main() {
  const folder = process.argv[2];
  if (!folder) {
    console.error("Usage: node scripts/migrate_import_html.js <old_site_folder>");
    process.exit(1);
  }

  const { db, storage } = getFirebase();
  const files = (await walk(path.resolve(__dirname, "..", folder))).filter((file) => file.endsWith("sell-device.html"));

  const summary = [];
  for (const file of files) {
    const html = await fs.readFile(file, "utf8");
    const device = extractDevice(html, path.basename(file, ".html"));
    const uploadedImages = await uploadImages(storage, file, device.slug, device.images);
    const docRef = db.collection("devices").doc(device.slug);
    await docRef.set(
      {
        title: device.title,
        slug: device.slug,
        specs: device.specs,
        capacities: Array.from(new Set(device.capacities)),
        networks: Array.from(new Set(device.networks)),
        conditions: Array.from(new Set(device.conditions)),
        images: uploadedImages,
        migratedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    summary.push({ slug: device.slug, images: uploadedImages.length, source: file });
  }

  console.table(summary);
  console.log(`Imported ${summary.length} devices`);
}

main().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
