import {
  BookOpen,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Upload,
  type LucideIcon,
} from "lucide-react";

export type NavigationPermissions = {
  canViewDashboard: boolean;
  canManageSettings: boolean;
};

export type NavigationItem = {
  href: string;
  label: string;
  /** Texto curto exibido na paleta de comandos e como dica no modo compacto. */
  hint: string;
  icon: LucideIcon;
  group: NavigationGroup;
  /** Permissão que libera o item; `undefined` significa disponível para todos. */
  requires?: keyof NavigationPermissions;
};

export type NavigationGroup = "Atendimento" | "Organização";

export const navigationGroups: NavigationGroup[] = ["Atendimento", "Organização"];

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Visão geral",
    hint: "Indicadores de recuperação",
    icon: LayoutDashboard,
    group: "Atendimento",
    requires: "canViewDashboard",
  },
  {
    href: "/oportunidades",
    label: "Oportunidades",
    hint: "Orçamentos em aberto",
    icon: ClipboardList,
    group: "Atendimento",
  },
  {
    href: "/follow-ups",
    label: "Follow-ups",
    hint: "Retornos agendados",
    icon: CalendarClock,
    group: "Atendimento",
  },
  {
    href: "/importar",
    label: "Importar planilha",
    hint: "Trazer orçamentos do sistema da clínica",
    icon: Upload,
    group: "Organização",
  },
  {
    href: "/playbooks",
    label: "Playbooks",
    hint: "Roteiros de abordagem",
    icon: BookOpen,
    group: "Organização",
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    hint: "Regras comerciais e equipe",
    icon: Settings,
    group: "Organização",
    requires: "canManageSettings",
  },
];

export function visibleNavigationItems(permissions: NavigationPermissions) {
  return navigationItems.filter(item => !item.requires || permissions[item.requires]);
}

/** Marca o item ativo considerando rotas filhas (ex.: /oportunidades/123). */
export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Trilha de navegação derivada da rota, para o cabeçalho do conteúdo. */
export function navigationTrail(pathname: string) {
  const match = navigationItems.find(item => isNavigationItemActive(pathname, item.href));
  if (!match) return [];

  const trail = [{ label: match.group }, { label: match.label, href: match.href }];
  return pathname === match.href ? trail : [...trail, { label: "Detalhes" }];
}
