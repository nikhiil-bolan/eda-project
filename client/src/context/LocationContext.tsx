import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLocation } from '../types';

interface LocationContextType {
  userLocation: UserLocation | null;
  isCapturing: boolean;
  locationError: string | null;
  requestLiveLocation: () => Promise<boolean>;
  setManualLocation: (city: string, state: string, lat: number, lng: number) => void;
  calculateDistance: (stationLat: number, stationLng: number) => number;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
}

// Major Indian city coordinates for quick presets or reverse matching
export const CITY_PRESETS = [
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 }
];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem('evision_user_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Haversine distance calculator in kilometers
  const calculateDistance = (stationLat: number, stationLng: number): number => {
    if (!userLocation) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = ((stationLat - userLocation.lat) * Math.PI) / 180;
    const dLon = ((stationLng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((stationLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const inferNearestCity = (lat: number, lng: number): { city: string; state: string } => {
    let minDistance = Infinity;
    let closest = { city: 'Mumbai', state: 'Maharashtra' };

    for (const preset of CITY_PRESETS) {
      const R = 6371;
      const dLat = ((preset.lat - lat) * Math.PI) / 180;
      const dLon = ((preset.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) * Math.cos((preset.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      if (dist < minDistance) {
        minDistance = dist;
        closest = { city: preset.city, state: preset.state };
      }
    }
    return closest;
  };

  const requestLiveLocation = (): Promise<boolean> => {
    setIsCapturing(true);
    setLocationError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser.');
        setIsCapturing(false);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          const inferred = inferNearestCity(lat, lng);

          const loc: UserLocation = {
            lat,
            lng,
            city: inferred.city,
            state: inferred.state,
            accuracy: Math.round(accuracy),
            isLive: true,
            capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setUserLocation(loc);
          localStorage.setItem('evision_user_location', JSON.stringify(loc));
          setIsCapturing(false);
          setShowLocationModal(false);
          resolve(true);
        },
        (error) => {
          let msg = 'Could not acquire precise GPS fix.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Please select your city preset below.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'GPS location timed out. Using default nearest metro hub.';
          }
          setLocationError(msg);
          setIsCapturing(false);

          // Fallback to Mumbai if nothing previously set
          if (!userLocation) {
            const fallback: UserLocation = {
              lat: 19.0760,
              lng: 72.8777,
              city: 'Mumbai',
              state: 'Maharashtra',
              isLive: false,
              capturedAt: 'Default Preset'
            };
            setUserLocation(fallback);
            localStorage.setItem('evision_user_location', JSON.stringify(fallback));
          }
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  const setManualLocation = (city: string, state: string, lat: number, lng: number) => {
    const loc: UserLocation = {
      lat,
      lng,
      city,
      state,
      isLive: false,
      capturedAt: 'Manual City Preset'
    };
    setUserLocation(loc);
    localStorage.setItem('evision_user_location', JSON.stringify(loc));
    setShowLocationModal(false);
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isCapturing,
        locationError,
        requestLiveLocation,
        setManualLocation,
        calculateDistance,
        showLocationModal,
        setShowLocationModal
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

