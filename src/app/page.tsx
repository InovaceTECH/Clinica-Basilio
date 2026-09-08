import { redirect } from "next/navigation";

import { getCurrentSession } from "@/auth/session";
import { getAuthenticatedHomePath } from "@/auth/authorization";
import { getTenantContextFromSession } from "@/auth/tenant-context";

export default async function Home() {
  const session = await getCurrentSession();

  redirect(session ? getAuthenticatedHomePath(getTenantContextFromSession(session)) : "/login");
}
