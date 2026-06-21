import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MarkerClusterGroupWrapper from './MarkerClusterGroup';
import PropertyMarker from './PropertyMarker';
import 'leaflet/dist/leaflet.css';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function FitBounds({ listings }) {
  const map = useMap();
  useEffect(() => {
    if (!listings?.length) return;
    const valid = listings.filter((l) => l.location?.coordinates?.length === 2);
    if (valid.length === 0) return;
    const bounds = valid.map((l) => [l.location.coordinates[1], l.location.coordinates[0]]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [listings, map]);
  return null;
}

export default function MapView({ listings = [], center = [39.5, -98.35], zoom = 5, singleListing = false, onBoundsSearch }) {
  const hoveredId = useSelector((s) => s.ui.hoveredListingId);

  return (
    <div className="w-full h-full min-h-[400px]">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="rounded-xl">
        <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />

        {!singleListing && <FitBounds listings={listings} />}

        <MarkerClusterGroupWrapper>
          {listings.map((listing) => {
            if (!listing.location?.coordinates?.length) return null;
            return (
              <PropertyMarker
                key={listing._id}
                listing={listing}
                isHovered={hoveredId === listing._id}
              />
            );
          })}
        </MarkerClusterGroupWrapper>

        {onBoundsSearch && (
          <SearchThisAreaButton onSearch={onBoundsSearch} />
        )}
      </MapContainer>
    </div>
  );
}

function SearchThisAreaButton({ onSearch }) {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-center" style={{ top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
      <button
        onClick={() => {
          const bounds = map.getBounds();
          const polygon = {
            type: 'Polygon',
            coordinates: [[
              [bounds.getWest(), bounds.getSouth()],
              [bounds.getWest(), bounds.getNorth()],
              [bounds.getEast(), bounds.getNorth()],
              [bounds.getEast(), bounds.getSouth()],
              [bounds.getWest(), bounds.getSouth()],
            ]],
          };
          onSearch(polygon);
        }}
        className="bg-white shadow-lg border border-gray-200 text-sm font-medium text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50"
      >
        Search this area
      </button>
    </div>
  );
}
