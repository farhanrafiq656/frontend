import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    viewMode: 'grid',
    mapVisible: true,
    filterSidebarOpen: false,
    hoveredListingId: null,
    chatOpen: false,
  },
  reducers: {
    setViewMode: (state, action) => { state.viewMode = action.payload; },
    toggleMapVisible: (state) => { state.mapVisible = !state.mapVisible; },
    toggleFilterSidebar: (state) => { state.filterSidebarOpen = !state.filterSidebarOpen; },
    setHoveredListing: (state, action) => { state.hoveredListingId = action.payload; },
    toggleChat: (state) => { state.chatOpen = !state.chatOpen; },
    closeChat: (state) => { state.chatOpen = false; },
  },
});

export const { setViewMode, toggleMapVisible, toggleFilterSidebar, setHoveredListing, toggleChat, closeChat } = uiSlice.actions;
export default uiSlice.reducer;
