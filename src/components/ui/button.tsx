/* Hallmark · design-system: design.md
 *
 * 8px radius (never a pill), one solid accent primary per view, everything else
 * a bordered ghost. The press is a 120ms 1px settle — no scale, no bounce. The
 * transitioned properties are spelled out rather than `transition-all`, so the
 * focus ring still appears instantly.
 */

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center gap-xs whitespace-nowrap",
    "rounded-control text-sm font-medium",
    "transition-[background-color,border-color,color,opacity,transform] duration-short ease-out",
    "active:translate-y-px active:duration-micro",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default: "bg-signal text-signal-ink hover:bg-signal-hover",
        destructive: "bg-danger text-signal-ink hover:opacity-90",
        outline:
          "border border-rule bg-paper-2 text-foreground hover:border-rule-2 hover:bg-paper-3",
        secondary: "bg-paper-3 text-foreground hover:bg-rule",
        ghost: "text-ink-2 hover:bg-paper-3 hover:text-foreground",
        link: "text-signal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-md py-2",
        sm: "h-9 px-sm text-xs",
        lg: "h-11 px-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
