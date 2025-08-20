import type { CabinetConfig } from "@/types";
import { WoodFinishSchema, PaintFinishSchema } from "@/types";

export function validateBayConfiguration(bays: CabinetConfig["bays"]): boolean {
  return bays.count === bays.configs.length;
}

export function validateMaterialFinish(
  material: string,
  finish: string
): boolean {
  if (WoodFinishSchema.safeParse(finish).success) {
    return material === "natural-wood";
  }
  if (PaintFinishSchema.safeParse(finish).success) {
    return material === "mdf";
  }
  return false;
}
