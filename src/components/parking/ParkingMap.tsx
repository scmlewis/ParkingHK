import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ScoredParkingLot } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { formatDistance, formatWalkingTime } from '../../services/distanceService';
import { VacancyBadge } from '../common/VacancyBadge';
import { DISTRICTS, SUB_DISTRICTS } from '../../constants/districts';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Locate, Navigation, X, ChevronRight, ChevronLeft, Zap, Star, Plus, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ParkingMapProps {
  lots: ScoredParkingLot[];
  selectedLot: ScoredParkingLot | null;
  onSelectLot: (lot: ScoredParkingLot | null) => void;
  onOpenDetail?: (lot: ScoredParkingLot | null) => void;
  isFavourite?: (id: string) => boolean;
  onToggleFavourite?: (id: string) => void;
  targetLat: number | null;
  targetLng: number | null;
  searchRadiusKm: number;
  onCenterTarget: () => void;
  isDarkMode?: boolean;
  showInlineCard?: boolean;
  onMapMoveEnd?: (
    center: { lat: number; lng: number },
    bounds: { north: number; south: number; east: number; west: number },
    zoom: number
  ) => void;
  zoomTarget?: { lat: number; lng: number; zoom?: number; timestamp: number } | null;
  isDesktop?: boolean;
  parkingDurationHours?: number;
  gpsFlyCounter?: number;
}

// Distance helper
function getDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Fast SVG marker generator
function createCarparkMarkerSvg(
  lotId: string,
  status: 'AVAILABLE' | 'LIMITED' | 'FULL' | 'UNKNOWN',
  count: number | null,
  hourlyRate: number | null | undefined,
  hasEV: boolean | undefined,
  isSelected: boolean,
  durationHours: number = 1,
  isClosed: boolean = false
): string {
  let priceText = 'P';
  if (hourlyRate != null) {
    const totalCost = hourlyRate * durationHours;
    priceText = `$${totalCost} · ${durationHours}h`;
  }
  const statusColor = isClosed ? '#64748b' :
    status === 'AVAILABLE' ? '#10b981' : status === 'LIMITED' ? '#f59e0b' : status === 'FULL' ? '#ef4444' : '#64748b';
  const evIcon = hasEV && !isClosed ? `<span style="color:#38bdf8;font-size:10px;margin-right:2px;">⚡</span>` : '';
  const statusDot = `<span class="price-pill-dot" style="background-color:${statusColor};"></span>`;
  const opacity = isClosed ? 'opacity:0.55;' : '';

  return `
    <div id="marker-lot-${lotId}" class="price-pill-marker ${isSelected ? 'selected' : ''}" style="${opacity}">
      ${evIcon}<span>${priceText}</span>${statusDot}
    </div>
  `;
}

// Hong Kong Territory strict geographic boundary constants
export const HK_BOUNDS = L.latLngBounds(
  [22.08, 113.72], // South-West
  [22.62, 114.52]  // North-East
);

export const HK_CENTER: [number, number] = [22.3193, 114.1694];

// Pre-computed static mappings for lot -> districts to eliminate redundant string parsing & geo math
const lotToSubDistrictCache = new Map<string, string[]>();

function getMatchedSubDistrictsForLot(lot: { id: string; name: { en: string; tc: string }; address: { en: string; tc: string }; latitude: number; longitude: number }): string[] {
  const cached = lotToSubDistrictCache.get(lot.id);
  if (cached) return cached;

  const matchedIds: string[] = [];
  const nameEn = lot.name.en.toLowerCase();
  const addrEn = lot.address.en.toLowerCase();

  SUB_DISTRICTS.forEach(sub => {
    const subEn = sub.name.en.toLowerCase();
    const nameMatch =
      nameEn.includes(subEn) ||
      lot.name.tc.includes(sub.name.tc) ||
      addrEn.includes(subEn) ||
      lot.address.tc.includes(sub.name.tc);

    if (nameMatch) {
      matchedIds.push(sub.id);
      return;
    }

    const dist = getDistKm(lot.latitude, lot.longitude, sub.center.lat, sub.center.lng);
    if (dist <= sub.radiusKm * 1.5) {
      matchedIds.push(sub.id);
    }
  });

  lotToSubDistrictCache.set(lot.id, matchedIds);
  return matchedIds;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  lots,
  selectedLot,
  onSelectLot,
  onOpenDetail,
  isFavourite,
  onToggleFavourite,
  targetLat,
  targetLng,
  searchRadiusKm,
  onCenterTarget,
  showInlineCard = false,
  onMapMoveEnd,
  zoomTarget,
  isDesktop = false,
  parkingDurationHours = 1,
  gpsFlyCounter = 0
}) => {
  const { lang, t } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const districtLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const selectedLotIdRef = useRef<string | null>(null);
  selectedLotIdRef.current = selectedLot?.lot.id ?? null;

  const onSelectLotRef = useRef(onSelectLot);
  onSelectLotRef.current = onSelectLot;

  const onMapMoveEndRef = useRef(onMapMoveEnd);
  onMapMoveEndRef.current = onMapMoveEnd;

  const prevTargetRef = useRef<{ lat: number; lng: number } | null>(null);
  const prevFlyCountRef = useRef(0);

  const [currentZoom, setCurrentZoom] = useState(13);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute car parks per District
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DISTRICTS.forEach(d => {
      counts[d.id] = 0;
    });

    lots.forEach(item => {
      const lot = item.lot;
      if (!lot.latitude || !lot.longitude) return;

      const matched = DISTRICTS.find(
        d =>
          d.id === lot.districtCode ||
          lot.district.en.toLowerCase().includes(d.name.en.toLowerCase()) ||
          lot.district.tc.includes(d.name.tc)
      );

      if (matched) {
        counts[matched.id] = (counts[matched.id] || 0) + 1;
      } else {
        let closestId = 'CW';
        let minDist = 999;
        DISTRICTS.forEach(d => {
          const dist = getDistKm(lot.latitude, lot.longitude, d.center.lat, d.center.lng);
          if (dist < minDist) {
            minDist = dist;
            closestId = d.id;
          }
        });
        counts[closestId] = (counts[closestId] || 0) + 1;
      }
    });

    return counts;
  }, [lots]);

  // Compute car parks per Sub-District with cached lookup for O(N) performance
  const subDistrictCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SUB_DISTRICTS.forEach(sub => {
      counts[sub.id] = 0;
    });

    lots.forEach(item => {
      const lot = item.lot;
      if (!lot.latitude || !lot.longitude) return;

      const matchedIds = getMatchedSubDistrictsForLot({
        id: lot.id,
        name: lot.name,
        address: lot.address,
        latitude: lot.latitude,
        longitude: lot.longitude
      });

      matchedIds.forEach(id => {
        if (counts[id] !== undefined) {
          counts[id] += 1;
        }
      });
    });

    return counts;
  }, [lots]);

  // External Zoom Target trigger
  useEffect(() => {
    if (!zoomTarget || !mapInstanceRef.current) return;
    const { lat, lng, zoom = 15.2 } = zoomTarget;
    mapInstanceRef.current.flyTo([lat, lng], zoom, {
      duration: 0.85,
      easeLinearity: 0.25
    });
  }, [zoomTarget]);

  // Contextual Auto-Zoom: Smoothly fit viewport when search radius changes
  const prevRadiusRef = useRef<number>(searchRadiusKm);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !targetLat || !targetLng) return;

    if (prevRadiusRef.current !== searchRadiusKm && isFinite(searchRadiusKm) && searchRadiusKm > 0) {
      prevRadiusRef.current = searchRadiusKm;

      // Calculate bounding box for search radius circle
      const radiusMeters = searchRadiusKm * 1000;
      const latDelta = (radiusMeters / 111320);
      const lngDelta = (radiusMeters / (111320 * Math.cos(targetLat * (Math.PI / 180))));

      const bounds = L.latLngBounds(
        [targetLat - latDelta, targetLng - lngDelta],
        [targetLat + latDelta, targetLng + lngDelta]
      );

      map.flyToBounds(bounds, {
        paddingTopLeft: [24, isDesktop ? 24 : 90],
        paddingBottomRight: [24, isDesktop ? 24 : 160],
        maxZoom: 16.2,
        duration: 0.75,
        easeLinearity: 0.25
      });
    }
  }, [searchRadiusKm, targetLat, targetLng, isDesktop]);

  // Fit all currently filtered lots into view
  const handleFitAllResults = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || lots.length === 0) return;

    const validLots = lots.filter(l => l.lot.latitude && l.lot.longitude);
    if (validLots.length === 0) return;

    if (validLots.length === 1 && validLots[0].lot.latitude && validLots[0].lot.longitude) {
      map.flyTo([validLots[0].lot.latitude, validLots[0].lot.longitude], 15.8, {
        duration: 0.75,
        easeLinearity: 0.25
      });
      return;
    }

    const points: [number, number][] = validLots.map(l => [l.lot.latitude!, l.lot.longitude!]);
    if (targetLat && targetLng) {
      points.push([targetLat, targetLng]);
    }

    const bounds = L.latLngBounds(points);
    map.flyToBounds(bounds, {
      paddingTopLeft: [32, isDesktop ? 32 : 100],
      paddingBottomRight: [32, isDesktop ? 32 : 170],
      maxZoom: 16.5,
      duration: 0.85,
      easeLinearity: 0.25
    });
  }, [lots, targetLat, targetLng, isDesktop]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = targetLat && targetLat >= 22.08 && targetLat <= 22.62 ? targetLat : HK_CENTER[0];
    const initialLng = targetLng && targetLng >= 113.72 && targetLng <= 114.52 ? targetLng : HK_CENTER[1];

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      minZoom: 10.5,
      maxZoom: 19,
      maxBounds: HK_BOUNDS,
      maxBoundsViscosity: 0.95,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      bounceAtZoomLimits: true,
      tapTolerance: 30
    });

    // Clean Dark Gray basemap (Zero watermarks, crisp roads and no contour clutter)
    const baseLayer = L.tileLayer(
      'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 16,
        maxZoom: 19,
        subdomains: ['server', 'services'],
        opacity: 0.95
      }
    );
    baseLayer.addTo(map);

    // Dark labels and boundaries overlay
    const labelLayer = L.tileLayer(
      'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 16,
        maxZoom: 19,
        subdomains: ['server', 'services'],
        opacity: 0.9
      }
    );
    labelLayer.addTo(map);

    // District Layer Group
    const districtLayer = L.layerGroup().addTo(map);
    districtLayerGroupRef.current = districtLayer;

    // MarkerClusterGroup for High Zoom individual car parks
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 20,
      maxClusterRadius: (zoom) => (zoom >= 17 ? 15 : zoom >= 15.5 ? 28 : 42),
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      animate: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = 'cluster-small';
        let diameter = 38;

        if (count > 30) {
          sizeClass = 'cluster-large';
          diameter = 48;
        } else if (count > 10) {
          sizeClass = 'cluster-medium';
          diameter = 42;
        }

        const countSuffix = lang === 'tc' ? '處' : 'lots';

        return L.divIcon({
          html: `<div class="custom-cluster-badge ${sizeClass}">
            <span class="font-extrabold leading-none">${count}</span>
            <span class="text-[9px] font-bold opacity-90 leading-tight uppercase">${countSuffix}</span>
          </div>`,
          className: 'custom-cluster-marker',
          iconSize: [diameter, diameter],
          iconAnchor: [diameter / 2, diameter / 2]
        });
      }
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapInstanceRef.current = map;

    const handleZoomUpdate = () => {
      const z = map.getZoom();
      setCurrentZoom(z);
    };

    map.on('zoom', handleZoomUpdate);
    map.on('zoomend', handleZoomUpdate);

    map.on('click', (e) => {
      const target = e.originalEvent?.target as HTMLElement;
      if (!target?.closest('.price-pill-marker') && !target?.closest('.district-pill-container')) {
        onSelectLotRef.current(null);
      }
    });

    // Debounced moveend handler for silky smooth performance
    const handleMoveEnd = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (onMapMoveEndRef.current && mapInstanceRef.current) {
          const c = mapInstanceRef.current.getCenter();
          const b = mapInstanceRef.current.getBounds();
          const z = mapInstanceRef.current.getZoom();
          setCurrentZoom(z);
          onMapMoveEndRef.current(
            { lat: c.lat, lng: c.lng },
            {
              north: b.getNorth(),
              south: b.getSouth(),
              east: b.getEast(),
              west: b.getWest()
            },
            z
          );
        }
      }, 150);
    };

    map.on('moveend', handleMoveEnd);

    // Trigger initial notification
    setTimeout(handleMoveEnd, 50);

    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update target circle and center marker, and fly to new GPS position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !targetLat || !targetLng) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([targetLat, targetLng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-60"></span>
            <div class="relative w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-md"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarkerRef.current = L.marker([targetLat, targetLng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(map);
    }

    // Fly to target on GPS re-center click or when target changes
    const flyCountChanged = prevFlyCountRef.current !== gpsFlyCounter;
    prevFlyCountRef.current = gpsFlyCounter;
    const targetChanged = !prevTargetRef.current || prevTargetRef.current.lat !== targetLat || prevTargetRef.current.lng !== targetLng;
    if (flyCountChanged || targetChanged) {
      prevTargetRef.current = { lat: targetLat, lng: targetLng };
      map.flyTo([targetLat, targetLng], Math.max(map.getZoom(), 15), {
        duration: 1,
        easeLinearity: 0.25
      });
    }

    if (circleLayerRef.current) {
      circleLayerRef.current.remove();
      circleLayerRef.current = null;
    }

    if (isFinite(searchRadiusKm) && searchRadiusKm > 0) {
      circleLayerRef.current = L.circle([targetLat, targetLng], {
        radius: searchRadiusKm * 1000,
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6'
      }).addTo(map);
    }
  }, [targetLat, targetLng, searchRadiusKm, gpsFlyCounter]);

  // Main Render Layer: Switch between Tier 1 (18 Districts), Tier 2 (Sub-districts), Tier 3 (Car Parks)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const clusterGroup = clusterGroupRef.current;
    const districtLayer = districtLayerGroupRef.current;
    if (!map || !clusterGroup || !districtLayer) return;

    const zoom = map.getZoom();

    clusterGroup.clearLayers();
    districtLayer.clearLayers();
    markersMapRef.current.clear();

    if (zoom < 13.5) {
      // Tier 1: 18 Main Districts
      DISTRICTS.forEach(district => {
        const count = districtCounts[district.id] || 0;
        if (count === 0) return;

        const countText = lang === 'tc' ? `${count} 個停車場` : `${count} car parks`;
        const districtName = district.name[lang];

        const html = `
          <div class="district-pill-container" title="${districtName}">
            <div class="district-pill-badge">P</div>
            <div class="district-pill-content">
              <span class="district-pill-name">${districtName}</span>
              <span class="district-pill-count">${countText}</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html,
          className: 'custom-district-marker',
          iconSize: [140, 36],
          iconAnchor: [70, 18]
        });

        const marker = L.marker([district.center.lat, district.center.lng], { icon });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          map.flyTo([district.center.lat, district.center.lng], 15.2, {
            duration: 0.8,
            easeLinearity: 0.25
          });
        });

        districtLayer.addLayer(marker);
      });
    } else if (zoom < 14.8) {
      // Tier 2: Sub-Districts / Neighborhoods
      SUB_DISTRICTS.forEach(sub => {
        const count = subDistrictCounts[sub.id] || 0;
        if (count === 0) return;

        const countText = lang === 'tc' ? `${count} 個停車場` : `${count} car parks`;
        const subName = sub.name[lang];

        const html = `
          <div class="district-pill-container" title="${subName}">
            <div class="district-pill-badge">P</div>
            <div class="district-pill-content">
              <span class="district-pill-name">${subName}</span>
              <span class="district-pill-count">${countText}</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html,
          className: 'custom-district-marker',
          iconSize: [130, 34],
          iconAnchor: [65, 17]
        });

        const marker = L.marker([sub.center.lat, sub.center.lng], { icon });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          map.flyTo([sub.center.lat, sub.center.lng], 15.6, {
            duration: 0.8,
            easeLinearity: 0.25
          });
        });

        districtLayer.addLayer(marker);
      });
    } else {
      // Tier 3: Individual Car Parks & Live Prices (Clustered & Batched)
      const markers: L.Marker[] = [];
      const currentSelectedId = selectedLotIdRef.current;

      lots.forEach(item => {
        const { lot, vacancyStatus, selectedVacancy } = item;
        if (!lot.latitude || !lot.longitude) return;

        const isSelected = currentSelectedId === lot.id;
        const count = selectedVacancy?.vacancy ?? null;

        const markerHtml = createCarparkMarkerSvg(
          lot.id,
          vacancyStatus,
          count,
          lot.pricing?.hourlyRate && !lot.pricing?.estimated ? lot.pricing.hourlyRate : null,
          lot.facilities?.evCharging,
          isSelected,
          parkingDurationHours,
          lot.openingStatus === 'CLOSED'
        );

        const customIcon = L.divIcon({
          className: 'custom-carpark-marker',
          html: markerHtml,
          iconSize: [84, 30],
          iconAnchor: [42, 15]
        });

        const marker = L.marker([lot.latitude, lot.longitude], {
          icon: customIcon,
          zIndexOffset: isSelected ? 800 : (vacancyStatus === 'AVAILABLE' ? 100 : 10)
        });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectLotRef.current(item);
        });

        markersMapRef.current.set(lot.id, marker);
        markers.push(marker);
      });

      clusterGroup.addLayers(markers);
    }
  }, [lots, lang, currentZoom, districtCounts, subDistrictCounts, parkingDurationHours]);

  // Fast DOM selection class toggle & Pan/Zoom to center without rebuilding all markers
  useEffect(() => {
    if (!selectedLot) {
      document.querySelectorAll('.price-pill-marker.selected').forEach(el => el.classList.remove('selected'));
      return;
    }

    const lotId = selectedLot.lot.id;
    // Remove selected class from previous
    document.querySelectorAll('.price-pill-marker.selected').forEach(el => el.classList.remove('selected'));

    // Add selected class to newly selected
    const el = document.getElementById(`marker-lot-${lotId}`);
    if (el) {
      el.classList.add('selected');
    }

    const map = mapInstanceRef.current;
    if (!map || !selectedLot.lot.latitude || !selectedLot.lot.longitude) return;

    const lat = selectedLot.lot.latitude;
    const lng = selectedLot.lot.longitude;

    if (map.getZoom() < 15.0) {
      if (!isDesktop) {
        // Offset latitude upward so mobile bottom sheet/carousel does not obscure the marker
        const latOffset = 0.0022;
        map.flyTo([lat - latOffset, lng], 16.2, { duration: 0.8, easeLinearity: 0.25 });
      } else {
        map.flyTo([lat, lng], 16.2, { duration: 0.8, easeLinearity: 0.25 });
      }
    } else {
      if (!isDesktop) {
        const zoom = map.getZoom();
        const latOffset = 0.0028 * Math.pow(2, 15 - zoom);
        map.panTo([lat - latOffset, lng], { animate: true, duration: 0.35 });
      } else {
        map.panTo([lat, lng], { animate: true, duration: 0.35 });
      }
    }
  }, [selectedLot, isDesktop]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-full min-h-[350px] overflow-hidden bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div
        className={`absolute right-3 sm:right-4 z-25 flex flex-col gap-2 pointer-events-auto select-none transition-all ${
          isDesktop ? 'bottom-6' : 'bottom-[180px] sm:bottom-[190px]'
        }`}
      >
        {/* Zoom In & Out Controls */}
        <div className="flex flex-col bg-slate-900/95 rounded-2xl border border-slate-700/90 shadow-2xl overflow-hidden backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer flex items-center justify-center border-b border-slate-800"
            title={lang === 'tc' ? '放大地圖' : 'Zoom In'}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer flex items-center justify-center"
            title={lang === 'tc' ? '縮小地圖' : 'Zoom Out'}
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Fit All Results Button */}
        {lots.length > 1 && (
          <button
            type="button"
            onClick={handleFitAllResults}
            className="p-2.5 rounded-2xl bg-slate-900/95 text-slate-200 border border-slate-700/90 shadow-2xl hover:bg-slate-800 hover:text-sky-300 transition active:scale-95 cursor-pointer backdrop-blur-md flex items-center justify-center min-w-[42px] min-h-[42px]"
            title={lang === 'tc' ? '全覽所有搜尋結果' : 'Fit all results in view'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Recenter on Target / Current Location */}
        <button
          type="button"
          onClick={onCenterTarget}
          className="p-2.5 rounded-2xl bg-slate-900/95 text-sky-400 border border-slate-700/90 shadow-2xl hover:bg-slate-800 hover:text-sky-300 transition active:scale-95 cursor-pointer backdrop-blur-md flex items-center justify-center min-w-[42px] min-h-[42px]"
          title={lang === 'tc' ? '返回定位中心' : 'Center on target'}
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>

      {/* Swipeable Bottom Peek Card */}
      {showInlineCard && selectedLot && (
        <div className="absolute bottom-3 left-3 right-3 z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-3.5 sm:p-4 text-slate-100 max-w-lg mx-auto">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {selectedLot.lot.district[lang]}
                  </span>
                  {selectedLot.lot.facilities?.evCharging && (
                    <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                      <Zap className="w-2.5 h-2.5 mr-0.5 text-emerald-400" />
                      EV
                    </span>
                  )}
                  {isFavourite && onToggleFavourite && (
                    <button
                      type="button"
                      onClick={() => onToggleFavourite(selectedLot.lot.id)}
                      className="p-1 -m-1 text-slate-400 hover:text-amber-400 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Toggle favourite"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isFavourite(selectedLot.lot.id) ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {selectedLot.lot.name[lang]}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                {(() => {
                  const currentIndex = lots.findIndex(l => l.lot.id === selectedLot.lot.id);
                  if (currentIndex === -1 || lots.length <= 1) return null;
                  const prevLot = lots[(currentIndex - 1 + lots.length) % lots.length];
                  const nextLot = lots[(currentIndex + 1) % lots.length];
                  return (
                    <div className="flex items-center gap-0.5 bg-slate-800/80 rounded-xl p-0.5 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => onSelectLot(prevLot)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                        title="Previous car park"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 px-1 font-semibold">
                        {currentIndex + 1}/{lots.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectLot(nextLot)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                        title="Next car park"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => onSelectLot(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center ml-0.5"
                  title="Close card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-xs mb-3">
              <div>
                <span className="text-slate-400 text-[10px] block mb-0.5">
                  {lang === 'tc' ? '車位' : 'Spaces'}
                </span>
                <VacancyBadge
                  status={selectedLot.vacancyStatus}
                  count={selectedLot.selectedVacancy?.vacancy ?? null}
                  size="sm"
                  isClosed={selectedLot.lot.openingStatus === 'CLOSED'}
                />
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block mb-0.5">
                  {lang === 'tc' ? '距離' : 'Distance'}
                </span>
                <span className="font-bold text-slate-200">
                  {formatDistance(selectedLot.distanceMeters, lang)}
                </span>
                {selectedLot.walkingMinutes !== null && (
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {formatWalkingTime(selectedLot.walkingMinutes, lang, selectedLot.distanceMeters)}
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block mb-0.5">
                  {lang === 'tc' ? '時租' : 'Rate'}
                </span>
                <span className="font-extrabold text-sky-300">
                  {selectedLot.lot.pricing?.hourlyRate != null && !selectedLot.lot.pricing?.estimated
                    ? `HK$${selectedLot.lot.pricing.hourlyRate}/時`
                    : (lang === 'tc' ? '現場公布' : 'On-site')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLot.lot.latitude},${selectedLot.lot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 active:scale-98 transition cursor-pointer min-h-[42px]"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.detail.navigate}</span>
              </a>

              {onOpenDetail && (
                <button
                  type="button"
                  onClick={() => onOpenDetail(selectedLot)}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer min-h-[42px]"
                >
                  <span>{lang === 'tc' ? '詳情' : 'Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
