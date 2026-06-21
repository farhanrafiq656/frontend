import { Link } from 'react-router-dom';
import { Bed, Bath, Square, Heart, MapPin } from 'lucide-react';
import { useSaveListingMutation } from '../../store/apiSlice';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const formatPrice = (cents) => {
  if (!cents) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
};

export default function PropertyCard({ listing, isHovered, onHover }) {
  const { isAuthenticated, user } = useAuth();
  const [saveListing] = useSaveListingMutation();

  const cover = listing.images?.find((i) => i.isCover) || listing.images?.[0];
  const isSaved = user?.savedListings?.map(String)?.includes(String(listing._id));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in to save listings'); return; }
    try {
      await saveListing(listing._id).unwrap();
      toast.success(isSaved ? 'Removed from saved' : 'Saved!');
    } catch {
      toast.error('Failed to save listing');
    }
  };

  return (
    <Link
      to={`/listing/${listing._id}`}
      className={`block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 ${isHovered ? 'ring-2 ring-[#7B5328] shadow-lg' : 'shadow-sm'}`}
      onMouseEnter={() => onHover?.(listing._id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F0EB]">
        {cover ? (
          <img
            src={cover.url}
            alt={listing.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A8A29E] text-sm">No photo available</div>
        )}

        {listing.priceReducedAt && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white bg-orange-500 shadow-sm">
            Price Reduced
          </span>
        )}

        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm ${isSaved ? 'text-red-500' : 'text-[#A8A29E]'}`}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        <div className="text-xl font-bold text-[#1C1917] mb-0.5">{formatPrice(listing.price)}</div>
        <div className="text-sm font-medium text-[#7B5328] mb-1.5 truncate">{listing.title}</div>

        <div className="flex items-center gap-3 text-sm text-[#78716C] mb-3">
          {listing.features?.bedrooms != null && (
            <span className="flex items-center gap-1"><Bed size={13} /> {listing.features.bedrooms}</span>
          )}
          {listing.features?.bathrooms != null && (
            <span className="flex items-center gap-1"><Bath size={13} /> {listing.features.bathrooms}</span>
          )}
          {listing.features?.squareFootage && (
            <span className="flex items-center gap-1"><Square size={13} /> {listing.features.squareFootage.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-[#A8A29E]">
          <MapPin size={12} />
          <span className="truncate">{listing.address?.city}, {listing.address?.state}</span>
        </div>
      </div>
    </Link>
  );
}
