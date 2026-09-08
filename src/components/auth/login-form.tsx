"use client";

import { type FormEvent, useState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(undefined);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (!result.error) {
        router.replace("/");
        router.refresh();
        return;
      }
    } catch {
      // A interface usa a mesma mensagem para falhas de rede e credenciais.
    }

    setErrorMessage(
      "E-mail ou senha inválidos. Revise os dados e tente novamente.",
    );
    setIsPending(false);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-label font-medium text-text-secondary" htmlFor="email">
          E-mail
        </label>
        <Input autoComplete="email" disabled={isPending} id="email" name="email" placeholder="voce@clinicabasilico.com.br" required type="email" />
      </div>

      <div className="space-y-2">
        <label className="text-label font-medium text-text-secondary" htmlFor="password">
          Senha
        </label>
        <Input autoComplete="current-password" disabled={isPending} id="password" minLength={10} name="password" required type="password" />
      </div>

      <p aria-live="polite" className="min-h-5 text-body-sm text-danger" role={errorMessage ? "alert" : undefined}>
        {errorMessage}
      </p>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
