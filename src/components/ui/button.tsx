import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botão em forma de pílula, no padrão Apple: preenchimento sólido para a ação
 * principal, cinza suave para as secundárias e um recuo curto ao pressionar.
 * O recuo é desligado por `prefers-reduced-motion` em globals.css.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-medium whitespace-nowrap outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-apple focus-visible:ring-3 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-level-1 hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-surface-hover text-foreground hover:bg-surface-sunken active:bg-surface-sunken",
        outline:
          "border-border-strong bg-transparent text-foreground hover:border-transparent hover:bg-surface-hover",
        ghost: "text-foreground hover:bg-surface-hover",
        destructive:
          "bg-danger-bg text-danger hover:bg-danger hover:text-primary-foreground",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-9 px-4 text-body-sm",
        default: "h-10 px-5 text-body-sm",
        lg: "h-12 px-7 text-body",
        "icon-sm": "size-8 p-0",
        icon: "size-10 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
