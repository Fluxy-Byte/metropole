import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { accessTypeService } from "@/modules/access/services/access-type.service";
import { hasPermission, type PermissionAction, type PermissionResource } from "@/modules/access/permissions";

const PUBLIC_ADMIN_PATHS = ["/admin/signin"];

const PROTECTED_PATHS: { prefix: string; resource: PermissionResource; action: PermissionAction }[] = [
  { prefix: "/admin/audit", resource: "AUDIT", action: "VIEW" },
  { prefix: "/api/admin/audit", resource: "AUDIT", action: "VIEW" },
  { prefix: "/admin/users", resource: "ACCESS", action: "MANAGE" },
  { prefix: "/api/admin/users", resource: "ACCESS", action: "MANAGE" },
  { prefix: "/admin/access-types", resource: "ACCESS", action: "MANAGE" },
  { prefix: "/api/admin/access-types", resource: "ACCESS", action: "MANAGE" },
];

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

  const sessionUser = session?.user as { accessTypeId?: string; isActive?: boolean } | undefined;

  if (!session || sessionUser?.isActive === false) {
    if (isApiAdmin) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const signInUrl = new URL("/admin/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const rule = PROTECTED_PATHS.find((r) => pathname.startsWith(r.prefix));
  if (rule) {
    const matrix = await accessTypeService.getPermissions(sessionUser!.accessTypeId!);
    if (!hasPermission(matrix, rule.resource, rule.action)) {
      if (isApiAdmin) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
