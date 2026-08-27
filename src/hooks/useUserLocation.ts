import { useState, useCallback } from 'react';
import { Destination } from '../domain/types';
import { DEFAULT_HK_CENTER } from '../constants/districts';

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
    latitude: DEFAULT_HK_CENTER.lat,
    longitude: DEFAULT_HK_CENTER.lng,
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
        setLocationState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          isLocating: false,
          permissionStatus: 'GRANTED',
          locationName: null, // "Near Me"
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
        timeout: 10000,
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
