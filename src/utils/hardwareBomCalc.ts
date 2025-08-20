import type { ComponentBOM, HardwareBOM } from '@/types';

export function calculateHardwareBOM(
  components: ComponentBOM[]
): HardwareBOM[] {
  const componentCounts = components.reduce(
    (acc, component) => {
      acc[component.name] = component.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  const hardwareItems: HardwareBOM[] = [];

  const cabinetHardware = {
    hingeArm: {
      id: 'hinge-001',
      type: 'hardware' as const,
      itemName: '110 Inset Hinge - Clip top Blumotion',
      productCode: '71B3790',
      supplier: 'Blum',
      pricePerSKU: 5.43,
    },
    mountingPlate: {
      id: 'plate-001',
      type: 'hardware' as const,
      itemName: 'Horizontal cam mounting plate - 20/32',
      productCode: '177H3100E10',
      supplier: 'Blum',
      pricePerSKU: 0.81,
    },
    connector: {
      id: 'connector-001',
      type: 'hardware' as const,
      itemName: 'Connector Housing Minifix 15',
      productCode: '262.25.035',
      supplier: 'Hafele',
      pricePerSKU: 0.33,
    },
    bolt: {
      id: 'bolt-001',
      type: 'hardware' as const,
      itemName: 'Spreading Bolt, C100, Minifix® System',
      productCode: '262.09.313',
      supplier: 'Hafele',
      pricePerSKU: 0.25,
    },
    woodDowel: {
      id: 'dowel-001',
      type: 'hardware' as const,
      itemName: 'Wood Dowel, Fluted',
      productCode: '267.83.235',
      supplier: 'Hafele',
      pricePerSKU: 0.04,
    },
    pin: {
      id: 'pin-001',
      type: 'hardware' as const,
      itemName: 'Shelf Support with Shelf Fixing Plug',
      productCode: '282.24.720',
      supplier: 'Hafele',
      pricePerSKU: 0.19,
    },
    screw: {
      id: 'screw-001',
      type: 'hardware' as const,
      itemName: 'Wood screw 3.5x30mm',
      productCode: 'N/A',
      supplier: 'N/A',
      pricePerSKU: 0.01,
    },
  } as const;

  const componentsHardware = {
    'top-panel': {
      connector: 4,
      bolt: 4,
      woodDowel: 4,
    },
    'bottom-panel': {
      connector: 4,
      bolt: 4,
      woodDowel: 4,
    },
    door: {
      hingeArm: 2,
      mountingPlate: 2,
    },
    shelf: {
      pin: 4,
    },
    'divider-panel': {
      connector: 4,
      bolt: 4,
      woodDowel: 4,
      screw: 4,
    },
  } as const;

  for (const [componentName, componentQty] of Object.entries(componentCounts)) {
    const hardwareSpec =
      componentsHardware[componentName as keyof typeof componentsHardware];

    if (hardwareSpec && componentQty > 0) {
      for (const [hardwareType, perComponent] of Object.entries(hardwareSpec)) {
        const quantity = componentQty * (perComponent as number);
        const hardwareItem =
          cabinetHardware[hardwareType as keyof typeof cabinetHardware];
        hardwareItems.push({
          ...hardwareItem,
          quantity,
          totalCost: quantity * hardwareItem.pricePerSKU,
        });
      }
    }
  }

  return hardwareItems;
}
