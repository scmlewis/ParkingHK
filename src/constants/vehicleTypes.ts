import { VehicleType, LocalizedString } from '../domain/types';

export interface VehicleTypeMeta {
  id: VehicleType;
  label: LocalizedString;
  shortLabel: LocalizedString;
  code: string;
}

export const VEHICLE_TYPES: VehicleTypeMeta[] = [
  {
    id: 'PRIVATE_CAR',
    label: { en: 'Private Car', tc: '私家車' },
    shortLabel: { en: 'Car', tc: '私家車' },
    code: 'P'
  },
  {
    id: 'MOTORCYCLE',
    label: { en: 'Motorcycle', tc: '電單車' },
    shortLabel: { en: 'Moto', tc: '電單車' },
    code: 'M'
  },
  {
    id: 'LGV',
    label: { en: 'Light Goods Vehicle', tc: '輕型貨車' },
    shortLabel: { en: 'LGV', tc: '客貨車' },
    code: 'L'
  },
  {
    id: 'HGV',
    label: { en: 'Heavy Goods Vehicle', tc: '重型貨車' },
    shortLabel: { en: 'HGV', tc: '重型貨車' },
    code: 'H'
  },
  {
    id: 'COACH',
    label: { en: 'Coach / Bus', tc: '旅遊巴 / 巴士' },
    shortLabel: { en: 'Coach', tc: '旅遊巴' },
    code: 'C'
  }
];

export function getVehicleTypeLabel(type: VehicleType, lang: 'en' | 'tc'): string {
  const found = VEHICLE_TYPES.find(v => v.id === type);
  return found ? found.label[lang] : type;
}
