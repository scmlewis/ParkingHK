/**
 * ParkingHK — Hong Kong Parking Real-Time Decision Tool & Map
 * Differentiated Desktop (Mix Map + List) and Mobile (Dedicated Map & List modes) Architecture.
 * High-performance batched rendering for silky-smooth 60fps UX.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n/context';
import { ModernTopBar } from './components/modern/ModernTopBar';
import { ModernBottomBar } from './components/modern/ModernBottomBar';
import { ModernCarousel } from './components/modern/ModernCarousel';
import { ModernListView } from './components/modern/ModernListView';
import { DesktopSidePanel } from './components/desktop/DesktopSidePanel';
import { ParkingMap } from './components/parking/ParkingMap';
import { ParkingDetailModal } from './components/parking/ParkingDetailModal';
import { ScoreExplainModal } from './components/parking/ScoreExplainModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { FavouritesView } from './components/favourites/FavouritesView';

import { useParkingData } from './hooks/useParkingData';
import { useUserLocation } from './hooks/useUserLocation';
import { useFavourites } from './hooks/useFavourites';
import { usePreferences } from './hooks/usePreferences';
import { calculateParkingScore } from './services/recommendationService';
import { ScoredParkingLot, Destination } from './domain/types';
import { DISTRICTS } from './constants/districts';
import { calculateDistanceMeters } from './services/distanceService';

import { WifiOff, AlertCircle, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function MainApp() {
  const { lang, t } = useI18n();

  // Responsive device tracking
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data & State Hooks
  const {
    lots,
    isLoading,
    isRefreshing,
    error,
    isOffline,
    isUsingCachedData,
    secondsUntilNextRefresh,
    refreshNow,
    retryInitialLoad
  } = useParkingData();

  const {
    latitude,
    longitude,
    isLocating,
    locationName,
    isCustomDestination,
    selectedDestination,
    requestCurrentLocation,
    setDestination
  } = useUserLocation();

  const {
    favouriteIds,
    toggleFavourite,
    isFavourite,
    count: favouritesCount
  } = useFavourites();

  const {
    theme,
    setTheme,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    resetFilters
  } = usePreferences();

  // Navigation & View Mode State (Mobile only)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isFavouritesModalOpen, setIsFavouritesModalOpen] = useState<boolean>(false);
  const [parkingDurationHours, setParkingDurationHours] = useState<number>(2);
  const [gpsFlyCounter, setGpsFlyCounter] = useState<number>(0);

  // Modal States
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<ScoredParkingLot | null>(null);
  const [lotForScoreExplain, setLotForScoreExplain] = useState<ScoredParkingLot | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map viewport tracking state for Area Search
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [currentMapZoom, setCurrentMapZoom] = useState<number>(13);
  const [zoomTarget, setZoomTarget] = useState<{ lat: number; lng: number; zoom?: number; timestamp: number } | null>(null);
  const [customSearchLocation, setCustomSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapMoved, setIsMapMoved] = useState<boolean>(false);

  // Active reference coordinate for calculating distances and recommendation scores
  const activeLat = customSearchLocation?.lat ?? latitude;
  const activeLng = customSearchLocation?.lng ?? longitude;

  // Handle map pan/zoom finish (debounced from ParkingMap)
  const handleMapMoveEnd = useCallback(
    (
      center: { lat: number; lng: number },
      bounds: { north: number; south: number; east: number; west: number },
      zoom: number
    ) => {
      setMapCenter(center);
      setMapBounds(bounds);
      setCurrentMapZoom(zoom);

      // Check if user panned away from active center by more than 250m
      if (activeLat && activeLng) {
        const dist = calculateDistanceMeters(activeLat, activeLng, center.lat, center.lng);
        if (dist > 250) {
          setIsMapMoved(true);
        } else {
          setIsMapMoved(false);
        }
      }
    },
    [activeLat, activeLng]
  );

  // Score and calculate metrics for all lots using active location
  const scoredLots: ScoredParkingLot[] = useMemo(() => {
    return lots.map(lot => calculateParkingScore(lot, activeLat, activeLng, filters.vehicleType));
  }, [lots, activeLat, activeLng, filters.vehicleType]);

  // Apply filters and sorting
  const filteredAndSortedLots: ScoredParkingLot[] = useMemo(() => {
    let result = scoredLots;

    // 1. Search Query (Name, Address, District)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const lot = item.lot;
        return (
          lot.name.en.toLowerCase().includes(q) ||
          lot.name.tc.toLowerCase().includes(q) ||
          lot.address.en.toLowerCase().includes(q) ||
          lot.address.tc.toLowerCase().includes(q) ||
          lot.district.en.toLowerCase().includes(q) ||
          lot.district.tc.toLowerCase().includes(q)
        );
      });
    }

    // 2. Region filter
    if (filters.region !== 'ALL') {
      result = result.filter(item => item.lot.region === filters.region);
    }

    // 3. District filter
    if (filters.district !== 'ALL') {
      const selectedDistrictObj = DISTRICTS.find(d => d.id === filters.district);
      if (selectedDistrictObj) {
        result = result.filter(item => {
          return (
            item.lot.district.en === selectedDistrictObj.name.en ||
            item.lot.district.tc === selectedDistrictObj.name.tc
          );
        });
      }
    }

    // 4. Opening status
    if (filters.openingStatusOnly) {
      result = result.filter(item => item.lot.openingStatus === 'OPEN');
    }

    // 5. Only with available spaces
    if (filters.onlyWithVacancy) {
      result = result.filter(item => {
        const vac = item.selectedVacancy?.vacancy;
        return vac !== null && vac !== undefined && vac > 0;
      });
    }

    // 6. EV Charging only
    if (filters.evChargingOnly) {
      result = result.filter(item => item.lot.facilities?.evCharging);
    }

    // 7. Max Distance Radius
    if (isFinite(filters.maxDistanceKm) && filters.maxDistanceKm > 0) {
      const maxMeters = filters.maxDistanceKm * 1000;
      result = result.filter(item => {
        if (item.distanceMeters === null) return true;
        return item.distanceMeters <= maxMeters;
      });
    }

    // 8. Max Hourly Rate
    if (isFinite(filters.maxHourlyRate) && filters.maxHourlyRate > 0) {
      result = result.filter(item => {
        const rate = item.lot.pricing?.hourlyRate;
        if (rate === undefined) return true;
        return rate <= filters.maxHourlyRate;
      });
    }

    // 9. Zone Limitation (Limit results to visible map zone)
    if (filters.limitToMapZone && mapBounds) {
      const latSpan = mapBounds.north - mapBounds.south;
      const lngSpan = mapBounds.east - mapBounds.west;
      // Slight 4% buffer so boundary car parks are smoothly included
      const latPad = Math.max(latSpan * 0.04, 0.0008);
      const lngPad = Math.max(lngSpan * 0.04, 0.0008);
      const north = mapBounds.north + latPad;
      const south = mapBounds.south - latPad;
      const east = mapBounds.east + lngPad;
      const west = mapBounds.west - lngPad;

      result = result.filter(item => {
        const lat = item.lot.latitude;
        const lng = item.lot.longitude;
        if (lat === null || lng === null) return false;
        return lat <= north && lat >= south && lng <= east && lng >= west;
      });
    }

    // 10. Sorting & Map Viewport Prioritization
    return [...result].sort((a, b) => {
      if (mapBounds && (customSearchLocation || isMapMoved)) {
        const aInBounds =
          a.lot.latitude !== null &&
          a.lot.latitude <= mapBounds.north &&
          a.lot.latitude >= mapBounds.south &&
          a.lot.longitude <= mapBounds.east &&
          a.lot.longitude >= mapBounds.west;
        const bInBounds =
          b.lot.latitude !== null &&
          b.lot.latitude <= mapBounds.north &&
          b.lot.latitude >= mapBounds.south &&
          b.lot.longitude <= mapBounds.east &&
          b.lot.longitude >= mapBounds.west;

        if (aInBounds && !bInBounds) return -1;
        if (!aInBounds && bInBounds) return 1;
      }

      if (sortOption === 'recommended') {
        return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
      }
      if (sortOption === 'distance') {
        if (a.distanceMeters === null) return 1;
        if (b.distanceMeters === null) return -1;
        return a.distanceMeters - b.distanceMeters;
      }
      if (sortOption === 'vacancy') {
        const vacA = a.selectedVacancy?.vacancy ?? -1;
        const vacB = b.selectedVacancy?.vacancy ?? -1;
        return vacB - vacA;
      }
      if (sortOption === 'price') {
        const priceA = a.lot.pricing?.hourlyRate ?? 999;
        const priceB = b.lot.pricing?.hourlyRate ?? 999;
        return priceA - priceB;
      }
      return 0;
    });
  }, [scoredLots, searchQuery, filters, sortOption, mapBounds, customSearchLocation, isMapMoved]);

  // Favourites lots
  const favouriteLots = useMemo(() => {
    return scoredLots.filter(item => favouriteIds.includes(item.lot.id));
  }, [scoredLots, favouriteIds]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.vehicleType !== 'PRIVATE_CAR') count++;
    if (filters.region !== 'ALL') count++;
    if (filters.district !== 'ALL') count++;
    if (filters.openingStatusOnly) count++;
    if (filters.onlyWithVacancy) count++;
    if (filters.evChargingOnly) count++;
    if (isFinite(filters.maxDistanceKm)) count++;
    if (isFinite(filters.maxHourlyRate)) count++;
    return count;
  }, [filters]);

  const handleCenterTarget = () => {
    setCustomSearchLocation(null);
    setIsMapMoved(false);
    setGpsFlyCounter(prev => prev + 1);
    requestCurrentLocation();
  };

  const handleDistrictZoom = (lat: number, lng: number) => {
    setZoomTarget({ lat, lng, zoom: 15.2, timestamp: Date.now() });
  };

  return (
    <div className="h-[100dvh] w-screen relative overflow-hidden bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* ── Offline Banner ── */}
      {(isOffline || isUsingCachedData) && (
        <div className="relative z-40 bg-amber-500 text-slate-950 text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-2 shadow-md shrink-0">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t.offline.banner}</span>
        </div>
      )}

      {/* ── API Error Banner ── */}
      {error && (
        <div className="relative z-40 max-w-lg mx-auto px-4 mt-2 w-full shrink-0">
          <div className="p-2.5 rounded-xl bg-rose-950/90 backdrop-blur-md border border-rose-800 text-xs text-rose-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
            <button
              type="button"
              onClick={retryInitialLoad}
              className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition shrink-0"
            >
              {lang === 'tc' ? '重試' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP EXPERIENCE: Split Screen (Mix Map + List Mode) ── */}
      {isDesktop ? (
        <div className="flex-1 w-full h-full flex overflow-hidden relative">
          {/* Left Column: Dedicated Car Park List Side Panel */}
          <div className="w-[400px] lg:w-[440px] xl:w-[480px] h-full shrink-0 relative z-20 shadow-2xl">
            <DesktopSidePanel
              lots={filteredAndSortedLots}
              isLoading={isLoading}
              selectedLot={selectedLotForDetail}
              onSelectLot={setSelectedLotForDetail}
              onOpenDetail={setSelectedLotForDetail}
              onExplainScore={setLotForScoreExplain}
              isFavourite={isFavourite}
              onToggleFavourite={toggleFavourite}
              sortOption={sortOption}
              onSortChange={setSortOption}
              parkingDurationHours={parkingDurationHours}
              filters={filters}
              onFiltersChange={setFilters}
              onSelectDistrictZoom={handleDistrictZoom}
              currentZoom={currentMapZoom}
              searchQuery={searchQuery}
              isOffline={isOffline}
              isUsingCachedData={isUsingCachedData}
            />
          </div>

          {/* Right Column: Full Interactive Leaflet Map */}
          <div className="flex-1 h-full relative z-0">
            {/* Top Bar for Desktop (Search, Duration, Filter popover, GPS, Lang, Settings) */}
            <ModernTopBar
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedDestination={selectedDestination}
              onSelectDestination={dest => {
                setDestination(dest);
                setCustomSearchLocation(null);
                setIsMapMoved(false);
                if (dest) {
                  setSelectedLotForDetail(null);
                  setZoomTarget({ lat: dest.lat, lng: dest.lng, zoom: 15.5, timestamp: Date.now() });
                }
              }}
              isLocating={isLocating}
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              favouritesCount={favouritesCount}
              onOpenFavourites={() => setIsFavouritesModalOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              parkingDurationHours={parkingDurationHours}
              onChangeDurationHours={setParkingDurationHours}
              matchingLotsCount={searchQuery.trim() ? filteredAndSortedLots.length : 0}
            />

            <ParkingMap
              lots={filteredAndSortedLots}
              selectedLot={selectedLotForDetail}
              onSelectLot={setSelectedLotForDetail}
              onOpenDetail={setSelectedLotForDetail}
              isFavourite={isFavourite}
              onToggleFavourite={toggleFavourite}
              targetLat={activeLat}
              targetLng={activeLng}
              searchRadiusKm={filters.maxDistanceKm}
              onCenterTarget={handleCenterTarget}
              onMapMoveEnd={handleMapMoveEnd}
              zoomTarget={zoomTarget}
              isDarkMode={true}
              showInlineCard={false}
              isDesktop={true}
              parkingDurationHours={parkingDurationHours}
              gpsFlyCounter={gpsFlyCounter}
            />
          </div>
        </div>
      ) : (
        /* ── MOBILE EXPERIENCE: Map Mode OR List Mode with Bottom Navigation ── */
        <div className="flex-1 w-full h-full relative overflow-hidden">
          {/* Full Screen Interactive Map Canvas */}
          <div
            className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-300 ${
              viewMode === 'list' ? 'opacity-20 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ParkingMap
              lots={filteredAndSortedLots}
              selectedLot={selectedLotForDetail}
              onSelectLot={setSelectedLotForDetail}
              onOpenDetail={setSelectedLotForDetail}
              isFavourite={isFavourite}
              onToggleFavourite={toggleFavourite}
              targetLat={activeLat}
              targetLng={activeLng}
              searchRadiusKm={filters.maxDistanceKm}
              onCenterTarget={handleCenterTarget}
              onMapMoveEnd={handleMapMoveEnd}
              zoomTarget={zoomTarget}
              isDarkMode={true}
              showInlineCard={false}
              isDesktop={false}
              parkingDurationHours={parkingDurationHours}
              gpsFlyCounter={gpsFlyCounter}
            />
          </div>

          {/* In-Place Mobile List Mode View */}
          <AnimatePresence mode="wait">
            {viewMode === 'list' && (
              <motion.div
                key="mobile-list-view-container"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute inset-0 z-10 w-full h-full bg-slate-950/92 backdrop-blur-md"
              >
                <ModernListView
                  lots={filteredAndSortedLots}
                  isLoading={isLoading}
                  selectedLot={selectedLotForDetail}
                  onSelectLot={setSelectedLotForDetail}
                  onOpenDetail={setSelectedLotForDetail}
                  onExplainScore={setLotForScoreExplain}
                  isFavourite={isFavourite}
                  onToggleFavourite={toggleFavourite}
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                  parkingDurationHours={parkingDurationHours}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSwitchToMap={() => setViewMode('map')}
                  currentZoom={currentMapZoom}
                  searchQuery={searchQuery}
                  onSelectDistrictZoom={handleDistrictZoom}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified Top Bar */}
          <ModernTopBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedDestination={selectedDestination}
            onSelectDestination={dest => {
              setDestination(dest);
              setCustomSearchLocation(null);
              setIsMapMoved(false);
              if (dest) {
                setSelectedLotForDetail(null);
                setZoomTarget({ lat: dest.lat, lng: dest.lng, zoom: 15.5, timestamp: Date.now() });
              }
            }}
            isLocating={isLocating}
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
            favouritesCount={favouritesCount}
            onOpenFavourites={() => setIsFavouritesModalOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            parkingDurationHours={parkingDurationHours}
            onChangeDurationHours={setParkingDurationHours}
            matchingLotsCount={searchQuery.trim() ? filteredAndSortedLots.length : 0}
          />

          {/* Horizontal Swipeable Carousel (In Map View only) */}
          <AnimatePresence>
            {viewMode === 'map' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
              >
                <ModernCarousel
                  lots={filteredAndSortedLots}
                  selectedLot={selectedLotForDetail}
                  onSelectLot={setSelectedLotForDetail}
                  onOpenDetail={setSelectedLotForDetail}
                  isFavourite={isFavourite}
                  onToggleFavourite={toggleFavourite}
                  parkingDurationHours={parkingDurationHours}
                  currentZoom={currentMapZoom}
                  searchQuery={searchQuery}
                  mapCenter={mapCenter}
                  onSelectDistrictZoom={handleDistrictZoom}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Bottom Navigation & Mode Switcher Bar */}
          <ModernBottomBar
            totalCount={filteredAndSortedLots.length}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            isOffline={isOffline}
            isUsingCachedData={isUsingCachedData}
          />
        </div>
      )}

      {/* ── Favourites Modal View ── */}
      {isFavouritesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div className="flex-1 w-full" onClick={() => setIsFavouritesModalOpen(false)} />
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl shadow-2xl max-h-[85vh] h-[80vh] flex flex-col w-full max-w-2xl mx-auto p-4 overflow-hidden">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h2 className="text-lg font-black text-white">{t.favourites.title}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 border border-amber-700 text-amber-300 font-bold">
                  {favouriteLots.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFavouritesModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FavouritesView
                favouriteLots={favouriteLots}
                onToggleFavourite={toggleFavourite}
                onSelectLot={lot => {
                  setSelectedLotForDetail(lot);
                  setIsFavouritesModalOpen(false);
                  setViewMode('map');
                }}
                onExplainScore={setLotForScoreExplain}
                onGoToExplore={() => setIsFavouritesModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Carpark Details Modal ── */}
      <ParkingDetailModal
        scoredLot={selectedLotForDetail}
        isFavourite={selectedLotForDetail ? isFavourite(selectedLotForDetail.lot.id) : false}
        onToggleFavourite={toggleFavourite}
        onClose={() => setSelectedLotForDetail(null)}
        onExplainScore={lot => setLotForScoreExplain(lot)}
        parkingDurationHours={parkingDurationHours}
      />

      {/* ── AI Score Explain Modal ── */}
      <ScoreExplainModal
        scoredLot={lotForScoreExplain}
        onClose={() => setLotForScoreExplain(null)}
      />

      {/* ── App Settings Modal ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}
