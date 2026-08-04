import { cn } from "@/lib/utils";

/* Tex-GPT keeps its original NoteBot-face mark rather than an authored glyph —
 * it's the product's own character and the set is better for having one.
 *
 * The source asset was a 1.1 MB PNG at full resolution, which the launcher was
 * downloading to draw at 72px. This points at a 256px re-encode (8.6 KB) and
 * declares its intrinsic size so it can't shift layout.
 */
export default function TexGptMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <img
      src="/icons/tex-gpt-256.png"
      alt={title ?? ""}
      width={256}
      height={256}
      loading="lazy"
      decoding="async"
      className={cn("object-contain", className)}
    />
  );
}
