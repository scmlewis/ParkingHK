import { useState, useCallback } from 'react';
import { Destination } from '../domain/types';
import { DEFAULT_HK_CENTER } from '../constants/districts';

// Hong Kong approximate bounding box
const HK_BOUNDS = { south: 22.08, north: 22.62, west: 113.72, east: 114.52 };

function isWithinHongKong(lat: number, lng: number): boolean {
  return lat >= HK_BOUNDS.south && lat <= HK_BOUNDS.north && lng >= HK_BOUNDS.west && lng <= HK_BOUNDS.east;
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isLocating: boolean;
  permissionStatus: 'PROMPT' | 'GRANTED' | 'DENIED' | 'UNSUPPORTED';
  locationName: string | null;
  isCustomDestination: boolean;
  selectedDestination: Destination | null;
  error: string | null;
}

export function useUserLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    isLocating: false,
    permissionStatus: 'PROMPT',
    locationName: null,
    isCustomDestination: false,
    selectedDestination: null,
    error: null
  });

  // Explicit user action to request GPS location
  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        isLocating: false,
        permissionStatus: 'UNSUPPORTED',
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (!isWithinHongKong(lat, lng)) {
          setLocationState(prev => ({
            ...prev,
            isLocating: false,
            error: 'Your location appears to be outside Hong Kong. The app is optimised for Hong Kong car parks only.'
          }));
          return;
        }

        setLocationState({
          latitude: lat,
          longitude: lng,
          accuracy: position.coords.accuracy,
          isLocating: false,
          permissionStatus: 'GRANTED',
          locationName: null,
          isCustomDestination: false,
          selectedDestination: null,
          error: null
        });
      },
      error => {
        let msg = 'Failed to get your location.';
        let perm: LocationState['permissionStatus'] = 'PROMPT';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please choose a district or search a destination.';
          perm = 'DENIED';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }

        setLocationState(prev => ({
          ...prev,
          isLocating: false,
          permissionStatus: perm,
          error: msg
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        // Accept a cached fix up to 60s old: recenter taps reuse the last fix
        // instead of forcing a slow, battery-hungry cold GPS lock every time
        maximumAge: 60000
      }
    );
  }, []);

  // Set explicit destination
  const setDestination = useCallback((destination: Destination | null) => {
    if (destination) {
      setLocationState({
        latitude: destination.latitude,
        longitude: destination.longitude,
        accuracy: null,
        isLocating: false,
        permissionStatus: 'GRANTED',
        locationName: destination.name.tc,
        isCustomDestination: true,
        selectedDestination: destination,
        error: null
      });
    } else {
      // Reset back to default HK center
      setLocationState(prev => ({
        ...prev,
        latitude: DEFAULT_HK_CENTER.lat,
        longitude: DEFAULT_HK_CENTER.lng,
        isCustomDestination: false,
        selectedDestination: null,
        locationName: null
      }));
    }
  }, []);

  // Set custom coordinates (e.g. clicking on map or custom search)
  const setCustomCoordinates = useCallback((lat: number, lng: number, name?: string) => {
    setLocationState({
      latitude: lat,
      longitude: lng,
      accuracy: null,
      isLocating: false,
      permissionStatus: 'GRANTED',
      locationName: name || null,
      isCustomDestination: true,
      selectedDestination: null,
      error: null
    });
  }, []);

  return {
    ...locationState,
    requestCurrentLocation,
    setDestination,
    setCustomCoordinates
  };
}
