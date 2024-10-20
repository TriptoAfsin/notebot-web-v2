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
};

export default function IconLinkButton({
  label,
  icon,
  path,
  className,
  labelClassName,
  iconClassName,
  size = "regular",
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
        "flex flex-col items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors aspect-square",
        sizeClasses[size],
        className
      )}
    >
      <Box className={cn("text-gray-600", iconClassName)}>{icon}</Box>
      <span className={cn("mt-1 text-gray-800", labelClassName)}>{label}</span>
    </Link>
  );
}
