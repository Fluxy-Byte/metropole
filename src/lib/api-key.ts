import { timingSafeEqual } from "crypto";

/**
 * Guards the Axel/WhatsApp integration routes. The agent authenticates with a
 * static bearer token (AXEL_API_KEY) rather than a user session.
 */
export function isValidAxelRequest(request: Request): boolean {
  const expected = process.env.AXEL_API_KEY;
  if (!expected) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  const provided = header.slice("Bearer ".length);
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(providedBuf, expectedBuf);
}
