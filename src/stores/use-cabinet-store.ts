import { create } from 'zustand';
import type { CabinetConfig, BayConfig } from '../types/cabinet.ts';

type CabinetStore = {
  dimensions: CabinetConfig['dimensions'];
  bays: CabinetConfig['bays'];
  finishes: CabinetConfig['finishes'];
  updateDimensions: (dimensions: Partial<CabinetConfig['dimensions']>) => void;
  updateBayCount: (count: 1 | 2 | 3) => void;
  updateBayConfig: (bayIndex: number, config: Partial<BayConfig>) => void;
  updateFinishes: (finishes: Partial<CabinetConfig['finishes']>) => void;
};

export const useCabinetStore = create<CabinetStore>()((set) => ({
  dimensions: {
    widthX: 1200,
    heightY: 800,
    depthZ: 400,
  },
  bays: {
    count: 2,
    configs: [
      { hasDoor: true, shelfCount: 1 },
      { hasDoor: true, shelfCount: 1 },
    ],
  },
  finishes: {
    carcase: 'oak',
    doors: 'red-RAL3014',
  },
  updateDimensions: (dimensions) =>
    set((state) => ({
      ...state,
      dimensions: { ...state.dimensions, ...dimensions },
    })),
  updateBayCount: (count) =>
    set((state) => {
      const newConfigs = [...state.bays.configs];

      while (newConfigs.length < count) {
        newConfigs.push({ hasDoor: false, shelfCount: 0 });
      }

      if (newConfigs.length > count) {
        newConfigs.splice(count);
      }

      return {
        ...state,
        bays: { count, configs: newConfigs },
      };
    }),

  updateBayConfig: (bayIndex, config) =>
    set((state) => {
      const newConfigs = [...state.bays.configs];
      newConfigs[bayIndex] = { ...newConfigs[bayIndex], ...config };

      return {
        ...state,
        bays: { ...state.bays, configs: newConfigs },
      };
    }),
  updateFinishes: (finishes) =>
    set((state) => ({
      ...state,
      finishes: { ...state.finishes, ...finishes },
    })),
}));
