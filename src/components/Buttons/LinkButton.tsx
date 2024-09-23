import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  href: string;
  title?: string;
  className?: string;
};

function LinkButton({
  href = "#",
  title = "Link Button",
  className = "",
}: Props &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <Link to={href}>
      <Button className={className}>{title}</Button>
    </Link>
  );
}

export default LinkButton;
