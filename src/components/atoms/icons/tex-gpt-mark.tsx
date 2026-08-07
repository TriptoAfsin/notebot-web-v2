import { cn } from "@/lib/utils";

/* Tex-GPT keeps its original NoteBot-face mark rather than an authored glyph —
 * it's the product's own character and the set is better for having one.
 *
 * The source asset was a 1.1 MB PNG at full resolution, which the launcher was
 * downloading to draw at 72px. It now points at two WebP widths and declares its
 * intrinsic size so it can't shift layout.
 *
 * `sizes` defaults to the largest place it appears (the 96px hero on the Tex-GPT
 * page); the 32px avatars on that same page reuse the file the hero already
 * fetched, so aiming at the big one costs nothing.
 */
export default function TexGptMark({
  className,
  title,
  sizes = "96px",
}: {
  className?: string;
  title?: string;
  sizes?: string;
}) {
  return (
    <img
      src="/icons/tex-gpt-256.webp"
      srcSet="/icons/tex-gpt-128.webp 128w, /icons/tex-gpt-256.webp 256w"
      sizes={sizes}
      alt={title ?? ""}
      width={256}
      height={256}
      loading="lazy"
      decoding="async"
      className={cn("object-contain", className)}
    />
  );
}
