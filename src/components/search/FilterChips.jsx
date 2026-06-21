import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/filtersSlice';
import { X } from 'lucide-react';

export default function FilterChips() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.filters);

  const chips = [];

  if (filters.q) chips.push({ label: `"${filters.q}"`, key: 'q', value: '' });
  if (filters.listingType) chips.push({ label: filters.listingType === 'sale' ? 'For Sale' : 'For Rent', key: 'listingType', value: '' });
  if (filters.minBeds) chips.push({ label: `${filters.minBeds}+ beds`, key: 'minBeds', value: '' });
  if (filters.minBaths) chips.push({ label: `${filters.minBaths}+ baths`, key: 'minBaths', value: '' });
  if (filters.minPrice || filters.maxPrice) {
    const label = [filters.minPrice && `$${(filters.minPrice/100).toLocaleString()}`, filters.maxPrice && `$${(filters.maxPrice/100).toLocaleString()}`].filter(Boolean).join(' – ');
    chips.push({ label, key: '__price', value: null });
  }
  if (filters.isNewConstruction) chips.push({ label: 'New Construction', key: 'isNewConstruction', value: false });
  if (filters.priceReduced) chips.push({ label: 'Price Reduced', key: 'priceReduced', value: false });
  if (filters.hasOpenHouse) chips.push({ label: 'Open House', key: 'hasOpenHouse', value: false });
  if (filters.hasVirtualTour) chips.push({ label: 'Virtual Tour', key: 'hasVirtualTour', value: false });
  if (filters.amenities) {
    filters.amenities.split(',').filter(Boolean).forEach((a) => {
      chips.push({
        label: a.replace(/_/g, ' '),
        onRemove: () => {
          const updated = filters.amenities.split(',').filter((x) => x !== a).join(',');
          dispatch(setFilter({ amenities: updated }));
        },
      });
    });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium capitalize">
          {chip.label}
          <button onClick={() => chip.onRemove ? chip.onRemove() : chip.key !== '__price' ? dispatch(setFilter({ [chip.key]: chip.value })) : dispatch(setFilter({ minPrice: '', maxPrice: '' }))} className="hover:text-blue-900">
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}
