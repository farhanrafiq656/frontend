import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useGetListingQuery, useCreateLeadMutation, useAnalyzeMarketMutation } from '../store/apiSlice';
import MapView from '../components/map/MapView';
import { leadSchema } from '../lib/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import { Bed, Bath, Square, Calendar, MapPin, Share2, Heart, Phone, Mail, ChevronLeft, ChevronRight, TrendingUp, Check } from 'lucide-react';

const fmt = (cents) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);

function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) {
    return <div className="w-full h-80 bg-[#F5F0EB] rounded-2xl flex items-center justify-center text-[#A8A29E]">No photos available</div>;
  }
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden bg-[#F5F0EB]" style={{ height: 420 }}>
        <img src={images[idx]?.url} alt="" className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md transition-colors">
              <ChevronLeft size={18} className="text-[#1C1917]" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md transition-colors">
              <ChevronRight size={18} className="text-[#1C1917]" />
            </button>
            <span className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {idx + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === idx ? 'border-[#7B5328]' : 'border-transparent'}`}>
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: listing, isLoading } = useGetListingQuery(id);
  const [createLead, { isLoading: submitting }] = useCreateLeadMutation();
  const [analyzeMarket, { isLoading: analyzing, data: cmaData }] = useAnalyzeMarketMutation();
  const [tourMode, setTourMode] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(leadSchema) });

  const onContact = async (data) => {
    try {
      await createLead({ listingId: id, ...data }).unwrap();
      toast.success(tourMode ? 'Tour requested!' : 'Message sent to agent!');
      reset();
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleCMA = async () => {
    try {
      await analyzeMarket({ listingId: id }).unwrap();
    } catch {
      toast.error('Could not generate market analysis');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="h-96 bg-white rounded-2xl animate-pulse mb-6" />
        <div className="h-48 bg-white rounded-2xl animate-pulse" />
      </div>
    );
  }
  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4 text-center">
        <p className="text-xl font-semibold text-[#1C1917] mb-2">Property not found</p>
        <button onClick={() => navigate('/search')} className="text-[#7B5328] hover:underline text-sm">Back to search</button>
      </div>
    );
  }

  const agent = listing.listedBy;
  const center = listing.location?.coordinates
    ? [listing.location.coordinates[1], listing.location.coordinates[0]]
    : [39.5, -98.35];

  return (
    <div className="bg-[#F5F0EB] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-[#A8A29E] mb-5 flex items-center gap-2">
          <Link to="/" className="hover:text-[#7B5328] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/search" className="hover:text-[#7B5328] transition-colors">Properties</Link>
          <span>›</span>
          <span className="text-[#1C1917]">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image carousel */}
            <ImageCarousel images={listing.images} />

            {/* Title & price */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7DDD5]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-3xl font-bold text-[#1C1917] mb-1">{fmt(listing.price)}</p>
                  <h1 className="text-xl font-semibold text-[#7B5328]">{listing.title}</h1>
                  <div className="flex items-center gap-1.5 text-sm text-[#78716C] mt-1">
                    <MapPin size={14} />
                    {listing.address?.street}, {listing.address?.city}, {listing.address?.state} {listing.address?.zip}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${listing.listingType === 'sale' ? 'bg-[#F5F0EB] text-[#7B5328]' : 'bg-green-100 text-green-700'}`}>
                    {listing.propertyType?.charAt(0).toUpperCase() + listing.propertyType?.slice(1)}
                  </span>
                  <button className="w-9 h-9 border border-[#E7DDD5] rounded-full flex items-center justify-center hover:border-[#7B5328] transition-colors">
                    <Share2 size={16} className="text-[#78716C]" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { icon: <Bed size={20} className="text-[#78716C]" />, label: 'Bedrooms', val: listing.features?.bedrooms },
                  { icon: <Bath size={20} className="text-[#78716C]" />, label: 'Bathrooms', val: listing.features?.bathrooms },
                  { icon: <Square size={20} className="text-[#78716C]" />, label: 'Sq Ft', val: listing.features?.squareFootage?.toLocaleString() },
                  { icon: <Calendar size={20} className="text-[#78716C]" />, label: 'Year Built', val: listing.features?.yearBuilt },
                ].filter(({ val }) => val != null).map(({ icon, label, val }) => (
                  <div key={label} className="border border-[#E7DDD5] rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">{icon}</div>
                    <p className="text-lg font-bold text-[#1C1917]">{val}</p>
                    <p className="text-xs text-[#A8A29E]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7DDD5]">
              <h2 className="text-lg font-bold text-[#1C1917] mb-3">About This Property</h2>
              <p className="text-[#44403C] leading-relaxed text-sm">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7DDD5]">
                <h2 className="text-lg font-bold text-[#1C1917] mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-[#44403C]">
                      <Check size={14} className="text-[#7B5328] flex-shrink-0" />
                      <span className="capitalize">{a.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Market Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7DDD5]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-[#1C1917]">AI Market Analysis</h2>
                <button onClick={handleCMA} disabled={analyzing}
                  className="flex items-center gap-1.5 text-sm text-[#7B5328] border border-[#7B5328] rounded-xl px-3 py-1.5 hover:bg-[#7B5328] hover:text-white transition-colors disabled:opacity-50">
                  <TrendingUp size={14} /> {analyzing ? 'Analyzing...' : 'Run CMA'}
                </button>
              </div>
              {cmaData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Low estimate', val: fmt(cmaData.estimated_value_low_cents) },
                      { label: 'Point estimate', val: fmt(cmaData.estimated_value_point_cents), highlight: true },
                      { label: 'High estimate', val: fmt(cmaData.estimated_value_high_cents) },
                    ].map(({ label, val, highlight }) => (
                      <div key={label} className="text-center p-3 bg-[#F5F0EB] rounded-xl">
                        <p className="text-xs text-[#78716C] mb-1">{label}</p>
                        <p className={`font-bold ${highlight ? 'text-[#7B5328] text-lg' : 'text-[#1C1917]'}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-[#44403C]">{cmaData.summary}</p>
                </div>
              ) : (
                <p className="text-sm text-[#A8A29E]">Click "Run CMA" to get an AI-powered market analysis for this property.</p>
              )}
            </div>

            {/* Location map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7DDD5]">
              <h2 className="text-lg font-bold text-[#1C1917] mb-4">Location</h2>
              <div className="h-64 rounded-xl overflow-hidden">
                <MapView listings={[listing]} center={center} zoom={14} singleListing />
              </div>
            </div>
          </div>

          {/* Right — agent card + contact */}
          <div className="space-y-4">
            {/* Agent card */}
            {agent && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E7DDD5]">
                <div className="flex items-center gap-3 mb-4">
                  {agent.avatarUrl ? (
                    <img src={agent.avatarUrl} alt={agent.name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#7B5328] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {agent.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <Link to={`/agents/${agent._id}`} className="font-semibold text-[#1C1917] hover:text-[#7B5328] transition-colors block">{agent.name}</Link>
                    {agent.agentProfile?.brokerageName && (
                      <div className="flex items-center gap-1 text-xs text-[#78716C] mt-0.5">
                        <MapPin size={11} /> {agent.agentProfile.brokerageName}
                      </div>
                    )}
                    {agent.agentProfile?.bio && (
                      <p className="text-xs text-[#78716C] mt-1 line-clamp-2">{agent.agentProfile.bio}</p>
                    )}
                  </div>
                </div>

                {agent.email && (
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-sm text-[#44403C] hover:text-[#7B5328] mb-2 transition-colors">
                    <Mail size={14} className="text-[#A8A29E]" /> {agent.email}
                  </a>
                )}
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm text-[#44403C] hover:text-[#7B5328] transition-colors">
                    <Phone size={14} className="text-[#A8A29E]" /> {agent.phone}
                  </a>
                )}
              </div>
            )}

            {/* Contact form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E7DDD5]">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTourMode(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${!tourMode ? 'bg-[#7B5328] text-white' : 'border border-[#E7DDD5] text-[#44403C] hover:border-[#7B5328]'}`}>
                  Contact Agent
                </button>
                <button onClick={() => setTourMode(true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tourMode ? 'bg-[#7B5328] text-white' : 'border border-[#E7DDD5] text-[#44403C] hover:border-[#7B5328]'}`}>
                  Request Tour
                </button>
              </div>

              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-sm text-[#78716C] mb-4">Sign in to contact the agent</p>
                  <button onClick={() => navigate('/login')} className="w-full btn-brand py-3 flex items-center justify-center gap-2">
                    Sign in to Contact
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onContact)} className="space-y-3">
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder={tourMode ? "Tell the agent when you'd like to visit..." : "I'm interested in this property..."}
                    className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] resize-none bg-white"
                  />
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                  {tourMode && (
                    <input
                      {...register('requestedTourTime')}
                      type="datetime-local"
                      className="w-full border border-[#E7DDD5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
                    />
                  )}
                  <input type="hidden" {...register('tourRequested')} value={String(tourMode)} />
                  <button type="submit" disabled={submitting} className="w-full btn-brand py-3 disabled:opacity-50">
                    {submitting ? 'Sending...' : tourMode ? 'Request Tour' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Listing type badge */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E7DDD5] text-center">
              <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full ${listing.listingType === 'sale' ? 'bg-[#F5F0EB] text-[#7B5328]' : 'bg-green-50 text-green-700'}`}>
                For {listing.listingType === 'sale' ? 'Sale' : 'Rent'}
              </span>
              {listing.price && listing.features?.squareFootage && (
                <p className="text-xs text-[#A8A29E] mt-2">
                  ${Math.round((listing.price / 100) / listing.features.squareFootage).toLocaleString()} per sqft
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
