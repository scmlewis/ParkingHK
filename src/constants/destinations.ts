import { Destination } from '../domain/types';

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'tst-harbour-city',
    name: { en: 'Harbour City, Tsim Sha Tsui', tc: '海港城 (尖沙咀)' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    latitude: 22.2988,
    longitude: 114.1685,
    popular: true
  },
  {
    id: 'cwb-times-square',
    name: { en: 'Times Square, Causeway Bay', tc: '時代廣場 (銅鑼灣)' },
    district: { en: 'Wan Chai', tc: '灣仔區' },
    latitude: 22.2783,
    longitude: 114.1824,
    popular: true
  },
  {
    id: 'central-ifc',
    name: { en: 'IFC Mall, Central', tc: '國際金融中心商場 (中環)' },
    district: { en: 'Central & Western', tc: '中西區' },
    latitude: 22.2854,
    longitude: 114.1587,
    popular: true
  },
  {
    id: 'tst-k11-musea',
    name: { en: 'K11 MUSEA / Victoria Dockside', tc: 'K11 MUSEA (尖沙咀)' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    latitude: 22.2938,
    longitude: 114.1742,
    popular: true
  },
  {
    id: 'mk-langham-place',
    name: { en: 'Langham Place, Mong Kok', tc: '朗豪坊 (旺角)' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    latitude: 22.3182,
    longitude: 114.1686,
    popular: true
  },
  {
    id: 'st-new-town-plaza',
    name: { en: 'New Town Plaza, Sha Tin', tc: '新城市廣場 (沙田)' },
    district: { en: 'Sha Tin', tc: '沙田區' },
    latitude: 22.3814,
    longitude: 114.1888,
    popular: true
  },
  {
    id: 'kt-apm',
    name: { en: 'apm, Kwun Tong', tc: 'apm 商場 (觀塘)' },
    district: { en: 'Kwun Tong', tc: '觀塘區' },
    latitude: 22.3124,
    longitude: 114.2251,
    popular: true
  },
  {
    id: 'kln-tong-festival-walk',
    name: { en: 'Festival Walk, Kowloon Tong', tc: '又一城 (九龍塘)' },
    district: { en: 'Sham Shui Po', tc: '深水埗區' },
    latitude: 22.3370,
    longitude: 114.1746,
    popular: true
  },
  {
    id: 'wanchai-hkcec',
    name: { en: 'HKCEC, Wan Chai', tc: '香港會議展覽中心 (灣仔)' },
    district: { en: 'Wan Chai', tc: '灣仔區' },
    latitude: 22.2833,
    longitude: 114.1738,
    popular: true
  },
  {
    id: 'admiralty-pacific-place',
    name: { en: 'Pacific Place, Admiralty', tc: '太古廣場 (金鐘)' },
    district: { en: 'Central & Western', tc: '中西區' },
    latitude: 22.2775,
    longitude: 114.1656,
    popular: true
  },
  {
    id: 'central-taikwun',
    name: { en: 'Tai Kwun, Central', tc: '大館 (中環)' },
    district: { en: 'Central & Western', tc: '中西區' },
    latitude: 22.2818,
    longitude: 114.1542,
    popular: false
  },
  {
    id: 'tsuen-wan-plaza',
    name: { en: 'Tsuen Wan Plaza, Tsuen Wan', tc: '荃灣廣場 (荃灣)' },
    district: { en: 'Tsuen Wan', tc: '荃灣區' },
    latitude: 22.3708,
    longitude: 114.1118,
    popular: false
  },
  {
    id: 'tuen-mun-town-plaza',
    name: { en: 'Tuen Mun Town Plaza, Tuen Mun', tc: '屯門市廣場 (屯門)' },
    district: { en: 'Tuen Mun', tc: '屯門區' },
    latitude: 22.3925,
    longitude: 113.9765,
    popular: false
  },
  {
    id: 'yuen-long-yoho-mall',
    name: { en: 'YOHO MALL, Yuen Long', tc: '形點 YOHO MALL (元朗)' },
    district: { en: 'Yuen Long', tc: '元朗區' },
    latitude: 22.4445,
    longitude: 114.0360,
    popular: false
  },
  {
    id: 'tung-chung-citygate',
    name: { en: 'Citygate Outlets, Tung Chung', tc: '東薈城名店倉 (東涌)' },
    district: { en: 'Islands', tc: '離島區' },
    latitude: 22.2895,
    longitude: 113.9415,
    popular: false
  },
  {
    id: 'airport-terminal-1',
    name: { en: 'Hong Kong International Airport T1', tc: '香港國際機場一號客運大樓' },
    district: { en: 'Islands', tc: '離島區' },
    latitude: 22.3153,
    longitude: 113.9365,
    popular: true
  }
];
