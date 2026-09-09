"use client";

import { useEffect } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import {
  visibleNavigationItems,
  type NavigationPermissions,
} from "@/components/layout/navigation-items";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type CommandPaletteProps = NavigationPermissions & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Navegação por teclado (⌘K / Ctrl+K). O estado fica no `AppShell` para que o
 * botão da barra lateral e o do topo abram a mesma paleta.
 */
export function CommandPalette({
  open,
  onOpenChange,
  canViewDashboard,
  canManageSettings,
}: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const items = visibleNavigationItems({ canViewDashboard, canManageSettings });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      onOpenChange(!open);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  const isDark = resolvedTheme === "dark";

  return (
    <CommandDialog
      className="sm:max-w-xl"
      description="Busque páginas e ações do sistema"
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar no sistema"
    >
      <CommandInput placeholder="Buscar páginas e ações…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        <CommandGroup heading="Ir para">
          {items.map(({ href, label, hint, icon: Icon }) => (
            <CommandItem
              key={href}
              value={`${label} ${hint}`}
              onSelect={() => run(() => router.push(href))}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate">{label}</span>
              <span className="hidden shrink-0 text-caption text-text-muted sm:inline">
                {hint}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações">
          <CommandItem
            value="Buscar oportunidade paciente tratamento"
            onSelect={() => run(() => router.push("/oportunidades"))}
          >
            <SearchIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            Buscar oportunidade por paciente
          </CommandItem>
          <CommandItem
            value="Alternar tema claro escuro aparência"
            onSelect={() => run(() => setTheme(isDark ? "light" : "dark"))}
          >
            {isDark ? (
              <SunIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            ) : (
              <MoonIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            )}
            {isDark ? "Usar tema claro" : "Usar tema escuro"}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
