import PropertyCard from './PropertyCard';
import { useDispatch, useSelector } from 'react-redux';
import { setHoveredListing } from '../../store/uiSlice';

export default function PropertyGrid({ listings = [], loading }) {
  const dispatch = useDispatch();
  const hoveredId = useSelector((s) => s.ui.hoveredListingId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-80" />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No listings found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <PropertyCard
          key={listing._id}
          listing={listing}
          isHovered={hoveredId === listing._id}
          onHover={(id) => dispatch(setHoveredListing(id))}
        />
      ))}
    </div>
  );
}
