import { Language } from '../domain/types';

export const translations = {
  en: {
    app: {
      name: 'ParkingHK',
      tagline: 'Hong Kong Parking Assistant',
      subtitle: 'Real-time vacancies, ratings & navigation'
    },
    nav: {
      nearby: 'Nearby',
      explore: 'Explore',
      favourites: 'Saved',
      settings: 'Settings',
      list: 'List',
      map: 'Map',
      split: 'Split'
    },
    hero: {
      greeting: 'Find Parking',
      destinationPrompt: 'Where to?',
      searchPlaceholder: 'Search carpark, mall, or area...',
      nearMeBtn: 'Near Me',
      locating: 'Locating...',
      currentLocation: 'Current Location',
      popularPlaces: 'Popular Destinations'
    },
    status: {
      available: 'Available',
      limited: 'Limited',
      full: 'Full',
      unknown: 'Unknown',
      open: 'Open',
      closed: 'Closed',
      spaces: 'spaces',
      space: 'space',
      noSpaces: 'Full',
      hourlyRate: '/hr',
      walk: 'walk'
    },
    freshness: {
      live: '<2m ago',
      recent: '2-5m ago',
      stale: '5-15m ago',
      veryStale: '>15m ago',
      unknown: 'Unknown',
      disclaimer: 'Data sourced from HKSAR Government Open Data (data.one.gov.hk).'
    },
    score: {
      title: 'Score',
      recommended: 'Recommended',
      whyRecommended: 'Score Details',
      scoreBreakdown: 'Breakdown',
      availability: 'Vacancy',
      distance: 'Distance',
      price: 'Price',
      opening: 'Opening Status',
      freshness: 'Freshness',
      pts: 'pts'
    },
    filters: {
      title: 'Filters',
      vehicleType: 'Vehicle',
      district: 'District',
      region: 'Region',
      allRegions: 'All Regions',
      allDistricts: 'All Districts',
      availability: 'Availability',
      onlyAvailable: 'Available spaces only',
      onlyOpen: 'Open now only',
      evCharging: 'EV Charging only',
      maxDistance: 'Radius',
      maxPrice: 'Max Hourly Rate',
      anyDistance: 'Any distance',
      anyPrice: 'Any price',
      reset: 'Reset',
      apply: 'Apply',
      activeFilterCount: 'active'
    },
    sort: {
      label: 'Sort',
      recommended: 'Recommended',
      distance: 'Nearest',
      vacancy: 'Most Spaces',
      price: 'Lowest Rate'
    },
    detail: {
      title: 'Carpark Details',
      navigate: 'Navigate',
      googleMaps: 'Google Maps',
      appleMaps: 'Apple Maps',
      waze: 'Waze',
      call: 'Call',
      website: 'Official Site',
      address: 'Address',
      district: 'District',
      heightLimit: 'Height Limit',
      heightLimitUnknown: 'Check onsite',
      facilities: 'Facilities',
      evChargingAvailable: 'EV Charging',
      disabledAccess: 'Accessible Parking',
      contactlessPay: 'Octopus / Contactless',
      covered: 'Covered / Indoor',
      pricingTitle: 'Rates',
      vacancyByVehicle: 'Vacancies',
      remarks: 'Notes & Offers',
      addedToFav: 'Saved to favourites',
      removedFromFav: 'Removed from favourites',
      updated: 'Updated',
      paymentLabel: 'Payment'
    },
    favourites: {
      title: 'Saved Carparks',
      subtitle: 'Quick access to your regular parking spots',
      empty: 'No saved carparks',
      emptyHint: 'Tap the star on any carpark to save it for quick monitoring.',
      exploreBtn: 'Find Carparks'
    },
    settings: {
      title: 'Settings & Info',
      language: 'Language',
      theme: 'Theme',
      themeSystem: 'System Default',
      themeLight: 'Light',
      themeDark: 'Dark',
      dataSources: 'Data Source & Attribution',
      dataSourceDesc: 'Car park basic info and live vacancy feeds are provided by the Transport Department of the Government of the Hong Kong Special Administrative Region under open data license.',
      privacyTitle: 'Privacy & Permissions',
      privacyDesc: 'Your GPS location is processed purely on your device to calculate distance and find nearby car parks. We do not store or track your location or vehicle data.',
      scoreFormula: 'How Parking Score Works',
      scoreFormulaDesc: 'Our deterministic scoring algorithm evaluates 5 objective parameters: Vacancy availability (40%), Distance (25%), Price (20%), Opening status (10%), and Data freshness (5%). It does not accept sponsored placement.',
      version: 'ParkingHK PWA v1.2',
      github: 'Source Code',
      githubDesc: 'Open-source project built with React, TypeScript & Leaflet.',
      author: 'Author',
      authorDesc: 'Built by Lewis for Hong Kong drivers.'
    },
    refresh: {
      refreshNow: 'Refresh',
      refreshing: 'Updating...',
      autoRefreshIn: 'Refresh in',
      seconds: 's',
      justNow: 'Just now'
    },
    empty: {
      noResults: 'No carparks found',
      noResultsHint: 'Try widening your radius or adjusting search filters.',
      clearFilters: 'Clear Filters'
    },
    map: {
      twoFingerHint: 'Use two fingers to pan & zoom',
      fitAll: 'Fit Hong Kong view',
      centerTarget: 'Center on target'
    },
    offline: {
      banner: 'Offline. Showing cached car park data.'
    }
  },
  tc: {
    app: {
      name: 'ParkingHK',
      tagline: '全港實時泊車助手',
      subtitle: '實時空位、評分與導航支援'
    },
    nav: {
      nearby: '附近',
      explore: '探索',
      favourites: '收藏',
      settings: '設定',
      list: '列表',
      map: '地圖',
      split: '分割'
    },
    hero: {
      greeting: '搵停車場',
      destinationPrompt: '去邊度？',
      searchPlaceholder: '搜尋目的地、商場、停車場或地區...',
      nearMeBtn: '定位附近',
      locating: '定位中...',
      currentLocation: '目前位置',
      popularPlaces: '熱門目的地'
    },
    status: {
      available: '車位充足',
      limited: '車位緊張',
      full: '已客滿',
      unknown: '未知',
      open: '營業中',
      closed: '暫停營業',
      spaces: '個空位',
      space: '個空位',
      noSpaces: '客滿',
      hourlyRate: ' / 小時',
      walk: '步行'
    },
    freshness: {
      live: '<2分鐘前',
      recent: '2-5分鐘前',
      stale: '5-15分鐘前',
      veryStale: '>15分鐘前',
      unknown: '未知',
      disclaimer: '數據源自香港特區政府運輸署開放數據 (data.one.gov.hk)。'
    },
    score: {
      title: '推薦分',
      recommended: '推薦',
      whyRecommended: '評分詳情',
      scoreBreakdown: '評分細項',
      availability: '空位',
      distance: '距離',
      price: '時租',
      opening: '營業狀態',
      freshness: '數據更新',
      pts: '分'
    },
    filters: {
      title: '篩選',
      vehicleType: '車輛種類',
      district: '分區',
      region: '區域',
      allRegions: '所有區域',
      allDistricts: '所有分區',
      availability: '空位狀態',
      onlyAvailable: '只看有空位',
      onlyOpen: '只看營業中',
      evCharging: '電動車充電',
      maxDistance: '搜尋半徑',
      maxPrice: '最高時租',
      anyDistance: '不限距離',
      anyPrice: '不限時租',
      reset: '重設',
      apply: '套用',
      activeFilterCount: '項條件'
    },
    sort: {
      label: '排序',
      recommended: '智能推薦',
      distance: '最近距離',
      vacancy: '最多空位',
      price: '最平時租'
    },
    detail: {
      title: '停車場詳情',
      navigate: '導航',
      googleMaps: 'Google 地圖',
      appleMaps: 'Apple 地圖',
      waze: 'Waze',
      call: '致電',
      website: '官方網站',
      address: '地址',
      district: '地區',
      heightLimit: '高度限制',
      heightLimitUnknown: '請現場留意標示',
      facilities: '場內設施',
      evChargingAvailable: '電動車充電',
      disabledAccess: '無障礙泊位',
      contactlessPay: '八達通 / 感應付款',
      covered: '室內 / 有蓋',
      pricingTitle: '時租收費',
      vacancyByVehicle: '車型空位',
      remarks: '備註與泊車優惠',
      addedToFav: '已加入收藏',
      removedFromFav: '已取消收藏',
      updated: '更新於',
      paymentLabel: '付款方式'
    },
    favourites: {
      title: '已收藏停車場',
      subtitle: '隨時掌握常用泊車點即時空缺',
      empty: '暫無收藏',
      emptyHint: '點擊任何停車場卡片上的星星，即可收藏至此。',
      exploreBtn: '尋找停車場'
    },
    settings: {
      title: '設定與說明',
      language: '語言 (Language)',
      theme: '外觀主題',
      themeSystem: '跟隨系統',
      themeLight: '淺色模式',
      themeDark: '深色模式',
      dataSources: '數據來源及聲明',
      dataSourceDesc: '本應用程式之停車場基本資料及實時空位數據均透過香港特區政府運輸署「資料一線通」開放數據接口取得。',
      privacyTitle: '隱私保護與定位',
      privacyDesc: '您的 GPS 位置資訊僅於閣下的瀏覽器端即時計算距離與篩選周邊車位，本系統絕不會收集或儲存您的地理軌跡或車輛資料。',
      scoreFormula: '推薦指數評分機制',
      scoreFormulaDesc: '推薦指數由 5 項客觀指標決定：車位空缺充裕度 (40%)、距離步行時間 (25%)、收費合理性 (20%)、營業狀態 (10%) 與數據即時性 (5%)。絕無任何商業贊助干預。',
      version: 'ParkingHK PWA v1.2',
      github: '原始碼',
      githubDesc: '開源專案，採用 React、TypeScript 及 Leaflet 開發。',
      author: '作者',
      authorDesc: '由 Lewis 為香港駕駛者開發。'
    },
    refresh: {
      refreshNow: '刷新',
      refreshing: '更新中...',
      autoRefreshIn: '自動更新倒數',
      seconds: '秒',
      justNow: '剛剛'
    },
    empty: {
      noResults: '無符合條件的停車場',
      noResultsHint: '試放寬搜尋半徑或調整篩選條件。',
      clearFilters: '清除篩選'
    },
    map: {
      twoFingerHint: '使用雙指縮放及移動地圖',
      fitAll: '顯示全港視圖',
      centerTarget: '返回定位中心'
    },
    offline: {
      banner: '處於離線狀態，顯示快取資料。'
    }
  }
};

export type Translations = typeof translations.en;
