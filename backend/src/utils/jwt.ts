import crypto from "node:crypto";

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

const SECRET = process.env.AUTH_SECRET || "gopratle-jwt-secret-key-2026-production-ready";

export function createToken(payload: { userId: string; email: string; name: string; role: string }): string {
  const data: AuthPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const encoded = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encoded, signature] = parts;
    if (!encoded || !signature) return null;

    const expectedSignature = crypto.createHmac("sha256", SECRET).update(encoded).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AuthPayload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
