import type { RequirementRecord } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const TIMEOUT_MS = 60_000;
const SLOW_THRESHOLD_MS = 8_000;

export interface SubmitOptions {
  idempotencyKey: string;
  onSlowRequest?: () => void;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  fieldErrors: { field: string; message: string }[];
}

// ---------------------------------------------------------------------------
// Core fetch wrapper with AbortController timeout + slow-request callback
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {}
): Promise<{ status: number; body: T }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const body = (await res.json()) as T;
    return { status: res.status, body };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// POST /requirements
// Retries once on network failure / timeout / 503 (idempotency makes it safe)
// ---------------------------------------------------------------------------

export async function submitRequirement(
  payload: Record<string, unknown>,
  options: SubmitOptions
): Promise<ApiResult<RequirementRecord>> {
  let slowTimer: ReturnType<typeof setTimeout> | null = null;

  if (options.onSlowRequest) {
    slowTimer = setTimeout(options.onSlowRequest, SLOW_THRESHOLD_MS);
  }

  const attempt = async (): Promise<ApiResult<RequirementRecord>> => {
    try {
      const { status, body } = await apiFetch<
        | { success: true; message: string; data: RequirementRecord }
        | { success: false; message: string; errors?: { field: string; message: string }[] }
      >("/requirements", {
        method: "POST",
        body: JSON.stringify(payload),
        idempotencyKey: options.idempotencyKey,
      });

      if (body.success) {
        return { ok: true, status, data: body.data, error: null, fieldErrors: [] };
      }
      return {
        ok: false,
        status,
        data: null,
        error: body.message,
        fieldErrors: body.errors ?? [],
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return {
          ok: false,
          status: 0,
          data: null,
          error: "Request timed out. Please try again.",
          fieldErrors: [],
        };
      }
      return {
        ok: false,
        status: 0,
        data: null,
        error: "Network error. Please check your connection.",
        fieldErrors: [],
      };
    }
  };

  // First attempt
  const result = await attempt();
  if (slowTimer) clearTimeout(slowTimer);

  // Retry once on network failure or 503
  if (!result.ok && (result.status === 0 || result.status === 503)) {
    return attempt();
  }

  return result;
}

// ---------------------------------------------------------------------------
// GET /requirements/:id
// ---------------------------------------------------------------------------

export async function getRequirement(id: string): Promise<ApiResult<RequirementRecord>> {
  try {
    const { status, body } = await apiFetch<
      | { success: true; message: string; data: RequirementRecord }
      | { success: false; message: string }
    >(`/requirements/${id}`);

    if (body.success) {
      return { ok: true, status, data: body.data, error: null, fieldErrors: [] };
    }
    return { ok: false, status, data: null, error: body.message, fieldErrors: [] };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: "Network error",
      fieldErrors: [],
    };
  }
}
