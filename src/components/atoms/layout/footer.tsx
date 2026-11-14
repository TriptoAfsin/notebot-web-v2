/* Hallmark · footer: Ft2 inline single line · design-system: design.md
 *
 * A support row (GitHub star, Patreon, SupportKori) now sits above the line.
 *
 * Same three pieces of information as before, in the same left/right split, but
 * on the paper ramp with a hairline rule above instead of a grey slab. The band
 * was a 40px sliver; it now carries real vertical rhythm, and the shell's flex
 * column means there's no dead strip beneath it.
 */

import { GithubMark, PatreonMark } from "@/components/atoms/icons/brand-marks";
import AppLink from "@/components/atoms/links/app-link";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { useGithubStars } from "@/hooks/networking/content/github-stars";
import { cn } from "@/lib/utils";
import { Coffee, Star } from "lucide-react";

/* Drawn at 20x14. The source was a 512px PNG at 6.1 KiB — every byte of it
 * wasted on a flag the size of a word. 460 B at 1x, 622 B at 2x. */
const PALESTINE_FLAG = "/icons/palestine-flag-40.webp";
const PALESTINE_FLAG_SRCSET =
  "/icons/palestine-flag-40.webp 40w, /icons/palestine-flag-80.webp 80w";

const LEGAL_LINKS = [
  { label: "Settings", href: APP_PATHS.SETTINGS },
  { label: "Privacy", href: APP_PATHS.PRIVACY },
  { label: "Terms", href: APP_PATHS.TERMS },
] as const;

const SUPPORT_LINK = cn(
  "affordance group inline-flex items-center gap-xs rounded-control px-2xs py-1.5",
  "text-sm font-medium text-ink-2 transition-colors duration-short ease-out",
  "hover:text-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
);

const SUPPORT_LABEL = cn(
  "decoration-signal underline-offset-4 group-hover:underline"
);

function Divider() {
  return (
    <span aria-hidden="true" className="hidden h-4 w-px bg-rule-2 sm:block" />
  );
}

/* The ask: one quiet line above the legal row. Hidden count until GitHub
   answers, so a rate-limited visitor never sees a wrong or zero number. */
function SupportRow() {
  const { data: stars } = useGithubStars();

  return (
    <div
      className={cn(
        "container flex flex-col items-center gap-sm border-b border-rule px-md py-md text-center md:px-lg",
        "lg:flex-row lg:justify-between lg:gap-lg lg:text-left"
      )}
    >
      <p className="text-sm text-muted-foreground">
        NoteBot is free and open source. Help keep it running, like{" "}
        <AppLink
          to={APP_PATHS.SUPPORTERS}
          className="inline link-accent font-medium"
        >
          our supporters
        </AppLink>
        .
      </p>

      <nav
        aria-label="Support NoteBot"
        className="flex flex-wrap items-center justify-center gap-x-md gap-y-2xs"
      >
        <a
          href={APP_CONFIG.support.github}
          target="_blank"
          rel="noopener noreferrer"
          className={SUPPORT_LINK}
        >
          <GithubMark className="h-4 w-4 shrink-0 text-foreground" />
          <span className={SUPPORT_LABEL}>Star on GitHub</span>
          {typeof stars === "number" ? (
            <span
              className="label-mono tabular inline-flex items-center gap-0.5 rounded-[6px] border border-rule px-1.5 py-0.5"
              aria-label={`${stars} stars`}
            >
              <Star className="h-3 w-3" aria-hidden="true" />
              {stars}
            </span>
          ) : null}
        </a>

        <Divider />

        <a
          href={APP_CONFIG.support.patreon}
          target="_blank"
          rel="noopener noreferrer"
          className={SUPPORT_LINK}
        >
          <PatreonMark className="h-[15px] w-[15px] shrink-0 text-patreon" />
          <span className={SUPPORT_LABEL}>Back us on Patreon</span>
        </a>

        <Divider />

        <a
          href={APP_CONFIG.support.supportKori}
          target="_blank"
          rel="noopener noreferrer"
          className={SUPPORT_LINK}
        >
          <Coffee
            className="h-4 w-4 shrink-0 text-tip"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className={SUPPORT_LABEL}>Tip in taka on SupportKori</span>
        </a>
      </nav>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-2xl border-t border-rule bg-paper-2">
      <SupportRow />
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

          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-md gap-y-xs"
          >
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
            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className={cn(
                "label-mono affordance inline-block",
                "transition-colors duration-short ease-out hover:text-foreground"
              )}
            >
              Support
            </a>
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
