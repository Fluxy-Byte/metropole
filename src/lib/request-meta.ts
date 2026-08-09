export interface RequestMeta {
  ip: string | null;
  userAgent: string | null;
  device: string | null;
}

function detectDevice(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

export function getRequestMeta(request: Request): RequestMeta {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? null;
  const userAgent = headers.get("user-agent");
  return { ip, userAgent, device: detectDevice(userAgent) };
}
