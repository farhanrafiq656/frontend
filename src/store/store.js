import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import filtersReducer from './filtersSlice';
import uiReducer from './uiSlice';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
