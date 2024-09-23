import { cn } from "@/lib/utils";
import React from "react";

export function Text(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { children, className, ...rest } = props;
  return (
    <p
      className={cn("text-steel-500 dark:text-steel-400 text-sm", className)}
      {...rest}
    >
      {children}
    </p>
  );
}
