/* Hallmark · nav: N13 inline ⌘K pill · design-system: design.md
 *
 * The header keeps the exact element order and position it had before the
 * redesign — brand hard-left, controls hard-right. What changed: a hairline
 * bottom border that only gains blur once the page has scrolled, morphing
 * toggles instead of icon swaps, and a search pill between the two.
 */

import BrandLogo from "@/components/atoms/brand-logo";
import HeaderLinkMobile from "@/components/atoms/header-link-mobile";
import { GithubMark, PatreonMark } from "@/components/atoms/icons/brand-marks";
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
import { APP_CONFIG, APP_HEADER_MENU } from "@/constants/app-config";
import { useGithubStars } from "@/hooks/networking/content/github-stars";
import { useGetPlatformStatus } from "@/hooks/networking/content/status";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Coffee, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const menuItems = APP_HEADER_MENU;

const CONTROL = cn(
  "inline-flex items-center justify-center rounded-control border border-rule",
  "bg-paper-2 text-ink-2",
  "transition-[background-color,border-color,transform] duration-short ease-out",
  "hover:border-rule-2 hover:bg-paper-3 active:translate-y-px",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
);

const SUPPORT_ROW = cn(
  "flex items-center gap-sm rounded-control px-sm py-1.5 min-h-[52px]",
  "transition-colors duration-short ease-out hover:bg-paper-3",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
);

function SupportLink({
  href,
  icon,
  label,
  detail,
  onSelect,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  detail: string;
  onSelect: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onSelect}
      className={SUPPORT_ROW}
    >
      <span className="flex w-[18px] shrink-0 justify-center">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="affordance truncate text-base font-medium text-ink-2">
          {label}
        </span>
        <span className="truncate text-sm text-muted-foreground">{detail}</span>
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    </a>
  );
}

function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: status } = useGetPlatformStatus();
  const { data: stars } = useGithubStars();
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

          <SheetContent side="right" className="overflow-y-auto">
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

            <section
              aria-label="Support NoteBot"
              className="-mx-2xs mt-lg grid gap-3xs border-t border-rule pt-md"
            >
              <span className="label-mono px-sm pb-2xs">Support NoteBot</span>
              <SupportLink
                href={APP_CONFIG.support.github}
                icon={<GithubMark className="h-[18px] w-[18px] text-foreground" />}
                label="Star on GitHub"
                detail={
                  typeof stars === "number"
                    ? `The engine is open source · ${stars} ${stars === 1 ? "star" : "stars"}`
                    : "The engine is open source"
                }
                onSelect={handleCloseSheet}
              />
              <SupportLink
                href={APP_CONFIG.support.patreon}
                icon={<PatreonMark className="h-[17px] w-[17px] text-patreon" />}
                label="Back us on Patreon"
                detail="Monthly support keeps servers on"
                onSelect={handleCloseSheet}
              />
              <SupportLink
                href={APP_CONFIG.support.supportKori}
                icon={
                  <Coffee
                    className="h-[18px] w-[18px] text-tip"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                }
                label="Tip in taka"
                detail="As much as you can, on SupportKori"
                onSelect={handleCloseSheet}
              />
            </section>

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
              <a
                href="https://status.butexnotebot.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseSheet}
                className={cn(
                  "label-mono ml-auto inline-flex items-center gap-0.5 rounded-control px-2xs py-0.5",
                  "text-muted-foreground transition-colors duration-short ease-out",
                  "hover:text-foreground",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                )}
              >
                Status
                <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />
    </>
  );
}

export default Header;
