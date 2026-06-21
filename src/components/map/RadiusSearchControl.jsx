import { useState } from 'react';
import { Circle, useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../store/filtersSlice';
import { useGeolocation } from '../../hooks/useGeolocation';
import { MapPin, Navigation } from 'lucide-react';

export default function RadiusSearchControl() {
  const dispatch = useDispatch();
  const map = useMap();
  const { getLocation, location: geoLocation, loading } = useGeolocation();
  const [center, setCenter] = useState(null);
  const [radius, setRadius] = useState(10);

  const handleMapClick = () => {
    map.once('click', (e) => {
      setCenter({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  };

  const handleUseMyLocation = async () => {
    getLocation();
    if (geoLocation) setCenter(geoLocation);
  };

  const handleSearch = () => {
    if (!center) return;
    dispatch(setFilter({ lat: center.lat.toString(), lng: center.lng.toString(), radiusMiles: radius.toString(), boundary: '' }));
  };

  const handleClear = () => {
    setCenter(null);
    dispatch(setFilter({ lat: '', lng: '', radiusMiles: '' }));
  };

  return (
    <>
      {center && <Circle center={[center.lat, center.lng]} radius={radius * 1609.34} pathOptions={{ color: '#2563eb', fillOpacity: 0.1 }} />}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-3 w-64">
        <div className="text-sm font-medium text-gray-800 mb-2">Radius Search</div>
        <div className="flex gap-2 mb-2">
          <button onClick={handleMapClick} className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 border border-gray-300 rounded-lg hover:border-blue-400 text-gray-600">
            <MapPin size={12} /> Click map
          </button>
          <button onClick={handleUseMyLocation} disabled={loading} className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 border border-gray-300 rounded-lg hover:border-blue-400 text-gray-600 disabled:opacity-50">
            <Navigation size={12} /> My location
          </button>
        </div>
        {center && (
          <>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">Radius: {radius} miles</label>
              <input type="range" min={1} max={50} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSearch} className="flex-1 text-xs bg-blue-600 text-white rounded-lg py-1.5 hover:bg-blue-700">Search</button>
              <button onClick={handleClear} className="flex-1 text-xs border border-gray-300 rounded-lg py-1.5 text-gray-600 hover:bg-gray-50">Clear</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
