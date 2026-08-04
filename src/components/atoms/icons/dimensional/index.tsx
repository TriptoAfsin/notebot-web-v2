/* Hallmark · design-system: design.md · enrichment: Tier-B authored 3D SVG
 *
 * The dimensional icon set — authored, chunky, glossy 3/4-view glyphs.
 *
 * Every icon follows the same build so the set reads as one family:
 *   1. a contact shadow (from <Glyph>), so it sits on the tile
 *   2. an extruded depth layer — the same silhouette, offset +3y, in `bodyDark`
 *   3. the body, on a two-stop gradient lit from the upper left
 *   4. white `paper` details, which stay light in both themes
 *   5. a `sheen` pass re-using the body's own path, for the gloss
 *
 * What differs per icon is the SILHOUETTE and the HUE. Nothing else.
 */

import { Glyph, type Fills, type GlyphProps } from "./glyph";

/* Hues spaced round the wheel so no two launcher neighbours collide.
 * Notes keeps the inherited NoteBot blue. */
export const ICON_HUE = {
  notes: 252, // brand blue
  labs: 195, // cyan
  qbank: 300, // violet
  syllabus: 85, // amber
  results: 150, // green
  submit: 35, // orange
  phoneBook: 12, // rose
  converter: 225, // azure
  jokes: 65, // yellow
  layers: 252,
  folder: 252,
} as const;

/* -- Notes ---------------------------------------------------------------
 * A fanned stack of notebooks with a ruled page showing. */
export function NotesIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.notes}
      paint={(f: Fills) => (
        <>
          <g transform="rotate(-11 32 34)">
            <rect x="18" y="11" width="29" height="39" rx="5" fill={f.bodyLight} />
          </g>
          <g transform="rotate(-5.5 32 34)">
            <rect x="16" y="11" width="32" height="40" rx="5.5" fill={f.bodyDeep} />
          </g>
          <rect x="14" y="15" width="36" height="40" rx="6.5" fill={f.bodyDark} />
          <rect x="14" y="12" width="36" height="40" rx="6.5" fill={f.body} />
          <rect x="19.5" y="18" width="25" height="27" rx="3.5" fill={f.paper} />
          <rect x="23" y="24" width="18" height="3" rx="1.5" fill={f.bodyDeep} />
          <rect x="23" y="30" width="12.5" height="3" rx="1.5" fill={f.paperShade} />
          <rect x="23" y="36" width="15.5" height="3" rx="1.5" fill={f.paperShade} />
          <rect x="14" y="12" width="36" height="40" rx="6.5" fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Lab Reports --------------------------------------------------------
 * A clipboard: metal clip, ruled page, and a completed check. */
export function LabReportsIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.labs}
      paint={(f: Fills) => (
        <>
          <rect x="13" y="15" width="38" height="41" rx="7" fill={f.bodyDark} />
          <rect x="13" y="12" width="38" height="41" rx="7" fill={f.body} />
          <rect x="19" y="19" width="26" height="28" rx="4" fill={f.paper} />
          <rect x="23" y="25" width="18" height="2.8" rx="1.4" fill={f.paperShade} />
          <rect x="23" y="30.5" width="12" height="2.8" rx="1.4" fill={f.paperShade} />
          <path
            d="M24 39.5l4.3 4.3L38 34.5"
            fill="none"
            stroke={f.bodyDeep}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="25.5" y="6" width="13" height="9.5" rx="3.5" fill={f.bodyDeep} />
          <rect x="28.5" y="3" width="7" height="6.5" rx="3.25" fill={f.bodyLight} />
          <rect x="13" y="12" width="38" height="41" rx="7" fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Q-Bank -------------------------------------------------------------
 * A shuffled deck of question cards. */
export function QBankIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.qbank}
      paint={(f: Fills) => (
        <>
          <g transform="rotate(12 32 34)">
            <rect x="20" y="12" width="27" height="37" rx="6" fill={f.bodyLight} />
          </g>
          <g transform="rotate(6 32 34)">
            <rect x="17.5" y="12" width="30" height="38" rx="6" fill={f.bodyDeep} />
          </g>
          <rect x="14.5" y="17" width="34" height="38" rx="7" fill={f.bodyDark} />
          <rect x="14.5" y="14" width="34" height="38" rx="7" fill={f.body} />
          <path
            d="M26.2 27.4a5.6 5.6 0 118.3 4.9c-1.9 1.3-2.6 2.3-2.6 4"
            fill="none"
            stroke={f.paper}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          <circle cx="31.9" cy="43" r="2.8" fill={f.paper} />
          <rect x="14.5" y="14" width="34" height="38" rx="7" fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Syllabus -----------------------------------------------------------
 * An open book with a ribbon marker. */
const BOOK_RIGHT = "M58 20q0-4.2-4.4-3.1L33 22.3v32.5l20.6-5Q58 48.6 58 44.4z";

export function SyllabusIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.syllabus}
      paint={(f: Fills) => (
        <>
          {/* covers */}
          <path
            d="M6 20q0-4.2 4.4-3.1L31 22.3v32.5l-20.6-5Q6 48.6 6 44.4z"
            fill={f.bodyDeep}
          />
          <path d={BOOK_RIGHT} fill={f.body} />
          {/* leaves */}
          <path d="M10.8 22.6L30 27.2v24.4l-19.2-4.6z" fill={f.paperShade} />
          <path d="M53.2 22.6L34 27.2v24.4l19.2-4.6z" fill={f.paper} />
          <rect
            x="37"
            y="31"
            width="13"
            height="2.6"
            rx="1.3"
            fill={f.paperShade}
            transform="rotate(-6 37 31)"
          />
          <rect
            x="37"
            y="37"
            width="9.5"
            height="2.6"
            rx="1.3"
            fill={f.paperShade}
            transform="rotate(-6 37 37)"
          />
          {/* spine + ribbon */}
          <rect x="30.4" y="21.5" width="3.2" height="33.5" rx="1.6" fill={f.bodyDark} />
          <path d="M44.5 24.2v14l-3.4-3-3.4 3v-14z" fill={f.bodyLight} />
          <path d={BOOK_RIGHT} fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Results ------------------------------------------------------------
 * A results card with three ascending bars. */
export function ResultsIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.results}
      paint={(f: Fills) => (
        <>
          <rect x="8" y="15" width="48" height="39" rx="9" fill={f.bodyDark} />
          <rect x="8" y="12" width="48" height="39" rx="9" fill={f.body} />
          <rect x="14" y="18" width="36" height="27" rx="5" fill={f.paper} />
          <rect x="19.5" y="31" width="6" height="9" rx="3" fill={f.bodyDark} />
          <rect x="29" y="26" width="6" height="14" rx="3" fill={f.bodyDeep} />
          <rect x="38.5" y="21.5" width="6" height="18.5" rx="3" fill={f.body} />
          <rect x="8" y="12" width="48" height="39" rx="9" fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Submit Notes -------------------------------------------------------
 * A page dropping into an inbox tray. */
const TRAY_FRONT =
  "M11 37h10.6a3 3 0 012.9 2.2 8 8 0 0015.2 0 3 3 0 012.9-2.2H53v9a8 8 0 01-8 8H19a8 8 0 01-8-8z";

export function SubmitIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.submit}
      paint={(f: Fills) => (
        <>
          <rect x="11" y="30" width="42" height="24" rx="8" fill={f.bodyDark} />
          {/* the arrow sits BEHIND the tray front, so it reads as going in */}
          <rect x="28.5" y="13" width="7" height="20" rx="3.5" fill={f.paper} />
          <path
            d="M32 4l11.2 13.2a2.3 2.3 0 01-1.8 3.8H22.6a2.3 2.3 0 01-1.8-3.8z"
            fill={f.paper}
          />
          <path d={TRAY_FRONT} fill={f.body} />
          <path d={TRAY_FRONT} fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Phone Book ---------------------------------------------------------
 * A handset. Requested over the book-and-avatar first pass. */
export function PhoneBookIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.phoneBook}
      paint={(f: Fills) => (
        <>
          <rect x="16" y="10" width="32" height="47" rx="9" fill={f.bodyDark} />
          <rect x="16" y="7" width="32" height="47" rx="9" fill={f.body} />
          {/* screen */}
          <rect x="20.5" y="14" width="23" height="30" rx="4" fill={f.paper} />
          {/* handset on the screen */}
          <path
            d="M26.4 21.6c-1.3 1.3-1.3 3.4 0 4.7l6.8 6.8c1.3 1.3 3.4 1.3 4.7 0l1.4-1.4a1.7 1.7 0 000-2.4l-2.6-2.6a1.7 1.7 0 00-2.4 0l-.9.9-3.5-3.5.9-.9a1.7 1.7 0 000-2.4l-2.6-2.6a1.7 1.7 0 00-2.4 0z"
            fill={f.bodyDeep}
          />
          {/* earpiece + home pill */}
          <rect x="28" y="9.6" width="8" height="2.2" rx="1.1" fill={f.bodyDeep} />
          <rect x="27" y="47" width="10" height="3" rx="1.5" fill={f.bodyDeep} />
          <rect x="16" y="7" width="32" height="47" rx="9" fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Count Koto ---------------------------------------------------------
 * A calculator. Requested over the yarn-spool first pass. */
export function ConverterIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.converter}
      paint={(f: Fills) => (
        <>
          <rect x="13" y="10" width="38" height="47" rx="8" fill={f.bodyDark} />
          <rect x="13" y="7" width="38" height="47" rx="8" fill={f.body} />
          {/* display */}
          <rect x="18" y="12" width="28" height="11" rx="3.5" fill={f.paper} />
          <rect x="33" y="16" width="9" height="3" rx="1.5" fill={f.paperShade} />
          {/* keypad — the bottom-right key is a tall "=" in the light surface */}
          <g fill={f.bodyDeep}>
            <rect x="18" y="27.5" width="7" height="6" rx="2" />
            <rect x="28.5" y="27.5" width="7" height="6" rx="2" />
            <rect x="18" y="37" width="7" height="6" rx="2" />
            <rect x="28.5" y="37" width="7" height="6" rx="2" />
            <rect x="18" y="46.5" width="7" height="6" rx="2" />
            <rect x="28.5" y="46.5" width="7" height="6" rx="2" />
          </g>
          <rect x="39" y="27.5" width="7" height="25" rx="2.5" fill={f.bodyLight} />
          <rect x="13" y="7" width="38" height="47" rx="8" fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Jokes --------------------------------------------------------------
 * A speech bubble with a face. */
const BUBBLE =
  "M14 10h36a8 8 0 018 8v17a8 8 0 01-8 8H32l-9.5 8.6V43H14a8 8 0 01-8-8V18a8 8 0 018-8z";

export function JokesIcon(props: GlyphProps) {
  return (
    <Glyph
      {...props}
      hue={ICON_HUE.jokes}
      paint={(f: Fills) => (
        <>
          <g transform="translate(0 3)">
            <path d={BUBBLE} fill={f.bodyDark} />
          </g>
          <path d={BUBBLE} fill={f.body} />
          <circle cx="25" cy="24.5" r="3.5" fill={f.paper} />
          <circle cx="39" cy="24.5" r="3.5" fill={f.paper} />
          <path
            d="M23.5 32.5a9.6 9.6 0 0017 0"
            fill="none"
            stroke={f.paper}
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path d={BUBBLE} fill={f.sheen} />
        </>
      )}
    />
  );
}

/* -- Level --------------------------------------------------------------
 * The level mark: a stack of books, one per year, resting on the ground plane —
 * so the stack's HEIGHT is the level. Level 4 also earns a mortarboard, which
 * carries the "final year" reading the plain stack can't.
 *
 * This replaced the 🧒 👦 🧑 🧑‍🎓 emoji, and then replaced a first attempt at
 * abstract slabs that read as anonymous bars rather than as books.
 */

/** Slight alternating offsets and widths, so the stack reads as hand-stacked. */
const BOOK_WIDTHS = [42, 37, 40, 34] as const;
const BOOK_NUDGE = [-1.5, 2, -1, 1.5] as const;

export function LevelIcon({
  count = 1,
  hue = ICON_HUE.layers,
  ...props
}: GlyphProps & { count?: number; hue?: number }) {
  const n = Math.min(Math.max(Math.round(count), 1), 4);
  const capped = n === 4;
  // tighten the pitch when the mortarboard needs headroom
  const pitch = capped ? 7.6 : 8.6;
  const BOOK_H = 9.4;

  return (
    <Glyph
      {...props}
      hue={hue}
      paint={(f: Fills) => (
        <>
          {capped ? (
            <>
              {/* mortarboard */}
              <path d="M32 4.5l16.5 6.6L32 17.7 15.5 11.1z" fill={f.bodyLight} />
              <path
                d="M24 14.1v4.3c0 2.1 3.6 3.4 8 3.4s8-1.3 8-3.4v-4.3l-8 3.2z"
                fill={f.bodyDeep}
              />
              {/* tassel */}
              <path
                d="M46.5 12v6.4"
                stroke={f.paper}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="46.5" cy="20.4" r="2.1" fill={f.paper} />
            </>
          ) : null}

          {Array.from({ length: n }, (_, i) => {
            const top = 43 - i * pitch;
            const w = BOOK_WIDTHS[i];
            const x = 32 - w / 2 + BOOK_NUDGE[i];
            const isTop = i === n - 1;
            const cover = isTop ? f.body : f.bodyDeep;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={top + 2.6}
                  width={w}
                  height={BOOK_H}
                  rx="2.6"
                  fill={f.bodyDark}
                />
                <rect
                  x={x}
                  y={top}
                  width={w}
                  height={BOOK_H}
                  rx="2.6"
                  fill={cover}
                />
                {/* the page block, inset at the fore-edge */}
                <rect
                  x={x + w - 6.4}
                  y={top + 1.7}
                  width="4.6"
                  height={BOOK_H - 3.4}
                  rx="1.3"
                  fill={f.paper}
                />
                {isTop ? (
                  <rect
                    x={x}
                    y={top}
                    width={w}
                    height={BOOK_H}
                    rx="2.6"
                    fill={f.sheen}
                  />
                ) : null}
              </g>
            );
          })}
        </>
      )}
    />
  );
}

/* -- Folder -------------------------------------------------------------
 * Generic container mark for subject / topic index rows. */
export function FolderIcon({
  hue = ICON_HUE.folder,
  ...props
}: GlyphProps & { hue?: number }) {
  return (
    <Glyph
      {...props}
      hue={hue}
      paint={(f: Fills) => (
        <>
          <path
            d="M8 19a6 6 0 016-6h10.5a4 4 0 013 1.4l3.2 3.6H50a6 6 0 016 6v4H8z"
            fill={f.bodyDeep}
          />
          <rect x="8" y="26" width="48" height="27" rx="7" fill={f.bodyDark} />
          <rect x="8" y="23" width="48" height="27" rx="7" fill={f.body} />
          <rect x="8" y="23" width="48" height="27" rx="7" fill={f.sheen} />
        </>
      )}
    />
  );
}
