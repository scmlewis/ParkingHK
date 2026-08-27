import { ParkingLot } from '../../src/domain/types';

export const HK_CARPARK_SEED_DATA: ParkingLot[] = [
  // Tsim Sha Tsui / Yau Tsim Mong
  {
    id: 'td_cp_001',
    name: { en: 'Ocean Terminal Car Park (Harbour City)', tc: '海運大廈停車場 (海港城)' },
    address: { en: '3-27 Canton Road, Tsim Sha Tsui', tc: '尖沙咀廣東道 3-27 號' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    region: 'KOWLOON',
    latitude: 22.2965,
    longitude: 114.1678,
    openingStatus: 'OPEN',
    contactNumber: '2118 8666',
    website: 'https://www.harbourcity.com.hk',
    heightLimit: 2.1,
    remarks: { en: 'Direct access to shopping mall, cinema & Star Ferry pier', tc: '直達商場、戲院及天星碼頭，消費泊車優惠' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 34,
      dayRate: 220,
      nightRate: 140,
      paymentMethods: ['Octopus', 'Visa', 'Mastercard', 'AlipayHK', 'WeChat Pay']
    },
    totalSpaces: 500,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 48, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 12, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_002',
    name: { en: 'K11 MUSEA Car Park', tc: 'K11 MUSEA 停車場' },
    address: { en: '18 Salisbury Road, Tsim Sha Tsui', tc: '尖沙咀梳士巴利道 18 號' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    region: 'KOWLOON',
    latitude: 22.2942,
    longitude: 114.1745,
    openingStatus: 'OPEN',
    contactNumber: '3892 3890',
    website: 'https://www.k11musea.com',
    heightLimit: 2.2,
    remarks: { en: 'Ultra-fast EV Superchargers available on B3/B4', tc: 'B3/B4 設有超快電車充電樁，消費尊享泊車折扣' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE', 'LGV'],
    pricing: {
      hourlyRate: 38,
      dayRate: 260,
      nightRate: 160,
      paymentMethods: ['Octopus', 'Visa', 'Mastercard', 'Apple Pay', 'K Dollar']
    },
    totalSpaces: 650,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 86, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 8, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_003',
    name: { en: 'Middle Road Car Park (H Zentre)', tc: '中間道停車場 (H Zentre)' },
    address: { en: '15 Middle Road, Tsim Sha Tsui', tc: '尖沙咀中間道 15 號' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    region: 'KOWLOON',
    latitude: 22.2960,
    longitude: 114.1728,
    openingStatus: 'OPEN',
    contactNumber: '2295 8828',
    heightLimit: 2.0,
    remarks: { en: 'Smart multi-storey automated car park next to MTR TST Exit L1', tc: '緊鄰尖沙咀港鐵站 L1 出口，全自動化智能引導泊位' },
    vehicleTypes: ['PRIVATE_CAR'],
    pricing: {
      hourlyRate: 32,
      dayRate: 200,
      paymentMethods: ['Octopus', 'Credit Card']
    },
    totalSpaces: 400,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 15, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_004',
    name: { en: 'Langham Place Car Park', tc: '朗豪坊停車場' },
    address: { en: '555 Shanghai Street, Mong Kok', tc: '旺角上海街 555 號' },
    district: { en: 'Yau Tsim Mong', tc: '油尖旺區' },
    region: 'KOWLOON',
    latitude: 22.3184,
    longitude: 114.1687,
    openingStatus: 'OPEN',
    contactNumber: '3520 2800',
    website: 'https://www.langhamplace.com.hk',
    heightLimit: 1.95,
    remarks: { en: 'Peak hours often experience queues on Argyle St', tc: '繁時亞皆老街入口可能需要排隊' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 36,
      nightRate: 130,
      paymentMethods: ['Octopus', 'Visa', 'Mastercard', 'AlipayHK']
    },
    totalSpaces: 250,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 6, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 2, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Causeway Bay / Wan Chai
  {
    id: 'td_cp_005',
    name: { en: 'Times Square Car Park', tc: '時代廣場停車場' },
    address: { en: '1 Matheson Street, Causeway Bay', tc: '銅鑼灣勿地臣街 1 號' },
    district: { en: 'Wan Chai', tc: '灣仔區' },
    region: 'HK_ISLAND',
    latitude: 22.2782,
    longitude: 114.1822,
    openingStatus: 'OPEN',
    contactNumber: '2118 8900',
    website: 'https://www.timessquare.com.hk',
    heightLimit: 2.0,
    remarks: { en: 'Central Causeway Bay, EV Tesla Destination chargers available', tc: '銅鑼灣核心地段，設有 Tesla 及標準充電樁' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 36,
      dayRate: 240,
      nightRate: 150,
      paymentMethods: ['Octopus', 'Credit Card', 'WeChat Pay', 'AlipayHK']
    },
    totalSpaces: 700,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 52, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 14, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_006',
    name: { en: 'Hysan Place Car Park (Lee Gardens)', tc: '希慎廣場停車場 (利園區)' },
    address: { en: '500 Hennessy Road, Causeway Bay', tc: '銅鑼灣軒尼詩道 500 號' },
    district: { en: 'Wan Chai', tc: '灣仔區' },
    region: 'HK_ISLAND',
    latitude: 22.2801,
    longitude: 114.1837,
    openingStatus: 'OPEN',
    contactNumber: '2886 7277',
    heightLimit: 2.1,
    remarks: { en: 'Club Avenue members enjoy special complimentary parking privileges', tc: '利園區會員專享泊車優惠' },
    vehicleTypes: ['PRIVATE_CAR'],
    pricing: {
      hourlyRate: 38,
      dayRate: 250,
      paymentMethods: ['Octopus', 'Lee Gardens App Pay', 'Credit Card']
    },
    totalSpaces: 350,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 19, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_007',
    name: { en: 'Hong Kong Convention and Exhibition Centre Car Park', tc: '香港會議展覽中心停車場' },
    address: { en: '1 Harbour Road, Wan Chai', tc: '灣仔港灣道 1 號' },
    district: { en: 'Wan Chai', tc: '灣仔區' },
    region: 'HK_ISLAND',
    latitude: 22.2829,
    longitude: 114.1735,
    openingStatus: 'OPEN',
    contactNumber: '2582 8888',
    website: 'https://www.hkcec.com',
    heightLimit: 2.2,
    remarks: { en: 'Ample spaces during non-exhibition days. 2 Car parks (Phase 1 & Phase 2)', tc: '非展覽期間車位充裕，分一期及二期停車場' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE', 'COACH', 'LGV'],
    pricing: {
      hourlyRate: 32,
      dayRate: 210,
      paymentMethods: ['Octopus', 'Visa', 'Mastercard']
    },
    totalSpaces: 1000,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 142, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 30, updatedAt: new Date().toISOString() },
      { vehicleType: 'LGV', serviceCategory: 'HOURLY', vacancy: 18, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Central & Western / Admiralty
  {
    id: 'td_cp_008',
    name: { en: 'IFC Two Car Park', tc: '國際金融中心二期停車場' },
    address: { en: '8 Finance Street, Central', tc: '中環金融街 8 號' },
    district: { en: 'Central & Western', tc: '中西區' },
    region: 'HK_ISLAND',
    latitude: 22.2858,
    longitude: 114.1593,
    openingStatus: 'OPEN',
    contactNumber: '2295 3308',
    website: 'https://ifc.com.hk',
    heightLimit: 2.1,
    remarks: { en: 'Connected to Airport Express Hong Kong Station & Star Ferry', tc: '直連機場快綫香港站及天星碼頭' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 36,
      dayRate: 260,
      paymentMethods: ['Octopus', 'Credit Card', 'Club ic']
    },
    totalSpaces: 800,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 77, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 25, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_009',
    name: { en: 'City Hall Public Car Park', tc: '大會堂公眾停車場' },
    address: { en: '1 Edinburgh Place, Central', tc: '中環愛丁堡廣場 1 號' },
    district: { en: 'Central & Western', tc: '中西區' },
    region: 'HK_ISLAND',
    latitude: 22.2828,
    longitude: 114.1610,
    openingStatus: 'OPEN',
    contactNumber: '2523 0089',
    heightLimit: 2.0,
    remarks: { en: 'Government owned public car park with economical hourly rate', tc: '政府公眾停車場，中環罕有平價泊位' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 24,
      nightRate: 110,
      paymentMethods: ['Octopus', 'FPS', 'Contactless Credit Card']
    },
    totalSpaces: 170,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 4, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 1, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_010',
    name: { en: 'Pacific Place Car Park', tc: '太古廣場停車場' },
    address: { en: '88 Queensway, Admiralty', tc: '金鐘金鐘道 88 號' },
    district: { en: 'Central & Western', tc: '中西區' },
    region: 'HK_ISLAND',
    latitude: 22.2773,
    longitude: 114.1652,
    openingStatus: 'OPEN',
    contactNumber: '2844 8988',
    website: 'https://www.pacificplace.com.hk',
    heightLimit: 2.1,
    remarks: { en: 'Direct access to Pacific Place, Conrad & JW Marriott', tc: '直達太古廣場、港麗酒店及萬豪酒店' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 34,
      dayRate: 240,
      paymentMethods: ['Octopus', 'Credit Card', 'AlipayHK']
    },
    totalSpaces: 500,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 39, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 10, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Sha Tin / New Territories
  {
    id: 'td_cp_011',
    name: { en: 'New Town Plaza Phase 1 Car Park', tc: '新城市廣場一期停車場' },
    address: { en: '18 Sha Tin Centre Street, Sha Tin', tc: '沙田沙田正街 18 號' },
    district: { en: 'Sha Tin', tc: '沙田區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3812,
    longitude: 114.1882,
    openingStatus: 'OPEN',
    contactNumber: '2684 9175',
    website: 'https://www.newtownplaza.com.hk',
    heightLimit: 2.2,
    remarks: { en: 'The Point by SHKP member touchless parking supported', tc: '新地 The Point 會員享免觸感應出入閘及積分兌換泊車' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 26,
      dayRate: 160,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 900,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 114, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 22, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_012',
    name: { en: 'Citylink Plaza Car Park', tc: '連城廣場停車場' },
    address: { en: '1 Sha Tin Station Circuit, Sha Tin', tc: '沙田沙田車站圍 1 號' },
    district: { en: 'Sha Tin', tc: '沙田區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3828,
    longitude: 114.1873,
    openingStatus: 'OPEN',
    contactNumber: '2603 0188',
    heightLimit: 2.0,
    remarks: { en: 'Right above MTR Sha Tin Station', tc: '港鐵沙田站上蓋，轉乘港鐵便利' },
    vehicleTypes: ['PRIVATE_CAR'],
    pricing: {
      hourlyRate: 24,
      paymentMethods: ['Octopus']
    },
    totalSpaces: 180,
    facilities: { evCharging: false, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 8, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Kwun Tong / Kowloon East
  {
    id: 'td_cp_013',
    name: { en: 'apm Millennium City 5 Car Park', tc: 'apm 創紀之城五期停車場' },
    address: { en: '418 Kwun Tong Road, Kwun Tong', tc: '觀塘觀塘道 418 號' },
    district: { en: 'Kwun Tong', tc: '觀塘區' },
    region: 'KOWLOON',
    latitude: 22.3121,
    longitude: 114.2253,
    openingStatus: 'OPEN',
    contactNumber: '3148 1200',
    website: 'https://www.hkapm.com.hk',
    heightLimit: 2.1,
    remarks: { en: '24-hour retail and dining hub in Kowloon East', tc: '九龍東核心地標，深夜消費泊車特惠' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE', 'LGV'],
    pricing: {
      hourlyRate: 28,
      dayRate: 180,
      nightRate: 120,
      paymentMethods: ['The Point', 'Octopus', 'Credit Card']
    },
    totalSpaces: 450,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 62, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 15, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_014',
    name: { en: 'MegaBox Car Park', tc: 'MegaBox 停車場' },
    address: { en: '38 Wang Chiu Road, Kowloon Bay', tc: '九龍灣宏照道 38 號' },
    district: { en: 'Kwun Tong', tc: '觀塘區' },
    region: 'KOWLOON',
    latitude: 22.3204,
    longitude: 114.2082,
    openingStatus: 'OPEN',
    contactNumber: '2989 3000',
    website: 'https://www.megabox.com.hk',
    heightLimit: 2.2,
    remarks: { en: 'Over 1,000 parking spaces with designated family parking', tc: '逾千個車位，設有特闊家庭及女士專用泊位' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE', 'LGV'],
    pricing: {
      hourlyRate: 22,
      dayRate: 140,
      paymentMethods: ['Octopus', 'Credit Card', 'AlipayHK', 'WeChat Pay']
    },
    totalSpaces: 1000,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 215, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 35, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Tsuen Wan / Kwai Tsing
  {
    id: 'td_cp_015',
    name: { en: 'Tsuen Wan Plaza Car Park', tc: '荃灣廣場停車場' },
    address: { en: '4-30 Tai Pa Street, Tsuen Wan', tc: '荃灣大壩街 4-30 號' },
    district: { en: 'Tsuen Wan', tc: '荃灣區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3709,
    longitude: 114.1117,
    openingStatus: 'OPEN',
    contactNumber: '2498 8343',
    heightLimit: 2.1,
    remarks: { en: 'Direct access to cinema and department store', tc: '直達商場及戲院，消費滿額免費泊車' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 24,
      dayRate: 150,
      paymentMethods: ['The Point', 'Octopus', 'Credit Card']
    },
    totalSpaces: 320,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 31, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 6, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_016',
    name: { en: 'D-PARK Car Park', tc: '愉景新城 D-PARK 停車場' },
    address: { en: '398 Castle Peak Road, Tsuen Wan', tc: '荃灣青山公路 398 號' },
    district: { en: 'Tsuen Wan', tc: '荃灣區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3758,
    longitude: 114.1120,
    openingStatus: 'OPEN',
    contactNumber: '2940 2888',
    heightLimit: 2.2,
    remarks: { en: 'Large capacity multi-level covered family parking', tc: '新界西大型家庭親子商場，車位充裕' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 22,
      dayRate: 140,
      paymentMethods: ['Octopus', 'Credit Card']
    },
    totalSpaces: 750,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 94, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 18, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Tuen Mun & Yuen Long
  {
    id: 'td_cp_017',
    name: { en: 'Tuen Mun Town Plaza Car Park', tc: '屯門市廣場停車場' },
    address: { en: '1 Tuen Shun Street, Tuen Mun', tc: '屯門屯順街 1 號' },
    district: { en: 'Tuen Mun', tc: '屯門區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3926,
    longitude: 113.9768,
    openingStatus: 'OPEN',
    contactNumber: '2450 7782',
    heightLimit: 2.1,
    remarks: { en: 'Sino Malls S+ REWARDS contactless parking', tc: '信和集團 S+ REWARDS 免觸泊車及泊車優惠' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 22,
      dayRate: 140,
      paymentMethods: ['Octopus', 'Credit Card', 'S+ REWARDS']
    },
    totalSpaces: 800,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 82, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 14, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_018',
    name: { en: 'YOHO MALL I Car Park', tc: '形點 YOHO MALL I 停車場' },
    address: { en: '9 Long Yat Road, Yuen Long', tc: '元朗朗日路 9 號' },
    district: { en: 'Yuen Long', tc: '元朗區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.4442,
    longitude: 114.0358,
    openingStatus: 'OPEN',
    contactNumber: '2554 0023',
    heightLimit: 2.2,
    remarks: { en: 'Over 1,500 spaces across YOHO MALL I & II', tc: 'YOHO MALL 綜合商場逾千五車位，設有多組快速充電' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 24,
      dayRate: 150,
      paymentMethods: ['The Point', 'Octopus', 'Credit Card']
    },
    totalSpaces: 1500,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 180, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 32, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },

  // Hong Kong International Airport & Outlying Islands
  {
    id: 'td_cp_019',
    name: { en: 'HKIA Car Park 1 (Outdoor Long-term / Short-term)', tc: '香港國際機場一號停車場 (露天)' },
    address: { en: '1 Cheong Lin Road, Chek Lap Kok', tc: '赤鱲角暢連路 1 號' },
    district: { en: 'Islands', tc: '離島區' },
    region: 'OUTLYING_ISLANDS',
    latitude: 22.3160,
    longitude: 113.9372,
    openingStatus: 'OPEN',
    contactNumber: '2183 4360',
    website: 'https://www.hongkongairport.com',
    heightLimit: 2.8,
    remarks: { en: 'Closest outdoor lot to Terminal 1 Departures hall', tc: '最鄰近一號客運大樓離境大堂露天停車位' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE', 'LGV'],
    pricing: {
      hourlyRate: 28,
      dayRate: 240,
      paymentMethods: ['Octopus', 'Visa', 'Mastercard', 'UnionPay']
    },
    totalSpaces: 800,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: false },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 64, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 20, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_020',
    name: { en: 'HKIA Car Park 4 (Covered Multi-Storey)', tc: '香港國際機場四號停車場 (室內多層)' },
    address: { en: '2 Cheong Lin Road, Chek Lap Kok', tc: '赤鱲角暢連路 2 號' },
    district: { en: 'Islands', tc: '離島區' },
    region: 'OUTLYING_ISLANDS',
    latitude: 22.3150,
    longitude: 113.9355,
    openingStatus: 'OPEN',
    contactNumber: '2183 4360',
    website: 'https://www.hongkongairport.com',
    heightLimit: 2.2,
    remarks: { en: 'Covered parking directly connected to Terminal 1 via footbridge', tc: '全室內有蓋停車場，行人天橋直達一號客運大樓' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 30,
      dayRate: 260,
      paymentMethods: ['Octopus', 'Credit Card', 'HKIA Mobile Pay']
    },
    totalSpaces: 1200,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 135, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 28, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_021',
    name: { en: 'Citygate Outlets Car Park', tc: '東薈城名店倉停車場' },
    address: { en: '20 Tat Tung Road, Tung Chung', tc: '東涌達東路 20 號' },
    district: { en: 'Islands', tc: '離島區' },
    region: 'OUTLYING_ISLANDS',
    latitude: 22.2892,
    longitude: 113.9412,
    openingStatus: 'OPEN',
    contactNumber: '2109 2933',
    heightLimit: 2.1,
    remarks: { en: 'Direct access to Tung Chung Cable Car Ngong Ping 360 & MTR Station', tc: '直達昂坪 360 纜車站及東涌港鐵站' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 22,
      dayRate: 150,
      paymentMethods: ['Octopus', 'Credit Card', 'CLUB CG']
    },
    totalSpaces: 1100,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 210, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 40, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  {
    id: 'td_cp_022',
    name: { en: 'Festival Walk Car Park', tc: '又一城停車場' },
    address: { en: '80 Tat Chee Avenue, Kowloon Tong', tc: '九龍塘達之路 80 號' },
    district: { en: 'Sham Shui Po', tc: '深水埗區' },
    region: 'KOWLOON',
    latitude: 22.3368,
    longitude: 114.1748,
    openingStatus: 'OPEN',
    contactNumber: '2844 2222',
    website: 'https://www.festivalwalk.com.hk',
    heightLimit: 2.0,
    remarks: { en: 'Direct MTR interchange station parking (East Rail & Kwun Tong lines)', tc: '港鐵九龍塘站雙綫交匯商場上蓋' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 30,
      dayRate: 200,
      paymentMethods: ['Octopus', 'Credit Card', 'My FESTIVAL']
    },
    totalSpaces: 830,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 58, updatedAt: new Date().toISOString() },
      { vehicleType: 'MOTORCYCLE', serviceCategory: 'HOURLY', vacancy: 12, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Eastern District (東區)
  {
    id: 'td_cp_023',
    name: { en: 'Cityplaza Car Park', tc: '太古城中心停車場' },
    address: { en: '18 Taikoo Shing Road, Taikoo Shing', tc: '太古城太古城道 18 號' },
    district: { en: 'Eastern', tc: '東區' },
    region: 'HK_ISLAND',
    latitude: 22.2862,
    longitude: 114.2173,
    openingStatus: 'OPEN',
    contactNumber: '2568 8665',
    website: 'https://www.cityplaza.com',
    heightLimit: 2.0,
    remarks: { en: 'Superfast EV charging stations and LIVE+ member rewards', tc: '特快電動車充電站及 LIVE+ 會員泊車禮遇' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 26,
      dayRate: 180,
      paymentMethods: ['Octopus', 'Credit Card', 'LIVE+ App']
    },
    totalSpaces: 800,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 94, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Southern District (南區)
  {
    id: 'td_cp_024',
    name: { en: 'Cyberport Car Park 1 & 2', tc: '數碼港一二座停車場' },
    address: { en: '100 Cyberport Road, Pok Fu Lam', tc: '薄扶林數碼港道 100 號' },
    district: { en: 'Southern', tc: '南區' },
    region: 'HK_ISLAND',
    latitude: 22.2618,
    longitude: 114.1298,
    openingStatus: 'OPEN',
    contactNumber: '3166 3111',
    website: 'https://www.cyberport.hk',
    heightLimit: 2.2,
    remarks: { en: 'Spacious bays with Cornerstone & Tesla EV Superchargers', tc: '寬敞車位，配備基石科技及 Tesla 超級充電站' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE', 'LGV'],
    pricing: {
      hourlyRate: 20,
      dayRate: 140,
      paymentMethods: ['Octopus', 'Credit Card']
    },
    totalSpaces: 650,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 120, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Kowloon City (九龍城區)
  {
    id: 'td_cp_025',
    name: { en: 'AIRSIDE Car Park (Kai Tak)', tc: 'AIRSIDE 停車場 (啟德)' },
    address: { en: '2 Concorde Road, Kai Tak', tc: '啟德協調道 2 號' },
    district: { en: 'Kowloon City', tc: '九龍城區' },
    region: 'KOWLOON',
    latitude: 22.3323,
    longitude: 114.1995,
    openingStatus: 'OPEN',
    contactNumber: '2686 0388',
    website: 'https://www.airside.com.hk',
    heightLimit: 2.2,
    remarks: { en: 'All 850 spaces equipped with smart EV smart charging support', tc: '全場 850 個車位均設有智能 EV 充電配套' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 28,
      dayRate: 190,
      paymentMethods: ['NF Touch App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 850,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 165, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Wong Tai Sin (黃大仙區)
  {
    id: 'td_cp_026',
    name: { en: 'Mikiki Car Park (San Po Kong)', tc: 'Mikiki 停車場 (新蒲崗)' },
    address: { en: '638 Prince Edward Road East, San Po Kong', tc: '新蒲崗太子道東 638 號' },
    district: { en: 'Wong Tai Sin', tc: '黃大仙區' },
    region: 'KOWLOON',
    latitude: 22.3338,
    longitude: 114.1970,
    openingStatus: 'OPEN',
    contactNumber: '3980 9930',
    heightLimit: 2.1,
    remarks: { en: 'The Point contactless parking with fast EV chargers', tc: 'The Point 智能無感泊車及快速電車充電' },
    vehicleTypes: ['PRIVATE_CAR'],
    pricing: {
      hourlyRate: 24,
      dayRate: 160,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 400,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 44, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Tsuen Wan (荃灣區)
  {
    id: 'td_cp_027',
    name: { en: 'Citywalk Car Park (Tsuen Wan)', tc: '荃新天地停車場 (荃灣)' },
    address: { en: '1 Yeung Uk Road, Tsuen Wan', tc: '荃灣楊屋道 1 號' },
    district: { en: 'Tsuen Wan', tc: '荃灣區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3688,
    longitude: 114.1145,
    openingStatus: 'OPEN',
    contactNumber: '3926 5700',
    heightLimit: 2.1,
    remarks: { en: 'Sino Malls parking rewards with Shell Recharge EV stations', tc: '信和商場泊車賞，配備 Shell Recharge EV 充電樁' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 24,
      dayRate: 150,
      paymentMethods: ['S+ REWARDS', 'Octopus', 'Credit Card']
    },
    totalSpaces: 500,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 72, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Kwai Tsing (葵青區)
  {
    id: 'td_cp_028',
    name: { en: 'Metroplaza Car Park (Kwai Fong)', tc: '新都會廣場停車場 (葵芳)' },
    address: { en: '223 Hing Fong Road, Kwai Fong', tc: '葵芳興芳路 223 號' },
    district: { en: 'Kwai Tsing', tc: '葵青區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3575,
    longitude: 114.1272,
    openingStatus: 'OPEN',
    contactNumber: '2429 6336',
    heightLimit: 2.0,
    remarks: { en: 'Directly linked to Kwai Fong MTR station with Tesla Superchargers', tc: '直通葵芳站，設有 Tesla 超級充電站及中電充電樁' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 22,
      dayRate: 140,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 550,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 88, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Tuen Mun (屯門區)
  {
    id: 'td_cp_029',
    name: { en: 'V city Car Park (Tuen Mun)', tc: 'V city 停車場 (屯門)' },
    address: { en: '83 Tuen Mun Heung Sze Wui Road, Tuen Mun', tc: '屯門屯門鄉事會路 83 號' },
    district: { en: 'Tuen Mun', tc: '屯門區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3962,
    longitude: 113.9745,
    openingStatus: 'OPEN',
    contactNumber: '3417 4238',
    heightLimit: 2.1,
    remarks: { en: 'Tuen Mun Station upper deck, high-speed EV chargers', tc: '屯門站上蓋核心商場，設有高速電車充電' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 22,
      dayRate: 140,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 450,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 55, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Yuen Long (元朗區)
  {
    id: 'td_cp_030',
    name: { en: 'YOHO MALL Car Park (Yuen Long)', tc: 'YOHO MALL 形點停車場 (元朗)' },
    address: { en: '8-9 Long Yat Road, Yuen Long', tc: '元朗朗日路 8-9 號' },
    district: { en: 'Yuen Long', tc: '元朗區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.4452,
    longitude: 114.0358,
    openingStatus: 'OPEN',
    contactNumber: '2554 0023',
    heightLimit: 2.2,
    remarks: { en: 'Over 1,500 spaces across YOHO MALL I & II with extensive EV hubs', tc: '一二期合共逾 1,500 車位，超大型 EV 充電專區' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 24,
      dayRate: 150,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 1500,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 230, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // North District (北區)
  {
    id: 'td_cp_031',
    name: { en: 'Landmark North Car Park (Sheung Shui)', tc: '上水廣場停車場' },
    address: { en: '39 Lung Sum Avenue, Sheung Shui', tc: '上水龍琛路 39 號' },
    district: { en: 'North', tc: '北區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.5028,
    longitude: 114.1285,
    openingStatus: 'OPEN',
    contactNumber: '2671 3988',
    heightLimit: 2.0,
    remarks: { en: 'Next to Sheung Shui MTR station with Shell Recharge EV stations', tc: '鄰近上水港鐵站，設有 Shell Recharge 電車充電' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 22,
      dayRate: 140,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 350,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 48, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Tai Po (大埔區)
  {
    id: 'td_cp_032',
    name: { en: 'Tai Po Mega Mall Car Park', tc: '大埔超級城停車場' },
    address: { en: '8 & 10 On Pong Road, Tai Po', tc: '大埔安邦路 8 及 10 號' },
    district: { en: 'Tai Po', tc: '大埔區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.4518,
    longitude: 114.1702,
    openingStatus: 'OPEN',
    contactNumber: '2665 6000',
    heightLimit: 2.1,
    remarks: { en: 'Largest mall in Tai Po with CLP EV charging stations', tc: '大埔區最大商場，設有中電智能電車充電站' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 20,
      dayRate: 130,
      paymentMethods: ['The Point App', 'Octopus', 'Credit Card']
    },
    totalSpaces: 450,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 62, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  },
  // Sai Kung / Tseung Kwan O (西貢區)
  {
    id: 'td_cp_033',
    name: { en: 'PopCorn Car Park (Tseung Kwan O)', tc: 'PopCorn 停車場 (將軍澳)' },
    address: { en: '9 Tong Yin Street, Tseung Kwan O', tc: '將軍澳唐賢街 9 號' },
    district: { en: 'Sai Kung', tc: '西貢區' },
    region: 'NEW_TERRITORIES',
    latitude: 22.3088,
    longitude: 114.2605,
    openingStatus: 'OPEN',
    contactNumber: '3543 1204',
    heightLimit: 2.1,
    remarks: { en: 'MTR Malls smart parking with high-capacity EV charging', tc: '港鐵商場智能泊車，設有大功率電車充電站' },
    vehicleTypes: ['PRIVATE_CAR', 'MOTORCYCLE'],
    pricing: {
      hourlyRate: 24,
      dayRate: 150,
      paymentMethods: ['MTR Mobile', 'Octopus', 'Credit Card']
    },
    totalSpaces: 600,
    facilities: { evCharging: true, disabledParking: true, contactlessPayment: true, covered: true },
    vacancies: [
      { vehicleType: 'PRIVATE_CAR', serviceCategory: 'HOURLY', vacancy: 85, updatedAt: new Date().toISOString() }
    ],
    dataUpdatedAt: new Date().toISOString()
  }
];
