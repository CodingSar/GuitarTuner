import type { Song } from "../../model";

export type ValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly noteIndex: number;
      readonly message: string;
    };

export function handler(song: Song): ValidationResult {
  throw new Error("not implemented");
}
