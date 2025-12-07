const rawBaseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = (rawBaseUrl || "").replace(/\/$/, "");

function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const url = resolveApiUrl(input);
  return fetch(url, {
    credentials: init.credentials ?? "include",
    ...init,
  });
}

export { resolveApiUrl, API_BASE_URL };
