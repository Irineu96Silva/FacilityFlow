import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { authClient } from "@frontend/lib/core/auth";

function getDefaultRouteByRole(role?: string): string {
  if (role === "SUPER_ADMIN") return "/admin/platform/dashboard";
  if (role === "ADMIN_COMPANY") return "/admin/predial/dashboard";
  if (role === "SUPERVISOR") return "/app/predial/supervisor";
  if (role === "REQUESTER") return "/app/predial/requester";
  return "/app/predial/technician";
}

export function createAuthGuard() {
  return async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const session = await authClient.getSession();

    const authenticated = !!(session?.data?.user && !session?.error);

    const authType = to.meta.authType ?? "public";

    switch (authType) {
      case "authenticated":
        if (!authenticated) {
          // Redirect unauthenticated users to login with redirect query
          next({
            name: "login",
            query: { redirect: to.fullPath },
          });
          return;
        }
        next();
        break;

      case "unauthenticated":
        if (authenticated) {
          const role = (session?.data?.user as any)?.predialRole as
            | string
            | undefined;
          next(getDefaultRouteByRole(role));
          return;
        }
        next();
        break;

      case "public":
      default:
        // Public routes are accessible to everyone
        next();
        break;
    }
  };
}
