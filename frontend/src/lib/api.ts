import type { RequirementRecord } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const TIMEOUT_MS = 60_000;
const SLOW_THRESHOLD_MS = 8_000;

export interface SubmitOptions {
  idempotencyKey: string;
  token?: string;
  onSlowRequest?: () => void;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  fieldErrors: { field: string; message: string }[];
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// ---------------------------------------------------------------------------
// Core fetch wrapper with AbortController timeout + slow-request callback
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string; token?: string } = {}
): Promise<{ status: number; body: T }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
    ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
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
// Auth APIs
// ---------------------------------------------------------------------------

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<ApiResult<AuthResponse>> {
  try {
    const { status, body } = await apiFetch<
      | { success: true; message: string; data: AuthResponse }
      | { success: false; message: string; errors?: { field: string; message: string }[] }
    >("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
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
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: "Unable to connect to server. Please try again.",
      fieldErrors: [],
    };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<ApiResult<AuthResponse>> {
  try {
    const { status, body } = await apiFetch<
      | { success: true; message: string; data: AuthResponse }
      | { success: false; message: string; errors?: { field: string; message: string }[] }
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
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
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: "Unable to connect to server. Please check your connection.",
      fieldErrors: [],
    };
  }
}

export async function getMe(token: string): Promise<ApiResult<{ user: UserResponse }>> {
  try {
    const { status, body } = await apiFetch<
      | { success: true; data: { user: UserResponse } }
      | { success: false; message: string }
    >("/auth/me", {
      method: "GET",
      token,
    });

    if (body.success) {
      return { ok: true, status, data: body.data, error: null, fieldErrors: [] };
    }
    return { ok: false, status, data: null, error: body.message, fieldErrors: [] };
  } catch {
    return { ok: false, status: 0, data: null, error: "Network error", fieldErrors: [] };
  }
}

// ---------------------------------------------------------------------------
// GET /requirements/my
// ---------------------------------------------------------------------------

export async function getMyRequirements(token: string): Promise<ApiResult<RequirementRecord[]>> {
  try {
    const { status, body } = await apiFetch<
      | { success: true; message: string; data: RequirementRecord[] }
      | { success: false; message: string }
    >("/requirements/my", {
      method: "GET",
      token,
    });

    if (body.success) {
      return { ok: true, status, data: body.data, error: null, fieldErrors: [] };
    }
    return { ok: false, status, data: null, error: body.message, fieldErrors: [] };
  } catch {
    return { ok: false, status: 0, data: null, error: "Network error", fieldErrors: [] };
  }
}

// ---------------------------------------------------------------------------
// POST /requirements
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
        token: options.token,
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

  const result = await attempt();
  if (slowTimer) clearTimeout(slowTimer);

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
