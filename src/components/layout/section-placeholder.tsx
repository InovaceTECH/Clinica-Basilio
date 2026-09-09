import { type LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/patterns";

type SectionPlaceholderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

/**
 * Aviso de área ainda não disponível. Usa o mesmo desenho dos estados vazios
 * para que "sem dados" e "em construção" não pareçam problemas diferentes.
 */
export function SectionPlaceholder({
  icon,
  title,
  description,
  action,
}: SectionPlaceholderProps) {
  return (
    <EmptyState
      action={action}
      className="mt-8"
      description={description}
      icon={icon}
      title={title}
    />
  );
}
