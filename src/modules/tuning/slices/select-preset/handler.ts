import { PRESETS } from "../../model";
import type { Preset, PresetName } from "../../model";

export function handler(name: PresetName = "standard"): Preset {
  return PRESETS[name];
}
