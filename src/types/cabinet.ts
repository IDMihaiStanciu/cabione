import { z } from 'zod';

const BayConfigSchema = z.object({
  hasDoor: z.boolean(),
  shelfCount: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

const WoodFinishSchema = z.enum(['maple', 'cherry', 'oak', 'american-walnut']);
const PaintFinishSchema = z.enum([
  'blue-RAL5024',
  'turquoise-RAL6034',
  'red-RAL3014',
  'white-RAL9003',
  'green-RAL6019',
  'grey-RAL7016',
]);

const FinishSchema = z.union([WoodFinishSchema, PaintFinishSchema]);

const CabinetConfigSchema = z.object({
  dimensions: z.object({
    widthX: z.number().min(300).max(2700),
    heightY: z.number().min(300).max(1600),
    depthZ: z.number().min(300).max(650),
  }),
  bays: z.object({
    count: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    configs: z.array(BayConfigSchema).min(1).max(3),
  }),
  finishes: z.object({
    carcase: FinishSchema,
    doors: FinishSchema,
  }),
});

export type BayConfig = z.infer<typeof BayConfigSchema>;
export type CabinetConfig = z.infer<typeof CabinetConfigSchema>;

export {
  BayConfigSchema,
  CabinetConfigSchema,
  FinishSchema,
  WoodFinishSchema,
  PaintFinishSchema,
};
