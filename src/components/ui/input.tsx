import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * The field confirms it is alive on focus — the border moves to the accent and
 * a ring appears — before the visitor types anything. 16px minimum on the text
 * so iOS doesn't zoom the viewport when the field is tapped.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-control border border-rule bg-paper-2 px-sm py-1",
          "text-base text-foreground",
          "transition-[border-color,background-color] duration-short ease-out",
          "placeholder:text-muted-foreground",
          "hover:border-rule-2",
          "focus-visible:border-signal focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-signal",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
