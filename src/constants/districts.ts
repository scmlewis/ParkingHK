import { LocalizedString } from '../domain/types';

export interface DistrictInfo {
  id: string;
  name: LocalizedString;
  region: 'HK_ISLAND' | 'KOWLOON' | 'NEW_TERRITORIES' | 'OUTLYING_ISLANDS';
  regionName: LocalizedString;
  center: { lat: number; lng: number };
}

export const REGIONS: { id: string; name: LocalizedString }[] = [
  { id: 'ALL', name: { en: 'All Regions', tc: '全港地區' } },
  { id: 'HK_ISLAND', name: { en: 'Hong Kong Island', tc: '香港島' } },
  { id: 'KOWLOON', name: { en: 'Kowloon', tc: '九龍' } },
  { id: 'NEW_TERRITORIES', name: { en: 'New Territories', tc: '新界' } },
  { id: 'OUTLYING_ISLANDS', name: { en: 'Outlying Islands', tc: '離島' } }
];

export const DISTRICTS: DistrictInfo[] = [
  // Hong Kong Island
  {
    id: 'CW',
    name: { en: 'Central & Western', tc: '中西區' },
    region: 'HK_ISLAND',
    regionName: { en: 'Hong Kong Island', tc: '香港島' },
    center: { lat: 22.2820, lng: 114.1585 }
  },
  {
    id: 'WC',
    name: { en: 'Wan Chai', tc: '灣仔區' },
    region: 'HK_ISLAND',
    regionName: { en: 'Hong Kong Island', tc: '香港島' },
    center: { lat: 22.2770, lng: 114.1750 }
  },
  {
    id: 'EA',
    name: { en: 'Eastern', tc: '東區' },
    region: 'HK_ISLAND',
    regionName: { en: 'Hong Kong Island', tc: '香港島' },
    center: { lat: 22.2841, lng: 114.2241 }
  },
  {
    id: 'SO',
    name: { en: 'Southern', tc: '南區' },
    region: 'HK_ISLAND',
    regionName: { en: 'Hong Kong Island', tc: '香港島' },
    center: { lat: 22.2479, lng: 114.1588 }
  },

  // Kowloon
  {
    id: 'YTM',
    name: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    region: 'KOWLOON',
    regionName: { en: 'Kowloon', tc: '九龍' },
    center: { lat: 22.3117, lng: 114.1707 }
  },
  {
    id: 'SSP',
    name: { en: 'Sham Shui Po', tc: '深水埗區' },
    region: 'KOWLOON',
    regionName: { en: 'Kowloon', tc: '九龍' },
    center: { lat: 22.3307, lng: 114.1622 }
  },
  {
    id: 'KC',
    name: { en: 'Kowloon City', tc: '九龍城區' },
    region: 'KOWLOON',
    regionName: { en: 'Kowloon', tc: '九龍' },
    center: { lat: 22.3282, lng: 114.1915 }
  },
  {
    id: 'WTS',
    name: { en: 'Wong Tai Sin', tc: '黃大仙區' },
    region: 'KOWLOON',
    regionName: { en: 'Kowloon', tc: '九龍' },
    center: { lat: 22.3429, lng: 114.1932 }
  },
  {
    id: 'KT',
    name: { en: 'Kwun Tong', tc: '觀塘區' },
    region: 'KOWLOON',
    regionName: { en: 'Kowloon', tc: '九龍' },
    center: { lat: 22.3133, lng: 114.2258 }
  },

  // New Territories
  {
    id: 'TW',
    name: { en: 'Tsuen Wan', tc: '荃灣區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.3713, lng: 114.1141 }
  },
  {
    id: 'KWT',
    name: { en: 'Kwai Tsing', tc: '葵青區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.3549, lng: 114.1261 }
  },
  {
    id: 'TM',
    name: { en: 'Tuen Mun', tc: '屯門區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.3916, lng: 113.9770 }
  },
  {
    id: 'YL',
    name: { en: 'Yuen Long', tc: '元朗區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.4456, lng: 114.0222 }
  },
  {
    id: 'NO',
    name: { en: 'North', tc: '北區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.4947, lng: 114.1381 }
  },
  {
    id: 'TP',
    name: { en: 'Tai Po', tc: '大埔區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.4508, lng: 114.1642 }
  },
  {
    id: 'ST',
    name: { en: 'Sha Tin', tc: '沙田區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.3814, lng: 114.1880 }
  },
  {
    id: 'SK',
    name: { en: 'Sai Kung', tc: '西貢區' },
    region: 'NEW_TERRITORIES',
    regionName: { en: 'New Territories', tc: '新界' },
    center: { lat: 22.3838, lng: 114.2708 }
  },
  {
    id: 'IS',
    name: { en: 'Islands', tc: '離島區' },
    region: 'OUTLYING_ISLANDS',
    regionName: { en: 'Outlying Islands', tc: '離島' },
    center: { lat: 22.2891, lng: 113.9431 }
  }
];

export interface SubDistrictInfo {
  id: string;
  districtId: string;
  name: LocalizedString;
  center: { lat: number; lng: number };
  radiusKm: number;
}

export const SUB_DISTRICTS: SubDistrictInfo[] = [
  // Yau Tsim Mong sub-districts
  {
    id: 'sub-ymt',
    districtId: 'YTM',
    name: { en: 'Yau Ma Tei', tc: '油麻地' },
    center: { lat: 22.3130, lng: 114.1705 },
    radiusKm: 0.8
  },
  {
    id: 'sub-jordan',
    districtId: 'YTM',
    name: { en: 'Jordan', tc: '佐敦' },
    center: { lat: 22.3048, lng: 114.1714 },
    radiusKm: 0.8
  },
  {
    id: 'sub-mk',
    districtId: 'YTM',
    name: { en: 'Mong Kok', tc: '旺角' },
    center: { lat: 22.3193, lng: 114.1694 },
    radiusKm: 0.9
  },
  {
    id: 'sub-tst',
    districtId: 'YTM',
    name: { en: 'Tsim Sha Tsui', tc: '尖沙咀' },
    center: { lat: 22.2988, lng: 114.1722 },
    radiusKm: 1.0
  },

  // Central & Western sub-districts
  {
    id: 'sub-central',
    districtId: 'CW',
    name: { en: 'Central', tc: '中環' },
    center: { lat: 22.2820, lng: 114.1585 },
    radiusKm: 0.9
  },
  {
    id: 'sub-sheung-wan',
    districtId: 'CW',
    name: { en: 'Sheung Wan', tc: '上環' },
    center: { lat: 22.2865, lng: 114.1495 },
    radiusKm: 0.8
  },
  {
    id: 'sub-sai-wan',
    districtId: 'CW',
    name: { en: 'Sai Wan / Kennedy Town', tc: '西環 / 堅尼地城' },
    center: { lat: 22.2831, lng: 114.1287 },
    radiusKm: 1.0
  },

  // Wan Chai & Eastern sub-districts
  {
    id: 'sub-wc',
    districtId: 'WC',
    name: { en: 'Wan Chai', tc: '灣仔' },
    center: { lat: 22.2770, lng: 114.1750 },
    radiusKm: 0.9
  },
  {
    id: 'sub-cwb',
    districtId: 'WC',
    name: { en: 'Causeway Bay', tc: '銅鑼灣' },
    center: { lat: 22.2800, lng: 114.1850 },
    radiusKm: 0.8
  },
  {
    id: 'sub-north-point',
    districtId: 'EA',
    name: { en: 'North Point', tc: '北角' },
    center: { lat: 22.2915, lng: 114.1985 },
    radiusKm: 0.9
  },
  {
    id: 'sub-quarry-bay',
    districtId: 'EA',
    name: { en: 'Quarry Bay / Taikoo', tc: '鰂魚涌 / 太古' },
    center: { lat: 22.2845, lng: 114.2140 },
    radiusKm: 1.0
  },

  // Sham Shui Po sub-districts
  {
    id: 'sub-ssp',
    districtId: 'SSP',
    name: { en: 'Sham Shui Po', tc: '深水埗' },
    center: { lat: 22.3307, lng: 114.1622 },
    radiusKm: 0.9
  },
  {
    id: 'sub-cs-wan',
    districtId: 'SSP',
    name: { en: 'Cheung Sha Wan / Lai Chi Kok', tc: '長沙灣 / 荔枝角' },
    center: { lat: 22.3370, lng: 114.1480 },
    radiusKm: 1.1
  },

  // Kowloon City & Wong Tai Sin
  {
    id: 'sub-hh',
    districtId: 'KC',
    name: { en: 'Hung Hom / Whampoa', tc: '紅磡 / 黃埔' },
    center: { lat: 22.3045, lng: 114.1870 },
    radiusKm: 1.0
  },
  {
    id: 'sub-kc',
    districtId: 'KC',
    name: { en: 'Kowloon City / Kai Tak', tc: '九龍城 / 啟德' },
    center: { lat: 22.3290, lng: 114.1920 },
    radiusKm: 1.1
  },
  {
    id: 'sub-wts',
    districtId: 'WTS',
    name: { en: 'Wong Tai Sin / Diamond Hill', tc: '黃大仙 / 鑽石山' },
    center: { lat: 22.3420, lng: 114.1980 },
    radiusKm: 1.1
  },

  // Kwun Tong
  {
    id: 'sub-kt',
    districtId: 'KT',
    name: { en: 'Kwun Tong', tc: '觀塘' },
    center: { lat: 22.3125, lng: 114.2240 },
    radiusKm: 1.0
  },
  {
    id: 'sub-kln-bay',
    districtId: 'KT',
    name: { en: 'Kowloon Bay', tc: '九龍灣' },
    center: { lat: 22.3235, lng: 114.2110 },
    radiusKm: 0.9
  },

  // New Territories Sub-districts
  {
    id: 'sub-st',
    districtId: 'ST',
    name: { en: 'Sha Tin Town', tc: '沙田市中心' },
    center: { lat: 22.3814, lng: 114.1880 },
    radiusKm: 1.2
  },
  {
    id: 'sub-tai-wai',
    districtId: 'ST',
    name: { en: 'Tai Wai', tc: '大圍' },
    center: { lat: 22.3735, lng: 114.1785 },
    radiusKm: 1.0
  },
  {
    id: 'sub-tw',
    districtId: 'TW',
    name: { en: 'Tsuen Wan', tc: '荃灣' },
    center: { lat: 22.3713, lng: 114.1141 },
    radiusKm: 1.2
  },
  {
    id: 'sub-kwt',
    districtId: 'KWT',
    name: { en: 'Kwai Chung / Tsing Yi', tc: '葵涌 / 青衣' },
    center: { lat: 22.3550, lng: 114.1260 },
    radiusKm: 1.4
  },
  {
    id: 'sub-tko',
    districtId: 'SK',
    name: { en: 'Tseung Kwan O', tc: '將軍澳' },
    center: { lat: 22.3080, lng: 114.2600 },
    radiusKm: 1.4
  },
  {
    id: 'sub-yl',
    districtId: 'YL',
    name: { en: 'Yuen Long Town', tc: '元朗市中心' },
    center: { lat: 22.4450, lng: 114.0260 },
    radiusKm: 1.3
  },
  {
    id: 'sub-tm',
    districtId: 'TM',
    name: { en: 'Tuen Mun Town', tc: '屯門市中心' },
    center: { lat: 22.3920, lng: 113.9760 },
    radiusKm: 1.3
  },
  {
    id: 'sub-tp',
    districtId: 'TP',
    name: { en: 'Tai Po Town', tc: '大埔市中心' },
    center: { lat: 22.4508, lng: 114.1642 },
    radiusKm: 1.3
  },
  {
    id: 'sub-sheung-shui',
    districtId: 'NO',
    name: { en: 'Sheung Shui / Fanling', tc: '上水 / 粉嶺' },
    center: { lat: 22.4980, lng: 114.1350 },
    radiusKm: 1.4
  },
  {
    id: 'sub-tung-chung',
    districtId: 'IS',
    name: { en: 'Tung Chung', tc: '東涌' },
    center: { lat: 22.2891, lng: 113.9431 },
    radiusKm: 1.5
  }
];

export const POPULAR_DISTRICT_CHIPS = [
  { id: 'KT', name: { en: 'Kwun Tong', tc: '觀塘' }, center: { lat: 22.3133, lng: 114.2258 } },
  { id: 'YTM', name: { en: 'Yau Tsim Mong', tc: '油尖旺' }, center: { lat: 22.3117, lng: 114.1707 } },
  { id: 'KC', name: { en: 'Kowloon City', tc: '九龍城' }, center: { lat: 22.3282, lng: 114.1915 } },
  { id: 'SSP', name: { en: 'Sham Shui Po', tc: '深水埗' }, center: { lat: 22.3307, lng: 114.1622 } },
  { id: 'ST', name: { en: 'Sha Tin', tc: '沙田' }, center: { lat: 22.3814, lng: 114.1880 } },
  { id: 'YL', name: { en: 'Yuen Long', tc: '元朗' }, center: { lat: 22.4456, lng: 114.0222 } },
  { id: 'CW', name: { en: 'Central & Western', tc: '中西區' }, center: { lat: 22.2820, lng: 114.1585 } },
  { id: 'WC', name: { en: 'Wan Chai', tc: '灣仔' }, center: { lat: 22.2770, lng: 114.1750 } }
];

export const DEFAULT_HK_CENTER = {
  lat: 22.3193,
  lng: 114.1694 // Hong Kong Victoria Harbour / Kowloon center
};
