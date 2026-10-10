import type { Song } from "../../model";
import { BUNDLED_SONGS } from "../../songs";

export function handler(): readonly Song[] {
  return BUNDLED_SONGS;
}
