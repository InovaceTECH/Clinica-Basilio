import { redirect } from "next/navigation";

import { getCurrentSession } from "@/auth/session";
import { getAuthenticatedHomePath } from "@/auth/authorization";
import { getTenantContextFromSession } from "@/auth/tenant-context";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect(getAuthenticatedHomePath(getTenantContextFromSession(session)));
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">CB</div>
          <div>
            <p className="text-body-sm font-medium text-primary">Clínica Basilico</p>
            <h1 className="mt-1 text-heading-2 font-semibold tracking-tight">Recuperação de Orçamentos</h1>
          </div>
        </div>

        <Card className="shadow-level-1">
          <CardHeader>
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>Entre com as credenciais fornecidas pela gestão da clínica.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-caption text-text-muted">Acesso restrito à equipe autorizada.</p>
      </div>
    </main>
  );
}
