export function getPostLoginDestination(
  role?: string | null,
  _redirect?: string | null,
): string {
  if (role === "SUPER_ADMIN") return "/admin/platform/dashboard";
  if (role === "ADMIN_COMPANY") return "/admin/predial/dashboard";
  if (role === "SUPERVISOR") return "/app/predial/supervisor";
  if (role === "REQUESTER") return "/app/predial/requester";
  return "/app/predial/technician";
}
