import "server-only";

import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const SCRYPT_OPTIONS = {
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 67108864,
} as const;

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
) {
  const derived = scryptSync(password, salt, 64, SCRYPT_OPTIONS);
  const expected = Buffer.from(expectedHash, "base64url");

  return (
    expected.length === derived.length && timingSafeEqual(derived, expected)
  );
}

export function createSessionToken() {
  return randomBytes(48).toString("base64url");
}

export function hashSessionToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET.");
  }

  return createHash("sha256").update(`${secret}:${token}`).digest("base64url");
}
