/**
 * Direct Supabase REST/Storage helpers that bypass the JS SDK.
 *
 * The Supabase JS client internally calls getSession() before every
 * authenticated request. In some environments this call hangs indefinitely
 * (e.g. during token refresh). These helpers read the auth token directly
 * from localStorage and call the REST API via plain fetch().
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function getToken(): string {
  try {
    const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.access_token ?? SUPABASE_ANON_KEY;
    }
  } catch {
    // ignore
  }
  return SUPABASE_ANON_KEY;
}

function getUserId(): string | null {
  try {
    const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.user?.id ?? null;
    }
  } catch {
    // ignore
  }
  return null;
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "Authorization": `Bearer ${getToken()}`,
    "apikey": SUPABASE_ANON_KEY,
    ...extra,
  };
}

/** Insert a row into a table via REST API. Throws on error. */
export async function restInsert(table: string, row: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `HTTP ${res.status}`);
  }
}

/** Upload a file to Supabase Storage via REST API. Returns the public URL. */
export async function storageUpload(bucket: string, path: string, file: File): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    }),
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/** Fetch rows from a table via REST API. Returns empty array on error. */
export async function restSelect<T = Record<string, unknown>>(
  table: string,
  eq: Record<string, string>,
  order?: string,
  limit = 100
): Promise<T[]> {
  const params = new URLSearchParams();
  Object.entries(eq).forEach(([col, val]) => params.set(col, `eq.${val}`));
  if (order) params.set("order", order);
  params.set("limit", String(limit));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: authHeaders({ "Accept": "application/json" }),
  });
  if (!res.ok) return [];
  return res.json() as Promise<T[]>;
}

export { getToken, getUserId };
