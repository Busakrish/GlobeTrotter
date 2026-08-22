import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Custom Map Marker Icon Fix for Leaflet
const createCustomIcon = (label, color = '#4f46e5') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

export function TripMap({ cities = [], height = 'h-80', className = '' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Filter valid coordinate stops
    const validCities = cities.filter(
      (c) => Array.isArray(c.coordinates) && c.coordinates.length === 2
    );

    const defaultCenter = validCities.length > 0 ? validCities[0].coordinates : [20.5937, 78.9629]; // Default India center

    // Clean up previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: validCities.length > 1 ? 5 : 6,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Add markers and polyline
      const latlngs = [];

      validCities.forEach((city, index) => {
        const marker = L.marker(city.coordinates, {
          icon: createCustomIcon(index + 1),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 2px;">
            <strong style="font-size: 13px; color: #0f172a;">${index + 1}. ${city.name}</strong>
            <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">${city.country || 'India'} • ${city.nights || 2} Nights</p>
          </div>
        `);

        latlngs.push(city.coordinates);
      });

      // Draw polyline connecting cities
      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: '#4f46e5',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 8',
        }).addTo(map);

        // Fit map bounds to encompass all city stops
        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch (err) {
      console.warn('Map render issue:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cities]);

  if (!cities.length) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 rounded-2xl ${height}`}>
        <p className="text-xs text-slate-400">No destination coordinates to display.</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${height} ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

export default TripMap;
