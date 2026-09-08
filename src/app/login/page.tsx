import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAuthenticatedHomePath } from "@/auth/authorization";
import { getCurrentSession } from "@/auth/session";
import { getTenantContextFromSession } from "@/auth/tenant-context";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeSwitch } from "@/components/theme/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect(getAuthenticatedHomePath(getTenantContextFromSession(session)));
  }

  return (
    <main className="relative grid min-h-dvh place-items-center bg-background px-4 py-10 sm:px-6">
      {/* Malha decorativa: fica atrás do conteúdo e some para leitores de tela. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(48rem_28rem_at_50%_-4rem,var(--accent),transparent),radial-gradient(36rem_24rem_at_88%_100%,var(--surface-hover),transparent)]"
      />
      <ThemeSwitch className="absolute top-4 right-4" />

      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-lg bg-primary text-heading-3 font-semibold text-primary-foreground shadow-level-2">
            CB
          </div>
          <div>
            <p className="text-body-sm font-medium text-primary">Clínica Basilico</p>
            <h1 className="mt-1.5 text-heading-1 font-semibold tracking-tight">
              Recuperação de Orçamentos
            </h1>
          </div>
        </div>

        <Card className="shadow-level-3">
          <CardHeader>
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>
              Entre com as credenciais fornecidas pela gestão da clínica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-caption text-text-muted">
          Acesso restrito à equipe autorizada.
        </p>
      </div>
    </main>
  );
}
