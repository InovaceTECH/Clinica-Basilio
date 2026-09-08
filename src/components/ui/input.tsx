import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-sm border border-input bg-surface px-3 py-2 text-base text-foreground transition-colors outline-none placeholder:text-text-faint focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-disabled aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/15",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
