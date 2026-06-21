import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hydrateFromUrl, setFilter, setPage } from '../store/filtersSlice';
import { useSearchListingsQuery } from '../store/apiSlice';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import PropertyCard from '../components/listings/PropertyCard';
import PropertyGrid from '../components/listings/PropertyGrid';
import FilterSidebar from '../components/search/FilterSidebar';
import MapView from '../components/map/MapView';
import { SlidersHorizontal, LayoutGrid, Map } from 'lucide-react';

const omitEmpty = (obj) => {
  const result = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== '' && v !== false && v !== null && v !== undefined) result[k] = v;
  });
  return result;
};

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useSelector((s) => s.filters);
  const debouncedFilters = useDebouncedValue(filters, 300);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(hydrateFromUrl(params));
  }, []);

  useEffect(() => {
    const clean = omitEmpty(debouncedFilters);
    setSearchParams(clean, { replace: true });
  }, [debouncedFilters]);

  const { data, isLoading, isFetching } = useSearchListingsQuery(omitEmpty(debouncedFilters));

  const results = data?.results || [];
  const pagination = data?.pagination;
  const facets = data?.facets;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F0EB]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-[#E7DDD5] overflow-y-auto bg-white shadow-sm">
        <FilterSidebar facets={facets} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="bg-black/40 flex-1" onClick={() => setSidebarOpen(false)} />
          <div className="w-80 bg-white h-full overflow-y-auto shadow-xl">
            <FilterSidebar facets={facets} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-[#E7DDD5] px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-sm font-semibold text-[#1C1917]">
              {isLoading ? 'Searching...' : `${pagination?.totalCount?.toLocaleString() || results.length} properties found`}
            </p>
            <p className="text-xs text-[#A8A29E]">Showing filtered results</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#E7DDD5] rounded-xl text-sm text-[#44403C] bg-white hover:border-[#7B5328]"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* View toggle */}
            <div className="flex items-center border border-[#E7DDD5] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[#7B5328] text-white' : 'text-[#44403C] hover:bg-[#F5F0EB]'}`}
              >
                <LayoutGrid size={15} /> Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-[#7B5328] text-white' : 'text-[#44403C] hover:bg-[#F5F0EB]'}`}
              >
                <Map size={15} /> Map View
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex flex-1 overflow-hidden`}>
          {viewMode === 'map' ? (
            // Map layout: list on left, map on right
            <>
              <div className="w-1/2 overflow-y-auto p-4 space-y-4">
                {(isLoading || isFetching) ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
                  ))
                ) : results.map((listing) => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))}
              </div>
              <div className="w-1/2 flex-shrink-0">
                <MapView
                  listings={results}
                  onBoundsSearch={(polygon) => dispatch(setFilter({ boundary: JSON.stringify(polygon), lat: '', lng: '', radiusMiles: '' }))}
                />
              </div>
            </>
          ) : (
            // Grid layout
            <div className="flex-1 overflow-y-auto p-5">
              {(isLoading || isFetching) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-72 bg-white rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-lg font-semibold text-[#1C1917] mb-2">No properties found</p>
                  <p className="text-sm text-[#78716C]">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((listing) => (
                    <PropertyCard key={listing._id} listing={listing} />
                  ))}
                </div>
              )}

              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 pb-4">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => dispatch(setPage(pagination.page - 1))}
                    className="px-4 py-2 border border-[#E7DDD5] rounded-xl text-sm text-[#44403C] disabled:opacity-40 hover:border-[#7B5328] hover:text-[#7B5328] transition-colors bg-white"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#78716C]">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => dispatch(setPage(pagination.page + 1))}
                    className="px-4 py-2 border border-[#E7DDD5] rounded-xl text-sm text-[#44403C] disabled:opacity-40 hover:border-[#7B5328] hover:text-[#7B5328] transition-colors bg-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
