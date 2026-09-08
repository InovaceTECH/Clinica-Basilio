import { type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type SectionPlaceholderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function SectionPlaceholder({
  icon: Icon,
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <Card className="mt-8 max-w-2xl">
      <CardContent className="flex flex-col items-start gap-4 py-6 sm:py-8">
        <span className="grid size-10 place-items-center rounded-md bg-info-bg text-info">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-heading-3 font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-body-sm text-text-muted">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
