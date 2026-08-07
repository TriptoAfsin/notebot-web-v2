/* Hallmark · nav: N13 inline ⌘K pill · design-system: design.md
 *
 * The header keeps the exact element order and position it had before the
 * redesign — brand hard-left, controls hard-right. What changed: a hairline
 * bottom border that only gains blur once the page has scrolled, morphing
 * toggles instead of icon swaps, and a search pill between the two.
 */

import BrandLogo from "@/components/atoms/brand-logo";
import HeaderLinkMobile from "@/components/atoms/header-link-mobile";
import MenuMorph from "@/components/atoms/icons/morph/menu-morph";
import ThemeMorph from "@/components/atoms/icons/morph/theme-morph";
import CommandPalette, {
  useCommandPalette,
} from "@/components/molecules/command-palette";
import { useTheme } from "@/components/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_HEADER_MENU } from "@/constants/app-config";
import { useGetPlatformStatus } from "@/hooks/networking/content/status";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const menuItems = APP_HEADER_MENU;

const CONTROL = cn(
  "inline-flex items-center justify-center rounded-control border border-rule",
  "bg-paper-2 text-ink-2",
  "transition-[background-color,border-color,transform] duration-short ease-out",
  "hover:border-rule-2 hover:bg-paper-3 active:translate-y-px",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
);

function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: status } = useGetPlatformStatus();
  const palette = useCommandPalette();

  /* The header only earns its blur and shadow once content is behind it. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";
  const isLive = Boolean(status?.botStatus);
  const handleCloseSheet = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-sticky flex h-16 items-center gap-md px-md md:px-lg",
          "border-b border-rule",
          "transition-[background-color,box-shadow,backdrop-filter] duration-short ease-out",
          scrolled
            ? "bg-paper/85 shadow-whisper backdrop-blur-md"
            : "bg-paper"
        )}
      >
        <BrandLogo className="mr-auto block h-10 w-10" width={40} height={40} />

        {/* N13: the pill is visible for newcomers, the shortcut is for everyone
            else. Below sm it collapses to the icon alone. */}
        <button
          type="button"
          onClick={() => palette.setOpen(true)}
          aria-label="Search NoteBot"
          className={cn(
            CONTROL,
            "h-10 gap-sm rounded-full px-2.5 sm:pl-sm sm:pr-2",
            "text-muted-foreground"
          )}
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="affordance hidden text-sm sm:inline">Search</span>
          <span className="label-mono hidden items-center gap-0.5 rounded border border-rule px-1.5 py-0.5 sm:inline-flex">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          aria-pressed={isDark}
          className={cn(CONTROL, "h-10 w-10")}
        >
          <ThemeMorph dark={isDark} />
        </button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className={cn(CONTROL, "h-10 w-10 shrink-0")}
            >
              <MenuMorph open={open} />
            </button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              {/* pr-12 keeps the mark clear of the close button */}
              <div className="pr-12">
                <BrandLogo
                  className="h-16 w-16"
                  width={64}
                  height={64}
                  onNavigate={handleCloseSheet}
                />
              </div>
            </SheetHeader>

            <nav className="-mx-2xs grid gap-3xs">
              {menuItems.map(item => (
                <HeaderLinkMobile
                  key={`${item.id}-${item.label}`}
                  item={item}
                  onSelect={handleCloseSheet}
                />
              ))}
            </nav>

            {/* Status sits where it always did — pinned bottom-right of the
                sheet — but the dot carries the state alongside the word, so it
                doesn't rely on colour alone. */}
            <div className="mt-auto flex items-center gap-xs pt-xl">
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  isLive ? "bg-success" : "bg-danger"
                )}
                aria-hidden="true"
              />
              <span className="label-mono">
                Platform {isLive ? "live" : "down"}
              </span>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />
    </>
  );
}

export default Header;
