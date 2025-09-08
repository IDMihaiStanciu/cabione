import { create } from 'zustand';
import type { PBRMaterial } from '../types/materials.ts';

type MaterialStore = {
  materialLibrary: Record<string, PBRMaterial>;
  getMaterialForFinish: (finishName: string) => PBRMaterial | null;
  getAvailableFinishes: () => string[];
};

export const useMaterialStore = create<MaterialStore>()(() => {
  const materialLibrary: Record<string, PBRMaterial> = {
    oak: {
      name: 'Oak Veneer',
      color: '#D2B48C',
      metalness: 0.0,
      roughness: 0.7,
      diffuseMapUrl: '/textures/oak/diffuse.jpg',
      normalMapUrl: '/textures/oak/normal.jpg',
    },
    'blue-RAL5024': {
      name: 'Blue RAL5024',
      color: '#1E3A8A',
      metalness: 0.0,
      roughness: 0.3,
    },
  };

  return {
    materialLibrary,
    getMaterialForFinish: (finishName) => materialLibrary[finishName] || null,
    getAvailableFinishes: () => Object.keys(materialLibrary),
  };
});
