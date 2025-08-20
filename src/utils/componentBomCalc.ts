import type { CabinetConfig, ComponentBOM } from '@/types';
import { WoodFinishSchema } from '@/types';

export function calculateComponentBOM(config: CabinetConfig): ComponentBOM[] {
  const components: ComponentBOM[] = [];

  const sideboard = {
    fixed: [
      'top-panel',
      'bottom-panel',
      'back-panel',
      'left-side-panel',
      'right-side-panel',
    ],
    variable: ['door', 'shelf', 'divider-panel'],
  } as const;

  const panelThickness = {
    carcasePanel: 28,
    door: 18,
    doorFrontClearence: 2,
    doorLoftClearence: 3,
    backPanel: 8,
    backPanelClearence: 10,
    backPanelGrooveDepth: 10,
    frontClearence: 20,
    interiorPanel: 18,
  };

  const panelSpecs = {
    'top-panel': {
      length: config.dimensions.widthX - 2 * panelThickness.carcasePanel,
      width: config.dimensions.widthZ,
      thickness: panelThickness.carcasePanel,
    },
    'bottom-panel': {
      length: config.dimensions.widthX - 2 * panelThickness.carcasePanel,
      width: config.dimensions.widthZ,
      thickness: panelThickness.carcasePanel,
    },
    'left-side-panel': {
      length: config.dimensions.widthY,
      width: config.dimensions.widthZ,
      thickness: panelThickness.carcasePanel,
    },
    'right-side-panel': {
      length: config.dimensions.widthY,
      width: config.dimensions.widthZ,
      thickness: panelThickness.carcasePanel,
    },
    'back-panel': {
      length:
        config.dimensions.widthX -
        (panelThickness.carcasePanel - panelThickness.backPanelGrooveDepth) * 2,
      width:
        config.dimensions.widthY -
        (panelThickness.carcasePanel - panelThickness.backPanelGrooveDepth) * 2,
      thickness: panelThickness.backPanel,
    },
  } as const;

  function getMaterialType(finish: string): 'natural-wood' | 'mdf' {
    return WoodFinishSchema.safeParse(finish).success ? 'natural-wood' : 'mdf';
  }

  function calculatePrice(
    dimensions: { length: number; width: number; thickness: number },
    finish: string
  ): number {
    const materialType = getMaterialType(finish);
    if (materialType === 'mdf') {
      const surface = (dimensions.length * dimensions.width) / 1000000;
      const mdfPrice = 120;
      return surface * mdfPrice;
    }
    const volume =
      (dimensions.length * dimensions.width * dimensions.thickness) /
      1000000000;
    const woodPrices = {
      maple: 600,
      cherry: 800,
      oak: 700,
      'american-walnut': 1200,
    } as const;
    return volume * (woodPrices[finish as keyof typeof woodPrices] || 700);
  }

  const fixedComponents = sideboard.fixed.map((panel) => {
    const specs = panelSpecs[panel];
    const pricePerUnit = calculatePrice(specs, config.finishes.carcase);

    return {
      id: `${panel}-001`,
      type: 'component' as const,
      name: panel,
      ...panelSpecs[panel],
      quantity: 1,
      material: getMaterialType(config.finishes.carcase),
      finish: config.finishes.carcase,
      pricePerUnit,
      totalCost: pricePerUnit,
    };
  });

  let doorCount = 0;
  let totalShelfCount = 0;

  for (const bay of config.bays.configs) {
    if (bay.hasDoor) doorCount++;
    totalShelfCount += bay.shelfCount;
  }

  const dividerCount = config.bays.count - 1;

  const variableComponents: ComponentBOM[] = [];

  if (doorCount > 0) {
    const doorWidth =
      (config.dimensions.widthX -
        panelThickness.carcasePanel * 2 -
        panelThickness.doorLoftClearence * (config.bays.count + 1)) /
      config.bays.count;
    const pricePerUnit = calculatePrice(
      {
        length: doorWidth,
        width:
          config.dimensions.widthY -
          panelThickness.carcasePanel * 2 -
          panelThickness.doorLoftClearence * 2,
        thickness: panelThickness.door,
      },
      config.finishes.doors
    );

    variableComponents.push({
      id: 'door-001',
      type: 'component' as const,
      name: 'door',
      length: doorWidth,
      width:
        config.dimensions.widthY -
        panelThickness.carcasePanel * 2 -
        panelThickness.doorLoftClearence * 2,
      thickness: panelThickness.door,
      quantity: doorCount,
      material: getMaterialType(config.finishes.doors),
      finish: config.finishes.doors,
      pricePerUnit,
      totalCost: doorCount * pricePerUnit,
    });
  }

  if (totalShelfCount > 0) {
    const bayWidth =
      config.dimensions.widthX -
      panelThickness.carcasePanel * 2 -
      (panelThickness.interiorPanel * config.bays.count - 1) /
        config.bays.count;
    const shelfWidth = bayWidth;
    const shelfDepth =
      config.dimensions.widthZ -
      panelThickness.backPanelClearence -
      panelThickness.backPanel -
      panelThickness.door -
      panelThickness.doorFrontClearence -
      panelThickness.frontClearence;
    const pricePerUnit = calculatePrice(
      {
        length: shelfWidth,
        width: shelfDepth,
        thickness: panelThickness.interiorPanel,
      },
      config.finishes.carcase
    );

    variableComponents.push({
      id: 'shelf-001',
      type: 'component' as const,
      name: 'shelf',
      length: shelfWidth,
      width: shelfDepth,
      thickness: panelThickness.interiorPanel,
      quantity: totalShelfCount,
      material: getMaterialType(config.finishes.carcase),
      finish: config.finishes.carcase,
      pricePerUnit,
      totalCost: totalShelfCount * pricePerUnit,
    });
  }

  if (dividerCount > 0) {
    const dividerHeight =
      config.dimensions.widthY - panelThickness.carcasePanel * 2;
    const dividerDepth =
      config.dimensions.widthZ -
      panelThickness.frontClearence -
      panelThickness.doorFrontClearence -
      panelThickness.door -
      panelThickness.backPanel -
      panelThickness.backPanelClearence;
    const pricePerUnit = calculatePrice(
      {
        length: dividerHeight,
        width: dividerDepth,
        thickness: panelThickness.interiorPanel,
      },
      config.finishes.carcase
    );
    variableComponents.push({
      id: 'divider-001',
      type: 'component' as const,
      name: 'divider-panel',
      length: dividerHeight,
      width: dividerDepth,
      thickness: panelThickness.interiorPanel,
      quantity: dividerCount,
      material: getMaterialType(config.finishes.carcase),
      finish: config.finishes.carcase,
      pricePerUnit,
      totalCost: dividerCount * pricePerUnit,
    });
  }
  components.push(...fixedComponents, ...variableComponents);

  return components;
}
