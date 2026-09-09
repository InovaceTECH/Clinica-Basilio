"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyMessageButton({ message }: { message: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(message);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <Button className="mt-4" onClick={copy} type="button" variant="secondary">{state === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{state === "copied" ? "Mensagem copiada" : "Copiar mensagem"}</Button>
      <p className={state === "error" ? "mt-2 text-body-sm text-danger" : "sr-only"} role="status">{state === "error" ? "Não foi possível copiar. Selecione a mensagem e copie manualmente." : state === "copied" ? "Mensagem copiada." : ""}</p>
    </div>
  );
}
