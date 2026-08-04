/* Hallmark · design-system: design.md
 *
 * The "you" avatar on the Tex-GPT transcript. Previously a hairline grey circle
 * with a thin outline glyph, which read as a disabled control rather than a
 * person.
 *
 * Now a gradient chip with a solid silhouette. The gradient is identity, not
 * decoration — the design system's gradient ban covers headlines and hero
 * backgrounds, not an avatar. Both stops are tokens (`--c-avatar-from` /
 * `--c-avatar-to`), so it re-lights with the theme.
 */

import { cn } from "@/lib/utils";

export default function UserAvatar({
  className,
  title = "You",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={cn(
        // the inner rim highlight comes from the gloss token, not an inline white
        "avatar-gradient avatar-rim grid h-8 w-8 place-items-center rounded-full shadow-whisper",
        className
      )}
      role="img"
      aria-label={title}
    >
      {/* solid silhouette, not an outline — reads at 32px where a 1.5px stroke
          starts to disappear */}
      <svg
        viewBox="0 0 24 24"
        className="h-[62%] w-[62%]"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="8.4" r="4.1" />
        <path d="M12 14.2c-4.3 0-7.6 2.4-7.6 5.4 0 .8.7 1.4 1.6 1.4h12c.9 0 1.6-.6 1.6-1.4 0-3-3.3-5.4-7.6-5.4z" />
      </svg>
    </span>
  );
}
