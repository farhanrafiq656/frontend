import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from '../lib/apiBase';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: 'include',
  }),
  tagTypes: ['Listing', 'User', 'Lead', 'SavedSearch', 'Agent'],
  endpoints: (builder) => ({
    // Listings
    searchListings: builder.query({
      query: (params) => ({ url: '/listings/search', params }),
      providesTags: ['Listing'],
    }),
    getListing: builder.query({
      query: (id) => `/listings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Listing', id }],
    }),
    getListingsByAgent: builder.query({
      query: ({ agentId, ...params }) => ({ url: `/listings/agent/${agentId}`, params }),
      providesTags: ['Listing'],
    }),
    createListing: builder.mutation({
      query: (body) => ({ url: '/listings', method: 'POST', body }),
      invalidatesTags: ['Listing'],
    }),
    updateListing: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/listings/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Listing'],
    }),
    deleteListing: builder.mutation({
      query: (id) => ({ url: `/listings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Listing'],
    }),
    addListingImage: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/listings/${id}/images`, method: 'POST', body }),
      invalidatesTags: (r, e, { id }) => [{ type: 'Listing', id }],
    }),
    deleteListingImage: builder.mutation({
      query: ({ id, publicId }) => ({ url: `/listings/${id}/images/${encodeURIComponent(publicId)}`, method: 'DELETE' }),
      invalidatesTags: ['Listing'],
    }),

    // Auth
    signup: builder.mutation({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),

    // Users
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    saveListing: builder.mutation({
      query: (listingId) => ({ url: `/users/saved-listings/${listingId}`, method: 'POST' }),
      invalidatesTags: ['User'],
    }),
    getSavedListings: builder.query({
      query: () => '/users/saved-listings',
      providesTags: ['User'],
    }),
    getSavedSearches: builder.query({
      query: () => '/users/saved-searches',
      providesTags: ['SavedSearch'],
    }),
    createSavedSearch: builder.mutation({
      query: (body) => ({ url: '/users/saved-searches', method: 'POST', body }),
      invalidatesTags: ['SavedSearch'],
    }),
    deleteSavedSearch: builder.mutation({
      query: (id) => ({ url: `/users/saved-searches/${id}`, method: 'DELETE' }),
      invalidatesTags: ['SavedSearch'],
    }),

    // Agents
    getAgentProfile: builder.query({
      query: (agentId) => `/agents/${agentId}`,
      providesTags: (r, e, agentId) => [{ type: 'Agent', id: agentId }],
    }),
    getAgentAnalytics: builder.query({
      query: (params) => ({ url: '/agents/me/analytics', params }),
      providesTags: ['Agent'],
    }),
    getLeads: builder.query({
      query: (params) => ({ url: '/agents/me/leads', params }),
      providesTags: ['Lead'],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/agents/me/leads/${id}`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Lead'],
    }),
    getAgentReviews: builder.query({
      query: (agentId) => `/agents/${agentId}/reviews`,
    }),
    createReview: builder.mutation({
      query: ({ agentId, ...body }) => ({ url: `/agents/${agentId}/reviews`, method: 'POST', body }),
    }),

    // Leads
    createLead: builder.mutation({
      query: ({ listingId, ...body }) => ({ url: `/listings/${listingId}/leads`, method: 'POST', body }),
    }),

    // Become agent
    becomeAgent: builder.mutation({
      query: (body) => ({ url: '/users/become-agent', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),

    // Stripe
    createCheckoutSession: builder.mutation({
      query: (body) => ({ url: '/stripe/create-checkout-session', method: 'POST', body }),
    }),
    createPortalSession: builder.mutation({
      query: () => ({ url: '/stripe/create-portal-session', method: 'POST', body: {} }),
    }),

    // Upload signature
    getUploadSignature: builder.mutation({
      query: () => ({ url: '/uploads/signature', method: 'POST', body: {} }),
    }),

    // Agent report
    getPropertyReport: builder.query({
      query: (listingId) => `/agents/me/listings/${listingId}/report`,
    }),

    // AI
    generateDescription: builder.mutation({
      query: (body) => ({ url: '/ai/generate-description', method: 'POST', body }),
    }),
    analyzeMarket: builder.mutation({
      query: (body) => ({ url: '/ai/analyze-market', method: 'POST', body }),
    }),
    sendChatMessage: builder.mutation({
      query: (body) => ({ url: '/ai/chat', method: 'POST', body }),
    }),
  }),
});

export const {
  useSearchListingsQuery,
  useGetListingQuery,
  useGetListingsByAgentQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useAddListingImageMutation,
  useDeleteListingImageMutation,
  useSignupMutation,
  useUpdateProfileMutation,
  useSaveListingMutation,
  useGetSavedListingsQuery,
  useGetSavedSearchesQuery,
  useCreateSavedSearchMutation,
  useDeleteSavedSearchMutation,
  useGetAgentProfileQuery,
  useGetPropertyReportQuery,
  useGetAgentAnalyticsQuery,
  useGetLeadsQuery,
  useUpdateLeadStatusMutation,
  useGetAgentReviewsQuery,
  useCreateReviewMutation,
  useCreateLeadMutation,
  useBecomeAgentMutation,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  useGetUploadSignatureMutation,
  useGenerateDescriptionMutation,
  useAnalyzeMarketMutation,
  useSendChatMessageMutation,
} = apiSlice;
