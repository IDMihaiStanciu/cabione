import { z } from "zod";
import { FinishSchema } from "./cabinet";

const ComponentBOMSchema = z.object({
  id: z.string(),
  type: z.literal("component"),
  name: z.enum([
    "left-side-panel",
    "right-side-panel",
    "door",
    "shelf",
    "back-panel",
    "top-panel",
    "bottom-panel",
    "divider-panel",
  ]),
  length: z.number().positive(),
  width: z.number().positive(),
  thickness: z.number().positive(),
  quantity: z.number().int().positive(),
  material: z.enum(["natural-wood", "mdf"]),
  finish: FinishSchema,
  pricePerUnit: z.number().nonnegative(),
  totalCost: z.number().nonnegative(),
});

const HardwareBOMSchema = z.object({
  id: z.string(),
  type: z.literal("hardware"),
  itemName: z.string(),
  productCode: z.string(),
  quantity: z.number().int().positive(),
  supplier: z.string(),
  pricePerSKU: z.number().nonnegative(),
  totalCost: z.number().nonnegative(),
});

const BOMSchema = z.union([ComponentBOMSchema, HardwareBOMSchema]);

export type ComponentBOM = z.infer<typeof ComponentBOMSchema>;
export type HardwareBOM = z.infer<typeof HardwareBOMSchema>;
export type BOM = z.infer<typeof BOMSchema>;

export { ComponentBOMSchema, HardwareBOMSchema, BOMSchema };
