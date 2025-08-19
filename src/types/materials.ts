import { z } from "zod";

const PBRMaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  metalness: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  diffuseMapUrl: z.string().optional(),
  normalMapUrl: z.string().optional(),
});

export type PBRMaterial = z.infer<typeof PBRMaterialSchema>;
export { PBRMaterialSchema };
