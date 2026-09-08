import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-caption font-medium whitespace-nowrap focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        neutral: "border-border bg-surface-secondary text-text-secondary",
        success: "border-success-border bg-success-bg text-success",
        warning: "border-warning-border bg-warning-bg text-warning",
        danger: "border-danger-border bg-danger-bg text-danger",
        info: "border-info-border bg-info-bg text-info",
        high: "border-danger-border bg-priority-high-bg text-priority-high",
        medium:
          "border-warning-border bg-priority-medium-bg text-priority-medium",
        low: "border-info-border bg-priority-low-bg text-priority-low",
        outline: "border-border bg-transparent text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant = "neutral",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot.Root : "span";

  return (
    <Component
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
