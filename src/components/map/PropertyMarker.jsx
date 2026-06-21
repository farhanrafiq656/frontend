import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { setHoveredListing } from '../../store/uiSlice';

// Brown price-badge pin SVG
const createPricePin = (price, isHovered) => {
  const bg = isHovered ? '#5C3D1E' : '#7B5328';
  const shadow = isHovered ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.25)';
  const label = formatPriceShort(price);
  const w = Math.max(56, label.length * 9 + 20);
  return L.divIcon({
    html: `
      <div style="
        background:${bg};
        color:white;
        font-size:11px;
        font-weight:700;
        padding:4px 8px;
        border-radius:20px;
        white-space:nowrap;
        box-shadow:${shadow};
        border:2px solid white;
        transform:${isHovered ? 'scale(1.15)' : 'scale(1)'};
        transition:transform 0.15s ease;
        cursor:pointer;
        position:relative;
      ">${label}<span style="
        content:'';
        position:absolute;
        bottom:-7px;
        left:50%;
        transform:translateX(-50%);
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:7px solid ${bg};
        display:block;
        width:0;height:0;
      "></span></div>
    `,
    className: '',
    iconSize: [w, 32],
    iconAnchor: [w / 2, 38],
    popupAnchor: [0, -40],
  });
};

function formatPriceShort(cents) {
  if (!cents) return '$0';
  const dollars = cents / 100;
  if (dollars >= 1000000) return `$${(dollars / 1000000).toFixed(1)}M`;
  if (dollars >= 1000) return `$${Math.round(dollars / 1000)}K`;
  return `$${dollars.toLocaleString()}`;
}

function formatPriceFull(cents, listingType) {
  if (!cents) return '$0';
  const dollars = cents / 100;
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(dollars);
  return listingType === 'rent' ? `${formatted}/mo` : formatted;
}

export default function PropertyMarker({ listing, isHovered }) {
  const dispatch = useDispatch();
  const coords = listing.location?.coordinates;
  if (!coords || coords.length < 2) return null;

  const cover = listing.images?.find((i) => i.isCover) || listing.images?.[0];

  return (
    <Marker
      position={[coords[1], coords[0]]}
      icon={createPricePin(listing.price, isHovered)}
      eventHandlers={{
        mouseover: () => dispatch(setHoveredListing(listing._id)),
        mouseout: () => dispatch(setHoveredListing(null)),
      }}
      zIndexOffset={isHovered ? 1000 : 0}
    >
      <Popup
        maxWidth={240}
        className="nestwell-popup"
      >
        <div className="w-56 font-sans" style={{ fontFamily: 'inherit' }}>
          {/* Image */}
          {cover?.url && (
            <div className="overflow-hidden rounded-t-lg -mx-3 -mt-3 mb-3">
              <img
                src={cover.url}
                alt={listing.title}
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Price + Type badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917' }}>
              {formatPriceFull(listing.price, listing.listingType)}
            </span>
            <span style={{
              fontSize: '10px', fontWeight: '700', padding: '2px 7px',
              borderRadius: '20px', background: '#F5F0EB', color: '#7B5328',
              border: '1px solid #E7DDD5', textTransform: 'uppercase',
            }}>
              {listing.listingType}
            </span>
          </div>

          {/* Title */}
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#44403C', marginBottom: '3px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {listing.title}
          </p>

          {/* Address */}
          <p style={{ fontSize: '11px', color: '#A8A29E', marginBottom: '6px' }}>
            {listing.address?.city}, {listing.address?.state}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#78716C', marginBottom: '10px' }}>
            {listing.features?.bedrooms != null && <span>🛏 {listing.features.bedrooms} bd</span>}
            {listing.features?.bathrooms != null && <span>🚿 {listing.features.bathrooms} ba</span>}
            {listing.features?.squareFootage && <span>📐 {listing.features.squareFootage.toLocaleString()} ft²</span>}
          </div>

          {/* View Property button */}
          <Link
            to={`/listing/${listing._id}`}
            style={{
              display: 'block', textAlign: 'center', background: '#7B5328', color: 'white',
              padding: '7px 0', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
              textDecoration: 'none',
            }}
          >
            View Property →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
