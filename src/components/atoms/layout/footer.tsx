/* Hallmark · footer: Ft2 inline single line · design-system: design.md
 *
 * Same three pieces of information as before, in the same left/right split, but
 * on the paper ramp with a hairline rule above instead of a grey slab. The band
 * was a 40px sliver; it now carries real vertical rhythm, and the shell's flex
 * column means there's no dead strip beneath it.
 */

import AppLink from "@/components/atoms/links/app-link";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { cn } from "@/lib/utils";

/* Drawn at 20x14. The source was a 512px PNG at 6.1 KiB — every byte of it
 * wasted on a flag the size of a word. 460 B at 1x, 622 B at 2x. */
const PALESTINE_FLAG = "/icons/palestine-flag-40.webp";
const PALESTINE_FLAG_SRCSET =
  "/icons/palestine-flag-40.webp 40w, /icons/palestine-flag-80.webp 80w";

const LEGAL_LINKS = [
  { label: "Privacy", href: APP_PATHS.PRIVACY },
  { label: "Terms", href: APP_PATHS.TERMS },
] as const;

export default function Footer() {
  return (
    <footer className="mt-2xl border-t border-rule bg-paper-2">
      <div
        className={cn(
          "container flex flex-col items-center gap-md px-md py-lg md:px-lg",
          "sm:flex-row sm:justify-between sm:gap-lg"
        )}
        // clears the home-indicator / system nav bar in the installed PWA
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        {/* copyright and the legal pair travel together — one line on the left,
            below the fold on mobile */}
        <div className="order-2 flex flex-wrap items-center justify-center gap-x-md gap-y-xs sm:order-1 sm:justify-start">
          <p className="label-mono">
            © <span className="tabular">{new Date().getFullYear()}</span>{" "}
            {APP_CONFIG.name}
          </p>

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-rule-2 sm:block"
          />

          <nav aria-label="Legal" className="flex items-center gap-md">
            {LEGAL_LINKS.map(link => (
              <AppLink
                key={link.href}
                to={link.href}
                className={cn(
                  "label-mono affordance inline-block",
                  "transition-colors duration-short ease-out hover:text-foreground"
                )}
              >
                {link.label}
              </AppLink>
            ))}
          </nav>
        </div>

        <div
          className={cn(
            "order-1 flex flex-col items-center gap-sm text-center",
            "sm:order-2 sm:flex-row sm:gap-md sm:text-left"
          )}
        >
          <a
            href={APP_CONFIG.founder.web}
            target="_blank"
            rel="noopener noreferrer"
            className="affordance link-accent text-sm font-medium"
          >
            Built by {APP_CONFIG.founder.name}
          </a>

          {/* hairline divider, desktop only — the stack carries the split on mobile */}
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-rule-2 sm:block"
          />

          <span className="flex items-center gap-xs text-sm text-muted-foreground">
            Solidarity with Palestine
            <img
              src={PALESTINE_FLAG}
              srcSet={PALESTINE_FLAG_SRCSET}
              sizes="20px"
              alt="Flag of Palestine"
              width={20}
              height={14}
              loading="lazy"
              decoding="async"
              className="h-3.5 w-5 rounded-[2px] object-cover"
            />
          </span>
        </div>
      </div>
    </footer>
  );
}
