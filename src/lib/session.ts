import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { accessTypeService } from "@/modules/access/services/access-type.service";
import { hasPermission, type PermissionAction, type PermissionResource } from "@/modules/access/permissions";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  accessTypeId: string;
  isActive: boolean;
  image?: string | null;
}

export async function getServerSession() {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getServerSession();
  if (!session) return null;
  const user = session.user as unknown as AppUser;
  return user;
}

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user || !user.isActive) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export async function requirePermission(
  resource: PermissionResource,
  action: PermissionAction,
): Promise<AppUser> {
  const user = await requireUser();
  const matrix = await accessTypeService.getPermissions(user.accessTypeId);
  if (!hasPermission(matrix, resource, action)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
