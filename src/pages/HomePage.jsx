import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchListingsQuery } from '../store/apiSlice';
import PropertyCard from '../components/listings/PropertyCard';
import { Search, Shield, Users, Heart, ArrowRight } from 'lucide-react';

const HOW_IT_WORKS = [
  { icon: <Search size={28} className="text-[#78716C]" />, step: 'STEP 1', title: 'Search Properties', desc: 'Browse our curated catalog with advanced filters, map view, and neighborhood insights.' },
  { icon: <Heart size={28} className="text-[#78716C]" />, step: 'STEP 2', title: 'Save Favorites', desc: 'Save properties you love and compare them side by side to find your perfect match.' },
  { icon: <Users size={28} className="text-[#78716C]" />, step: 'STEP 3', title: 'Connect with Agents', desc: 'Reach out to trusted agents, schedule viewings, and get expert guidance throughout your journey.' },
];

const WHY_FEATURES = [
  { icon: <Shield size={20} className="text-[#7B5328]" />, title: 'Verified Listings', desc: 'Every property is verified by our team to ensure accuracy and quality.' },
  { icon: <Users size={20} className="text-[#7B5328]" />, title: 'Trusted Agents', desc: 'Connect with experienced agents who specialize in helping first-time buyers.' },
  { icon: <Heart size={20} className="text-[#7B5328]" />, title: 'Personalized Experience', desc: 'Save favorites, get recommendations, and track your home search journey.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useSearchListingsQuery({ sortBy: 'newest', limit: 6, status: 'available' });
  const listings = data?.results || [];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div className="bg-[#F5F0EB]">
      {/* Hero */}
      <section className="px-4 pt-16 pb-14 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E7DDD5] rounded-full px-4 py-1.5 text-sm text-[#44403C] mb-6 shadow-sm">
            <div className="w-5 h-5 bg-[#7B5328] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🏠</span>
            </div>
            Perfect for First-Time Buyers
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-[#1C1917] mb-5 leading-tight">
            Find Your <span className="text-[#7B5328]">Perfect Nest</span>
          </h1>
          <p className="text-lg text-[#78716C] mb-8 max-w-xl mx-auto leading-relaxed">
            Making your first home journey simple and stress-free. Browse curated properties, save your favorites, and connect with trusted agents.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city, neighborhood, or ZIP..."
                className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#E7DDD5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] shadow-sm"
              />
            </div>
            <button type="submit" className="btn-brand flex items-center gap-2 px-6 py-3.5 whitespace-nowrap">
              <Search size={16} /> Search Properties
            </button>
          </form>

          <div className="flex justify-center gap-8 text-sm text-[#78716C]">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#7B5328] inline-block"></span>1,000+ Active Listings</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#7B5328] inline-block"></span>500+ Happy Homeowners</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#7B5328] inline-block"></span>50+ Trusted Agents</span>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1C1917]">Featured Properties</h2>
              <p className="text-[#78716C] mt-1">Hand-picked homes curated just for you</p>
            </div>
            <button onClick={() => navigate('/search')} className="flex items-center gap-1 text-sm font-medium text-[#44403C] border border-[#E7DDD5] rounded-xl px-4 py-2 hover:border-[#7B5328] hover:text-[#7B5328] transition-colors">
              View All Properties <ArrowRight size={15} />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#F5F0EB] rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <PropertyCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1C1917] mb-2">How Nestwell Works</h2>
          <p className="text-[#78716C] mb-12">Finding your first home has never been easier. Follow these simple steps to start your journey.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  {icon}
                </div>
                <p className="text-xs font-semibold text-[#A8A29E] tracking-widest mb-2">{step}</p>
                <h3 className="text-lg font-bold text-[#1C1917] mb-2">{title}</h3>
                <p className="text-sm text-[#78716C] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nestwell */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#F5F0EB] border border-[#E7DDD5] rounded-full px-4 py-1 text-sm text-[#44403C] mb-5">Why Choose Nestwell</span>
            <h2 className="text-3xl font-bold text-[#1C1917] mb-4">Built for First-Time Homebuyers</h2>
            <p className="text-[#78716C] mb-8 leading-relaxed">
              We understand that buying your first home can be overwhelming. That's why we've designed Nestwell to make the process as simple and stress-free as possible.
            </p>
            <ul className="space-y-5">
              {WHY_FEATURES.map(({ icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#F5F0EB] rounded-lg flex items-center justify-center flex-shrink-0">{icon}</div>
                  <div>
                    <p className="font-semibold text-[#1C1917]">{title}</p>
                    <p className="text-sm text-[#78716C] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#7B5328] rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Trusted by Thousands</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '500+', label: 'Happy Homeowners' },
                { value: '1,000+', label: 'Active Listings' },
                { value: '50+', label: 'Trusted Agents' },
                { value: '4.9', label: 'Average Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-4xl font-bold">{value}</p>
                  <p className="text-[#D4B896] text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#3D5C36] rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Are You a Real Estate Agent?</h2>
              <p className="text-[#A8C9A0] text-sm leading-relaxed max-w-md">
                Join our platform to list properties, connect with motivated buyers, and grow your business. Get started with our agent subscription today.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => navigate('/become-agent')} className="flex items-center gap-2 bg-[#7B5328] text-white font-semibold rounded-xl px-5 py-3 hover:bg-[#6A4520] transition-colors text-sm whitespace-nowrap">
                View Pricing Plans <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('/agent/dashboard')} className="border-2 border-white text-white font-semibold rounded-xl px-5 py-3 hover:bg-white hover:text-[#3D5C36] transition-colors text-sm whitespace-nowrap">
                Go to Agent Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
