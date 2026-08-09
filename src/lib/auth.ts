import { betterAuth } from "better-auth";
import { createAuthMiddleware, getIp } from "better-auth/api";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { resetPasswordEmailHtml, sendMail } from "@/lib/mailer";
import { auditService } from "@/modules/audit/services/audit.service";

function detectDevice(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

const AUDITED_PATHS: Record<string, "LOGIN" | "LOGOUT" | "CREATE"> = {
  "/sign-in/email": "LOGIN",
  "/sign-up/email": "CREATE",
  "/sign-out": "LOGOUT",
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendMail(
        user.email,
        "Redefinição de senha - Metrópole Imóveis",
        resetPasswordEmailHtml(user.name, url),
      );
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "AGENT",
      },
      cpf: {
        type: "string",
        required: false,
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const action = AUDITED_PATHS[ctx.path];
      if (!action) return;

      try {
        const userAgent = ctx.headers?.get("user-agent") ?? null;
        const ip = ctx.headers ? getIp(ctx.headers, ctx.context.options) : null;
        const returnedUser = (ctx.context.returned as { user?: { id: string; email: string } } | undefined)
          ?.user;
        const sessionUser = ctx.context.session?.user;
        const user = returnedUser ?? sessionUser ?? null;

        await auditService.record({
          actorId: user?.id ?? null,
          actorEmail: user?.email ?? null,
          action,
          entityType: "User",
          entityId: user?.id ?? null,
          ip,
          userAgent,
          device: detectDevice(userAgent),
        });
      } catch (error) {
        console.error("[audit] auth hook failed", error);
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
