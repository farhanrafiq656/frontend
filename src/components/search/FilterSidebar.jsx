import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters } from '../../store/filtersSlice';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const PROPERTY_TYPES = ['house', 'condo', 'townhouse', 'multi-family', 'land', 'commercial'];

export default function FilterSidebar({ facets, onClose }) {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.filters);
  const [showMore, setShowMore] = useState(false);

  const update = (key, value) => dispatch(setFilter({ [key]: value }));

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-[#E7DDD5] sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#7B5328]" />
          <h2 className="font-semibold text-[#1C1917]">Filters</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => dispatch(clearFilters())} className="text-sm text-[#7B5328] hover:underline font-medium">
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917]">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-7 flex-1">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-2">Location</label>
          <input
            type="text"
            placeholder="City or ZIP code..."
            value={filters.q || ''}
            onChange={(e) => update('q', e.target.value)}
            className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-2">Property Type</label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => update('propertyType', e.target.value)}
            className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328] appearance-none"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-2">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min..."
              value={filters.minPrice || ''}
              onChange={(e) => update('minPrice', e.target.value)}
              className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
            />
            <span className="text-[#A8A29E] font-medium">–</span>
            <input
              type="number"
              placeholder="Max..."
              value={filters.maxPrice || ''}
              onChange={(e) => update('maxPrice', e.target.value)}
              className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-2">Bedrooms</label>
          <select
            value={filters.minBeds || ''}
            onChange={(e) => update('minBeds', e.target.value)}
            className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
          >
            <option value="">Any</option>
            {['1', '2', '3', '4', '5'].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-2">Bathrooms</label>
          <select
            value={filters.minBaths || ''}
            onChange={(e) => update('minBaths', e.target.value)}
            className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
          >
            <option value="">Any</option>
            {['1', '2', '3', '4'].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>

        {/* More Filters (collapsible) */}
        <div>
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 text-sm font-semibold text-[#44403C] hover:text-[#7B5328] transition-colors"
          >
            <SlidersHorizontal size={14} />
            {showMore ? 'Hide Filters' : 'More Filters'}
          </button>

          {showMore && (
            <div className="mt-4 space-y-5">
              {/* Listing Type */}
              <div>
                <label className="block text-sm font-semibold text-[#1C1917] mb-2">Listing Type</label>
                <div className="flex gap-2">
                  {[['', 'All'], ['sale', 'For Sale'], ['rent', 'For Rent']].map(([val, label]) => (
                    <button key={val} onClick={() => update('listingType', val)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${filters.listingType === val ? 'bg-[#7B5328] text-white border-[#7B5328]' : 'border-[#E7DDD5] text-[#44403C] hover:border-[#7B5328]'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <label className="block text-sm font-semibold text-[#1C1917] mb-2">Square Footage</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min sqft" value={filters.minSqft || ''}
                    onChange={(e) => update('minSqft', e.target.value)}
                    className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328]" />
                  <span className="text-[#A8A29E]">–</span>
                  <input type="number" placeholder="Max sqft" value={filters.maxSqft || ''}
                    onChange={(e) => update('maxSqft', e.target.value)}
                    className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328]" />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-[#1C1917] mb-2">Sort By</label>
                <select value={filters.sortBy || 'newest'} onChange={(e) => update('sortBy', e.target.value)}
                  className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328]">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="sqft_desc">Largest First</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div>
                <label className="block text-sm font-semibold text-[#1C1917] mb-2">Special</label>
                <div className="space-y-2.5">
                  {[
                    { key: 'isNewConstruction', label: 'New Construction' },
                    { key: 'priceReduced', label: 'Price Reduced' },
                    { key: 'hasOpenHouse', label: 'Open House' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={!!filters[key]} onChange={(e) => update(key, e.target.checked)}
                        className="w-4 h-4 rounded border-[#E7DDD5] accent-[#7B5328]" />
                      <span className="text-sm text-[#44403C]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply button */}
      <div className="p-5 border-t border-[#E7DDD5] sticky bottom-0 bg-white">
        <button className="w-full btn-brand py-3 flex items-center justify-center gap-2">
          <SlidersHorizontal size={16} /> Apply Filters
        </button>
      </div>
    </div>
  );
}
