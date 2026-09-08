"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppShellProps = {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  canViewDashboard?: boolean;
  canManageSettings?: boolean;
  /** Estado da barra lateral lido do cookie no servidor, evitando salto visual. */
  defaultSidebarOpen?: boolean;
};

export function AppShell({
  children,
  userName,
  userRole,
  canViewDashboard = false,
  canManageSettings = false,
  defaultSidebarOpen = true,
}: AppShellProps) {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const permissions = { canViewDashboard, canManageSettings };
  const homePath = canViewDashboard ? "/dashboard" : "/oportunidades";

  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider defaultOpen={defaultSidebarOpen}>
        {/* Luz ambiente atrás de tudo: dá ao vidro da barra lateral e do topo
            algo para capturar, em vez de desfocar um cinza chapado. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_32rem_at_12%_-4rem,var(--accent),transparent),radial-gradient(48rem_28rem_at_92%_8%,var(--surface-hover),transparent)]"
        />

        <a
          className="sr-only fixed top-3 left-3 z-50 rounded-full bg-primary px-5 py-3 text-body-sm font-medium text-primary-foreground shadow-level-3 focus:not-sr-only focus:fixed"
          href="#main-content"
        >
          Pular para o conteúdo
        </a>

        <AppSidebar
          {...permissions}
          homePath={homePath}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          userName={userName}
          userRole={userRole}
        />

        <SidebarInset className="min-w-0 overflow-hidden">
          <AppTopbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
          <div
            className="mx-auto w-full min-w-0 max-w-[88rem] flex-1 px-5 py-8 outline-none sm:px-8 sm:py-10 lg:px-10"
            id="main-content"
            tabIndex={-1}
          >
            {children}
          </div>
        </SidebarInset>

        <CommandPalette
          {...permissions}
          open={isCommandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
        />
      </SidebarProvider>
    </TooltipProvider>
  );
}
