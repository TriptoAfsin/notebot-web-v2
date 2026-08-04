/* Hallmark · design-system: design.md
 *
 * A row in the mobile nav sheet. The active route is marked by an accent rail
 * *and* a weight change, not by colour alone. External rows carry the
 * out-arrow so the new-tab jump is never a surprise.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

/** A nav entry from APP_HEADER_MENU. */
export type NavItem = {
  id: number | string;
  label: string;
  href: string;
  icon?: ReactNode;
  isExternal?: boolean;
  children?: Array<{ name: string; href: string }>;
};

const ROW = cn(
  "relative flex items-center gap-sm rounded-control px-sm py-2.5 text-base",
  "text-ink-2 transition-colors duration-short ease-out",
  "hover:bg-paper-3 hover:text-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
);

function ActiveRail() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-signal"
    />
  );
}

function HeaderLinkMobile({
  item,
  onSelect,
}: {
  item: NavItem;
  onSelect: () => void;
}) {
  const location = useLocation();
  const fullPath = location.pathname + location.search;

  if (item.children) {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem
          value={`item-${item.label}`}
          className="border-none shadow-none"
        >
          <AccordionTrigger className="px-sm py-2.5 text-base font-normal hover:no-underline">
            <span className="flex items-center gap-sm">
              {item.icon}
              {item.label}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            {item.children.map(child => {
              const isActive = fullPath === child.href;
              return (
                <Link
                  key={child.name}
                  to={child.href}
                  viewTransition
                  onClick={onSelect}
                  className={cn(
                    ROW,
                    "pl-xl",
                    isActive && "font-semibold text-foreground"
                  )}
                >
                  {isActive ? <ActiveRail /> : null}
                  {child.name}
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
        className={ROW}
      >
        <span className="shrink-0 text-muted-foreground">{item.icon}</span>
        <span className="affordance min-w-0 flex-1 truncate">{item.label}</span>
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </a>
    );
  }

  const isActive = fullPath === item.href;

  return (
    <Link
      to={item.href}
      viewTransition
      onClick={onSelect}
      aria-current={isActive ? "page" : undefined}
      className={cn(ROW, isActive && "bg-paper-3 font-semibold text-foreground")}
    >
      {isActive ? <ActiveRail /> : null}
      <span
        className={cn(
          "shrink-0",
          isActive ? "text-signal" : "text-muted-foreground"
        )}
      >
        {item.icon}
      </span>
      <span className="affordance min-w-0 flex-1 truncate">{item.label}</span>
    </Link>
  );
}

export default HeaderLinkMobile;
