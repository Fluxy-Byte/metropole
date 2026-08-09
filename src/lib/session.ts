import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type AppRole = "ADMIN" | "AGENT";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
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
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export async function requireRole(...roles: AppRole[]): Promise<AppUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
