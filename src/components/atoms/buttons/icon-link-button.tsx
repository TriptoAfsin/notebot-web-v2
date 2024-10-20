import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { Box } from "../layout";

type IconLinkButtonProps = {
  label: string;
  icon?: React.ReactNode;
  path: string;
  className?: string;
  labelClassName?: string;
  iconClassName?: string;
  size?: "sm" | "regular" | "lg";
  isExternal?: boolean;
};

export default function IconLinkButton({
  label,
  icon,
  path,
  className,
  labelClassName,
  iconClassName,
  size = "regular",
  isExternal = false,
}: IconLinkButtonProps) {
  const sizeClasses = {
    sm: "text-sm p-2",
    regular: "text-base p-3",
    lg: "text-lg p-4",
  };

  return (
    <Link
      to={path}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors aspect-square dark:bg-zinc-800 dark:hover:bg-zinc-700",
        sizeClasses[size],
        className
      )}
      target={isExternal ? "_blank" : "_self"}
    >
      <Box className={cn("text-gray-600 dark:text-gray-100", iconClassName)}>
        {icon}
      </Box>
      <span
        className={cn(
          "mt-1 text-gray-800 dark:text-white text-nowrap",
          labelClassName
        )}
      >
        {label}
      </span>
    </Link>
  );
}
