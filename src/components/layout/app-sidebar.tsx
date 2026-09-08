"use client";

import { LifeBuoyIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserMenu } from "@/components/layout/user-menu";
import {
  isNavigationItemActive,
  navigationGroups,
  visibleNavigationItems,
  type NavigationPermissions,
} from "@/components/layout/navigation-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

type AppSidebarProps = NavigationPermissions & {
  userName: string;
  userRole: string;
  homePath: string;
  onOpenCommandPalette: () => void;
};

function Brand({ href }: { href: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" tooltip="Clínica Basilico">
          <Link href={href}>
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-sm bg-primary text-caption font-semibold tracking-tight text-primary-foreground shadow-level-1 group-data-[collapsible=icon]:-ml-0.5"
            >
              CB
            </span>
            <span className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-body-sm font-semibold">Clínica Basilico</span>
              <span className="truncate text-caption text-text-muted">
                Gestão de oportunidades
              </span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({
  canViewDashboard,
  canManageSettings,
  userName,
  userRole,
  homePath,
  onOpenCommandPalette,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const items = visibleNavigationItems({ canViewDashboard, canManageSettings });

  // No celular a navegação vive dentro de um Sheet: fecha ao seguir um link.
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Brand href={homePath} />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Buscar (⌘K)"
              onClick={() => {
                closeOnMobile();
                onOpenCommandPalette();
              }}
            >
              <SearchIcon aria-hidden="true" strokeWidth={1.75} />
              <span className="flex-1 text-left">Buscar</span>
              <kbd className="pointer-events-none hidden rounded-xs bg-surface px-1.5 py-0.5 font-mono text-caption text-text-muted shadow-level-1 group-data-[collapsible=icon]:hidden sm:inline-block">
                ⌘K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map(group => {
          const groupItems = items.filter(item => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupItems.map(({ href, label, icon: Icon }) => {
                    const isActive = isNavigationItemActive(pathname, href);
                    return (
                      <SidebarMenuItem key={href}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                          <Link
                            aria-current={isActive ? "page" : undefined}
                            href={href}
                            onClick={closeOnMobile}
                          >
                            <Icon aria-hidden="true" strokeWidth={1.75} />
                            <span>{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" tooltip="Ajuda">
                  <Link href="/playbooks" onClick={closeOnMobile}>
                    <LifeBuoyIcon aria-hidden="true" strokeWidth={1.75} />
                    <span>Ajuda e roteiros</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu userName={userName} userRole={userRole} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
