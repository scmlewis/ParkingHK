import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ParkingLot, Vacancy, VehicleType } from '../../src/domain/types';
import type { GovCarparkInfoItem, GovCarparkResponse, GovVacancyItem, GovVacancyResponse } from '../govTypes';

// In-memory cache (per serverless function instance)
const cache: {
  basicInfo: ParkingLot[] | null;
  basicInfoTimestamp: number;
  vacancies: Record<string, Vacancy[]> | null;
  vacanciesTimestamp: number;
} = {
  basicInfo: null,
  basicInfoTimestamp: 0,
  vacancies: null,
  vacanciesTimestamp: 0
};

const BASIC_INFO_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const VACANCY_CACHE_TTL = 45 * 1000; // 45 seconds

const DISTRICT_MAP = [
  { id: 'CW', en: 'Central & Western', tc: '中西區', region: 'HK_ISLAND' as const, center: [22.2854, 114.1587], keywords: ['中西', '中環', '金鐘', '上環', '西環', '堅尼地城', '西營盤', 'central', 'admiralty', 'sheung wan', 'kennedy town', 'sai ying pun'] },
  { id: 'WC', en: 'Wan Chai', tc: '灣仔區', region: 'HK_ISLAND' as const, center: [22.2783, 114.1824], keywords: ['灣仔', '銅鑼灣', '跑馬地', '大坑', '天后', '會展', 'wan chai', 'causeway bay', 'happy valley', 'tai hang', 'tin hau'] },
  { id: 'EA', en: 'Eastern', tc: '東區', region: 'HK_ISLAND' as const, center: [22.2842, 114.2120], keywords: ['東區', '北角', '鰂魚涌', '太古', '柴灣', '筲箕灣', '西灣河', '炮台山', '杏花邨', 'eastern', 'north point', 'quarry bay', 'taikoo', 'chai wan', 'shau kei wan', 'sai wan ho', 'fortress hill'] },
  { id: 'SO', en: 'Southern', tc: '南區', region: 'HK_ISLAND' as const, center: [22.2475, 114.1597], keywords: ['南區', '香港仔', '黃竹坑', '赤柱', '淺水灣', '薄扶林', '數碼港', '鴨脷洲', 'southern', 'aberdeen', 'wong chuk hang', 'stanley', 'repulse bay', 'pok fu lam', 'cyberport', 'ap lei chau'] },
  { id: 'YTM', en: 'Yau Tsim Mong', tc: '油尖旺區', region: 'KOWLOON' as const, center: [22.3120, 114.1700], keywords: ['油尖旺', '尖沙咀', '尖東', '旺角', '油麻地', '佐敦', '太子', '大角咀', 'yau tsim mong', 'tsim sha tsui', 'mong kok', 'yau ma tei', 'jordan', 'prince edward', 'tai kok tsui'] },
  { id: 'SSP', en: 'Sham Shui Po', tc: '深水埗區', region: 'KOWLOON' as const, center: [22.3307, 114.1622], keywords: ['深水埗', '長沙灣', '荔枝角', '石硤尾', '美孚', '又一村', 'sham shui po', 'cheung sha wan', 'lai chi kok', 'shek kip mei', 'mei foo'] },
  { id: 'KC', en: 'Kowloon City', tc: '九龍城區', region: 'KOWLOON' as const, center: [22.3282, 114.1916], keywords: ['九龍城', '啟德', '紅磡', '土瓜灣', '何文田', '九龍塘', '馬頭圍', 'kowloon city', 'kai tak', 'hung hom', 'to kwa wan', 'ho man tin', 'kowloon tong'] },
  { id: 'WTS', en: 'Wong Tai Sin', tc: '黃大仙區', region: 'KOWLOON' as const, center: [22.3418, 114.1941], keywords: ['黃大仙', '鑽石山', '新蒲崗', '慈雲山', '樂富', '彩虹', '牛池灣', 'wong tai sin', 'diamond hill', 'san po kong', 'tsz wan shan', 'lok fu', 'choi hung'] },
  { id: 'KT', en: 'Kwun Tong', tc: '觀塘區', region: 'KOWLOON' as const, center: [22.3133, 114.2258], keywords: ['觀塘', '九龍灣', '藍田', '油塘', '牛頭角', '秀茂坪', '順利', 'kwun tong', 'kowloon bay', 'lam tin', 'yau tong', 'ngau tau kok'] },
  { id: 'TW', en: 'Tsuen Wan', tc: '荃灣區', region: 'NEW_TERRITORIES' as const, center: [22.3713, 114.1141], keywords: ['荃灣', '深井', '馬灣', '汀九', 'tsuen wan', 'sham tseng', 'ma wan', 'ting kau'] },
  { id: 'KWT', en: 'Kwai Tsing', tc: '葵青區', region: 'NEW_TERRITORIES' as const, center: [22.3550, 114.1280], keywords: ['葵青', '葵涌', '青衣', '葵芳', '荔景', '大窩口', 'kwai tsing', 'kwai chung', 'tsing yi', 'kwai fong', 'lai king'] },
  { id: 'TM', en: 'Tuen Mun', tc: '屯門區', region: 'NEW_TERRITORIES' as const, center: [22.3916, 113.9770], keywords: ['屯門', '掃管笏', '藍地', '大欖', '黃金海岸', 'tuen mun', 'so kwun wat', 'gold coast'] },
  { id: 'YL', en: 'Yuen Long', tc: '元朗區', region: 'NEW_TERRITORIES' as const, center: [22.4456, 114.0222], keywords: ['元朗', '天水圍', '錦田', '新田', '落馬洲', '凹頭', 'yuen long', 'tin shui wai', 'kam tin', 'lok ma chau'] },
  { id: 'NO', en: 'North', tc: '北區', region: 'NEW_TERRITORIES' as const, center: [22.5009, 114.1292], keywords: ['北區', '上水', '粉嶺', '沙頭角', '打鼓嶺', '羅湖', 'sheung shui', 'fanling', 'sha tau kok', 'ta kwu ling', 'lo wu'] },
  { id: 'TP', en: 'Tai Po', tc: '大埔區', region: 'NEW_TERRITORIES' as const, center: [22.4508, 114.1642], keywords: ['大埔', '太和', '白石角', '科學園', '大美督', 'tai po', 'tai wo', 'pak shek kok', 'science park', 'tai mei tuk'] },
  { id: 'ST', en: 'Sha Tin', tc: '沙田區', region: 'NEW_TERRITORIES' as const, center: [22.3814, 114.1888], keywords: ['沙田', '大圍', '火炭', '馬鞍山', '石門', '顯徑', '小瀝源', 'sha tin', 'tai wai', 'fo tan', 'ma on shan', 'shek mun'] },
  { id: 'SK', en: 'Sai Kung', tc: '西貢區', region: 'NEW_TERRITORIES' as const, center: [22.3167, 114.2600], keywords: ['西貢', '將軍澳', '調景嶺', '坑口', '寶琳', '康城', '日出康城', '清水灣', 'sai kung', 'tseung kwan o', 'tiu keng leng', 'hang hau', 'po lam', 'lohas park', 'clear water bay'] },
  { id: 'IS', en: 'Islands', tc: '離島區', region: 'OUTLYING_ISLANDS' as const, center: [22.2892, 113.9412], keywords: ['離島', '東涌', '機場', '赤鱲角', '大嶼山', '愉景灣', '長洲', '坪洲', '南丫島', 'islands', 'tung chung', 'airport', 'chek lap kok', 'lantau', 'discovery bay', 'cheung chau'] }
];

function resolveDistrict(rawZh: string, rawEn: string, nameZh: string, nameEn: string, lat?: number, lng?: number) {
  const combinedText = `${rawZh} ${rawEn} ${nameZh} ${nameEn}`.toLowerCase();
  for (const d of DISTRICT_MAP) {
    if (combinedText.includes(d.tc) || combinedText.includes(d.en.toLowerCase())) return d;
    for (const kw of d.keywords) {
      if (combinedText.includes(kw.toLowerCase())) return d;
    }
  }
  if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat > 22 && lat < 23) {
    let bestDistrict = DISTRICT_MAP[0];
    let minDistanceSq = Number.MAX_VALUE;
    for (const d of DISTRICT_MAP) {
      const dLat = d.center[0] - lat;
      const dLng = d.center[1] - lng;
      const distSq = dLat * dLat + dLng * dLng;
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        bestDistrict = d;
      }
    }
    return bestDistrict;
  }
  return DISTRICT_MAP[0];
}

function mapRawVehicleType(rawType: string): VehicleType {
  const upper = (rawType || '').toUpperCase().trim();
  if (upper === 'P' || upper.includes('PRIVATE') || upper.includes('CAR')) return 'PRIVATE_CAR';
  if (upper === 'M' || upper.includes('MOTOR') || upper.includes('CYCLE')) return 'MOTORCYCLE';
  if (upper === 'L' || upper.includes('LGV') || upper.includes('LIGHT')) return 'LGV';
  if (upper === 'H' || upper.includes('HGV') || upper.includes('HEAVY')) return 'HGV';
  if (upper === 'C' || upper.includes('COACH') || upper.includes('BUS')) return 'COACH';
  return 'PRIVATE_CAR';
}

export async function getCarParksBasic(): Promise<ParkingLot[]> {
  const now = Date.now();
  if (cache.basicInfo && now - cache.basicInfoTimestamp < BASIC_INFO_CACHE_TTL) {
    return cache.basicInfo;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const [zhRes, enRes] = await Promise.all([
      fetch('https://api.data.gov.hk/v1/carpark-info-vacancy?data=info&lang=zh_TW', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json', 'User-Agent': 'ParkingHK-App/1.0' }
      }),
      fetch('https://api.data.gov.hk/v1/carpark-info-vacancy?data=info&lang=en_US', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json', 'User-Agent': 'ParkingHK-App/1.0' }
      })
    ]);
    clearTimeout(timeoutId);
    if (zhRes.ok) {
      const zhData = (await zhRes.json()) as GovCarparkResponse;
      const enData = enRes.ok ? ((await enRes.json()) as GovCarparkResponse) : { results: [] };
      const zhList = zhData?.results || [];
      const enList = enData?.results || [];
      const enMap = new Map<string, GovCarparkInfoItem>();
      enList.forEach((item) => { if (item.park_Id) enMap.set(item.park_Id, item); });
      if (Array.isArray(zhList) && zhList.length > 0) {
        const parsed: ParkingLot[] = zhList.map((zhItem, index) => {
          const parkId = zhItem.park_Id || zhItem.parkId || `td_${index}`;
          const enItem = enMap.get(parkId) || {};
          const nameZh = zhItem.name || '';
          const nameEn = enItem.name || zhItem.name || '';
          const rawDistrictZh = zhItem.district || zhItem.address?.dcDistrict || zhItem.displayAddress || '';
          const rawDistrictEn = enItem.district || enItem.address?.dcDistrict || enItem.displayAddress || '';
          const lat = typeof zhItem.latitude === 'number' ? zhItem.latitude : parseFloat(zhItem.latitude);
          const lng = typeof zhItem.longitude === 'number' ? zhItem.longitude : parseFloat(zhItem.longitude);
          const districtMatch = resolveDistrict(rawDistrictZh, rawDistrictEn, nameZh, nameEn, lat, lng);
          const pcCharges = zhItem.privateCar?.hourlyCharges || [];
          const hasOfficialPricing = pcCharges.length > 0 && typeof pcCharges[0].price === 'number';
          const hourlyRate = hasOfficialPricing ? pcCharges[0].price : null;
          const heightLimits = zhItem.heightLimits || [];
          const height = heightLimits.length > 0 && typeof heightLimits[0].height === 'number' ? heightLimits[0].height : undefined;
          const vehicleTypes: VehicleType[] = ['PRIVATE_CAR'];
          if (zhItem.motorCycle && (zhItem.motorCycle.space > 0 || (zhItem.motorCycle.hourlyCharges || []).length > 0)) vehicleTypes.push('MOTORCYCLE');
          if (zhItem.LGV && (zhItem.LGV.space > 0 || (zhItem.LGV.hourlyCharges || []).length > 0)) vehicleTypes.push('LGV');
          if (zhItem.HGV && (zhItem.HGV.space > 0 || (zhItem.HGV.hourlyCharges || []).length > 0)) vehicleTypes.push('HGV');
          if (zhItem.coach && (zhItem.coach.space > 0 || (zhItem.coach.hourlyCharges || []).length > 0)) vehicleTypes.push('COACH');
          const facilitiesList = Array.isArray(zhItem.facilities) ? zhItem.facilities : [];
          const hasGovEv = facilitiesList.includes('evCharger') || Boolean(zhItem.privateCar?.spaceEV && zhItem.privateCar.spaceEV > 0);
          const nameLower = `${nameZh} ${nameEn} ${rawDistrictZh}`.toLowerCase();
          const hasEvKeyword = nameLower.includes('ev') || nameLower.includes('tesla') || nameLower.includes('充電') || nameLower.includes('charger') || nameLower.includes('supercharger');
          const hasEv = hasGovEv || hasEvKeyword;
          const hasDis = facilitiesList.includes('disabilities') || Boolean(zhItem.privateCar?.spaceDIS && zhItem.privateCar.spaceDIS > 0);
          const paymentMethods = Array.isArray(zhItem.paymentMethods) && zhItem.paymentMethods.length > 0
            ? zhItem.paymentMethods.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))
            : ['Octopus', 'Credit Card'];
          return {
            id: parkId,
            name: { en: enItem.name || zhItem.name, tc: zhItem.name },
            address: { en: enItem.displayAddress || enItem.name || districtMatch.en, tc: zhItem.displayAddress || zhItem.name || districtMatch.tc },
            district: { en: districtMatch.en, tc: districtMatch.tc },
            region: districtMatch.region,
            latitude: !isNaN(lat) && lat > 22 && lat < 23 ? lat : null,
            longitude: !isNaN(lng) && lng > 113 && lng < 115 ? lng : null,
            openingStatus: zhItem.opening_status === 'CLOSED' ? 'CLOSED' : 'OPEN',
            contactNumber: zhItem.contactNo || undefined,
            website: zhItem.website || undefined,
            heightLimit: height,
            vehicleTypes,
            pricing: { hourlyRate, estimated: !hasOfficialPricing, dayRate: hourlyRate != null ? hourlyRate * 7 : undefined, paymentMethods },
            facilities: { evCharging: hasEv, disabledParking: hasDis, contactlessPayment: true, covered: true },
            vacancies: [],
            dataUpdatedAt: new Date().toISOString()
          };
        });
        const validParsed = parsed.filter(p => p.latitude !== null && p.longitude !== null);
        if (validParsed.length >= 10) {
          cache.basicInfo = validParsed;
          cache.basicInfoTimestamp = now;
          return validParsed;
        }
      }
    }
    throw new Error('Transport Department API returned no usable data');
  } catch (err) {
    console.warn('Could not fetch from data.gov.hk carpark-info API:', (err as Error).message);
    throw err;
  }
}

export async function getVacancies(): Promise<Record<string, Vacancy[]>> {
  const now = Date.now();
  if (cache.vacancies && now - cache.vacanciesTimestamp < VACANCY_CACHE_TTL) {
    return cache.vacancies;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'ParkingHK-App/1.0' }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = (await res.json()) as any;
      const results = data?.results || [];
      if (Array.isArray(results) && results.length > 0) {
        const vacanciesMap: Record<string, Vacancy[]> = {};
        for (const item of results) {
          const parkId = item.park_Id || item.parkId;
          if (!parkId) continue;
          const entries: Vacancy[] = [];
          for (const key of ['privateCar', 'motorCycle', 'LGV', 'HGV', 'coach'] as const) {
            const v = item[key];
            if (Array.isArray(v) && v.length > 0) {
              const entry = v[0];
              const count = typeof entry.vacancy === 'number' && entry.vacancy >= 0 ? entry.vacancy : null;
              const vt: VehicleType = key === 'privateCar' ? 'PRIVATE_CAR' : key === 'motorCycle' ? 'MOTORCYCLE' : key === 'LGV' ? 'LGV' : key === 'HGV' ? 'HGV' : 'COACH';
              entries.push({ vehicleType: vt, serviceCategory: 'HOURLY', vacancy: count, vacancyType: entry.vacancy_type || 'A', updatedAt: entry.lastupdate || new Date().toISOString() });
            }
          }
          if (entries.length > 0) vacanciesMap[parkId] = entries;
        }
        if (Object.keys(vacanciesMap).length > 0) {
          cache.vacancies = vacanciesMap;
          cache.vacanciesTimestamp = now;
          return vacanciesMap;
        }
      }
    }
    return {};
  } catch (err) {
    console.warn('Could not fetch live vacancy from data.gov.hk:', (err as Error).message);
    return {};
  }
}

export function forceVacancyRefresh(): void {
  cache.vacanciesTimestamp = 0;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [basicLots, vacanciesMap] = await Promise.all([
      getCarParksBasic(),
      getVacancies()
    ]);
    const merged: ParkingLot[] = basicLots.map(lot => {
      const lotVacancies = vacanciesMap[lot.id] || lot.vacancies || [];
      return {
        ...lot,
        vacancies: lotVacancies.length > 0 ? lotVacancies : lot.vacancies,
        dataUpdatedAt: lotVacancies[0]?.updatedAt || lot.dataUpdatedAt || new Date().toISOString()
      };
    });
    res.status(200).json({
      success: true,
      count: merged.length,
      timestamp: new Date().toISOString(),
      data: merged
    });
  } catch (error) {
    console.error('Error fetching parking lots:', error);
    res.status(502).json({
      success: false,
      error: 'Failed to retrieve parking data from Transport Department'
    });
  }
}
