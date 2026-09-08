"use client";

import { useState } from "react";
import {
  BookOpen,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/oportunidades", label: "Oportunidades", icon: ClipboardList },
  { href: "/follow-ups", label: "Follow-ups", icon: CalendarClock },
  { href: "/importar", label: "Importar", icon: Upload },
  { href: "/playbooks", label: "Playbooks", icon: BookOpen },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

type AppShellProps = {
  children: React.ReactNode;
  userName: string;
  userRole: string;
};

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="space-y-1">
      {navigationItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-body-sm font-medium text-text-secondary outline-none transition-colors hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-primary/15",
              isActive && "bg-accent text-primary",
            )}
            href={href}
            key={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-primary/15" href="/dashboard">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <Sparkles aria-hidden="true" className="size-4" />
      </span>
      <span>
        <span className="block text-body-sm font-semibold text-foreground">Clínica Basilico</span>
        <span className="block text-caption text-text-muted">Recuperação de orçamentos</span>
      </span>
    </Link>
  );
}

function UserPanel({ userName, userRole }: Omit<AppShellProps, "children">) {
  return (
    <div className="border-t border-border pt-4">
      <div className="mb-4 min-w-0 px-3">
        <p className="truncate text-body-sm font-medium text-foreground">{userName}</p>
        <p className="mt-0.5 text-caption text-text-muted">{userRole}</p>
      </div>
      <LogoutButton />
    </div>
  );
}

export function AppShell({ children, userName, userRole }: AppShellProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-surface p-4 lg:flex">
        <Brand />
        <div className="mt-8 flex-1">
          <NavigationLinks />
        </div>
        <UserPanel userName={userName} userRole={userRole} />
      </aside>

      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Brand />
        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMobileNavigationOpen}
          aria-label={isMobileNavigationOpen ? "Fechar navegação" : "Abrir navegação"}
          className="grid size-11 place-items-center rounded-md text-foreground outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-primary/15"
          onClick={() => setIsMobileNavigationOpen((open) => !open)}
          type="button"
        >
          {isMobileNavigationOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      {isMobileNavigationOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-30 bg-foreground/20 lg:hidden">
          <aside
            className="flex h-full w-[min(20rem,calc(100vw-3rem))] flex-col border-r border-border bg-surface p-4 shadow-level-2"
            id="mobile-navigation"
          >
            <div className="flex-1">
              <NavigationLinks onNavigate={() => setIsMobileNavigationOpen(false)} />
            </div>
            <UserPanel userName={userName} userRole={userRole} />
          </aside>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 sm:py-8 lg:col-start-2 lg:px-8">
        {children}
      </main>
    </div>
  );
}
