import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../context/LocationContext';
import { fetchStations } from '../services/api';
import { ChargingStation } from '../types';
import {
  MapPin,
  Zap,
  Navigation,
  Compass,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

// Custom Map Controller to smoothly pan to selected city or user location
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

// Create custom colored SVG marker icons for Leaflet
const createIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-ev-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg); font-weight: 800; font-size: 11px; color: white;">⚡</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const userLocationIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      background-color: #2563EB;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export const MapView: React.FC = () => {
  const { userLocation, calculateDistance, setShowLocationModal } = useLocation();

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]);
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchStations();
      const withDist = data.map(s => ({
        ...s,
        distanceKm: calculateDistance(s.latitude, s.longitude)
      }));
      setStations(withDist);

      if (userLocation) {
        setMapCenter([userLocation.lat, userLocation.lng]);
        setZoomLevel(12);
      }
    }
    load();
  }, [userLocation]);

  const quickCities = [
    { name: 'My GPS Location', lat: userLocation?.lat || 19.0760, lng: userLocation?.lng || 72.8777, zoom: 13 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
    { name: 'New Delhi', lat: 28.6139, lng: 77.2090, zoom: 12 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, zoom: 12 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, zoom: 12 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, zoom: 12 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, zoom: 12 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>🗺️ Spatial EV Charging Station Map</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-bold border border-teal-200 dark:border-teal-800">
              Live Network
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click any pin marker to view connector speeds, available bays, and reserve a charging slot
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-xl shadow-sm">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold">High Demand</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-gray-700 dark:text-gray-300 font-semibold">You</span>
          </div>
        </div>
      </div>

      {/* Quick City Navigation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {quickCities.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              setMapCenter([c.lat, c.lng]);
              setZoomLevel(c.zoom);
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-teal-500 hover:text-teal-600 font-bold transition-all shadow-sm"
          >
            {c.name === 'My GPS Location' ? '📍 My GPS Location' : c.name}
          </button>
        ))}
      </div>

      {/* Main Map Box */}
      <div className="relative h-[650px] w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-800">
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={zoomLevel} />

          {/* CartoDB Positron / Voyager clean white basemap tiles for modern Google/Tata look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* User's GPS Location Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <div className="font-bold text-blue-600">📍 You Are Here</div>
                  <div>{userLocation.city}, {userLocation.state}</div>
                  <div className="text-[10px] text-gray-500">Live GPS Coordinates</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Station Markers */}
          {stations.map((st) => {
            const isAvail = st.availableConnectors > 0;
            const markerColor = isAvail ? '#10B981' : '#F59E0B';

            return (
              <Marker
                key={st.id}
                position={[st.latitude, st.longitude]}
                icon={createIcon(markerColor, st.name)}
                eventHandlers={{
                  click: () => setSelectedStation(st)
                }}
              >
                <Popup>
                  <div className="p-2 max-w-xs text-xs font-sans space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                        {st.operator}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                        {st.name}
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">{st.address}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-gray-100">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {st.availableConnectors}/{st.totalConnectors} Open
                      </span>
                      <span className="text-teal-600 font-extrabold">
                        {st.distanceKm !== undefined ? `${st.distanceKm} km away` : ''}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-2">
                      <Link
                        to={`/station/${st.id}`}
                        className="flex-1 py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-center text-xs shadow-sm"
                      >
                        ⚡ Book Slot
                      </Link>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

