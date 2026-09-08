"use client";

import { useState } from "react";
import { ChevronsUpDownIcon, LoaderCircleIcon, LogOutIcon, MonitorIcon, MoonIcon, SettingsIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { authClient } from "@/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const themeOptions = [
  { value: "light", label: "Claro", icon: SunIcon },
  { value: "dark", label: "Escuro", icon: MoonIcon },
  { value: "system", label: "Sistema", icon: MonitorIcon },
] as const;

/** Iniciais do nome — no máximo duas, ignorando conectivos. */
function initials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(part => part.length > 2 || part === part.toUpperCase());

  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

export function UserMenu({ userName, userRole }: { userName: string; userRole: string }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
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
    setIsSigningOut(false);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
              tooltip={userName}
            >
              <Avatar className="size-8 rounded-md">
                <AvatarFallback className="rounded-md bg-accent text-caption font-semibold text-accent-foreground">
                  {initials(userName)}
                </AvatarFallback>
              </Avatar>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-body-sm font-medium">{userName}</span>
                <span className="truncate text-caption text-text-muted">{userRole}</span>
              </span>
              <ChevronsUpDownIcon aria-hidden="true" className="ml-auto size-4 text-text-muted" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <span className="grid gap-0.5">
                <span className="truncate text-body-sm font-medium">{userName}</span>
                <span className="truncate text-caption text-text-muted">{userRole}</span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-caption text-text-muted">Aparência</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/configuracoes">
                  <SettingsIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Configurações
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isSigningOut} onSelect={handleLogout}>
              {isSigningOut ? (
                <LoaderCircleIcon aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <LogOutIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
              )}
              {isSigningOut ? "Saindo…" : "Sair"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
