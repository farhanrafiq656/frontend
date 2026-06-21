import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  q: '',
  listingType: '',
  propertyType: '',
  minPrice: '',
  maxPrice: '',
  minBeds: '',
  minBaths: '',
  minSqft: '',
  maxSqft: '',
  minYearBuilt: '',
  maxYearBuilt: '',
  garageSpaces: '',
  parkingType: '',
  status: '',
  amenities: '',
  isNewConstruction: false,
  priceReduced: false,
  hasOpenHouse: false,
  hasVirtualTour: false,
  isForeclosure: false,
  sortBy: 'newest',
  page: 1,
  limit: 20,
  lat: '',
  lng: '',
  radiusMiles: '',
  boundary: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      Object.assign(state, action.payload);
      state.page = 1;
    },
    setPage: (state, action) => { state.page = action.payload; },
    clearFilters: () => initialState,
    hydrateFromUrl: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setFilter, setPage, clearFilters, hydrateFromUrl } = filtersSlice.actions;
export default filtersSlice.reducer;
