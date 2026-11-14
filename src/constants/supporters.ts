/* The NoteBot supporters wall.
 *
 * People who bought the NoteBot Supporter Pack on SupportKori email the name
 * they want shown. Add it here, newest last, then deploy. "Anonymous" entries
 * are counted but not named. Never add a name nobody asked for.
 */

export type Supporter = {
  /** As the supporter asked for it to appear. */
  name: string;
  /** Year and month they supported, "2026-11". */
  since: string;
  anonymous?: boolean;
};

export const SUPPORTERS: readonly Supporter[] = [];

export const SUPPORTER_PACK_URL = "https://www.supportkori.com/triptex";
