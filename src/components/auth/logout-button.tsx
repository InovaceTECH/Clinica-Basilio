"use client";

import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      const result = await authClient.signOut();

      if (!result.error) {
        router.replace("/login");
        router.refresh();
        return;
      }
    } catch {
      // O feedback abaixo mantém detalhes técnicos fora da interface.
    }

    toast.error("Não foi possível sair. Tente novamente.");
    setIsPending(false);
  }

  return (
    <Button disabled={isPending} onClick={handleLogout} type="button" variant="secondary">
      {isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LogOut aria-hidden="true" />}
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
