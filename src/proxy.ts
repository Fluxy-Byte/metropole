import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = ["/admin/signin", "/admin/signup"];
const ADMIN_ONLY_PATHS = ["/admin/audit", "/api/admin/audit"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiAdmin = pathname.startsWith("/api/admin");
  const isAdminPage = pathname.startsWith("/admin");

  if (!isApiAdmin && !isAdminPage) {
    return NextResponse.next();
  }

  if (isAdminPage && PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    if (isApiAdmin) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const signInUrl = new URL("/admin/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = (session.user as { role?: string }).role;

  if (ADMIN_ONLY_PATHS.some((path) => pathname.startsWith(path)) && role !== "ADMIN") {
    if (isApiAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
