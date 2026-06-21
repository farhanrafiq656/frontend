import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useGetSavedListingsQuery, useGetSavedSearchesQuery, useDeleteSavedSearchMutation, useUpdateProfileMutation } from '../store/apiSlice';
import PropertyGrid from '../components/listings/PropertyGrid';
import { Bookmark, Heart, Settings, Bell, BellOff, Trash2, MapPin, Home } from 'lucide-react';

const TABS = [
  { key: 'saved', label: 'Saved Listings', icon: Heart },
  { key: 'searches', label: 'Saved Searches', icon: Bookmark },
  { key: 'settings', label: 'Account Settings', icon: Settings },
];

export default function UserDashboardPage() {
  const [tab, setTab] = useState('saved');
  const { user } = useAuth();
  const { data: savedListings, isLoading: loadingSaved } = useGetSavedListingsQuery();
  const { data: savedSearches } = useGetSavedSearchesQuery();
  const [deleteSearch] = useDeleteSavedSearchMutation();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
    try {
      await updateProfile({ name }).unwrap();
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Header */}
      <div className="bg-white border-b border-[#E7DDD5]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7B5328] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1C1917]">{user?.name}</h1>
              <p className="text-sm text-[#78716C]">{user?.email}</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 bg-[#F5F0EB] border border-[#E7DDD5] text-[#7B5328] px-3 py-1.5 rounded-xl text-sm font-medium">
              <Home size={14} />
              Member
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="max-w-5xl mx-auto px-4 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#F5F0EB] rounded-xl p-3 text-center border border-[#E7DDD5]">
              <p className="text-lg font-bold text-[#7B5328]">{savedListings?.length || 0}</p>
              <p className="text-xs text-[#78716C] mt-0.5">Saved Listings</p>
            </div>
            <div className="bg-[#F5F0EB] rounded-xl p-3 text-center border border-[#E7DDD5]">
              <p className="text-lg font-bold text-[#7B5328]">{savedSearches?.length || 0}</p>
              <p className="text-xs text-[#78716C] mt-0.5">Saved Searches</p>
            </div>
            <div className="bg-[#F5F0EB] rounded-xl p-3 text-center border border-[#E7DDD5] col-span-2 sm:col-span-1">
              <p className="text-lg font-bold text-[#7B5328]">Active</p>
              <p className="text-xs text-[#78716C] mt-0.5">Account Status</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  tab === key ? 'border-[#7B5328] text-[#7B5328]' : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'saved' && (
          <div>
            <h2 className="text-lg font-bold text-[#1C1917] mb-5">
              Saved Listings <span className="text-[#A8A29E] font-normal">({savedListings?.length || 0})</span>
            </h2>
            {!loadingSaved && !savedListings?.length ? (
              <div className="bg-white rounded-2xl border border-[#E7DDD5] p-16 text-center">
                <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={24} className="text-[#A8A29E]" />
                </div>
                <p className="font-semibold text-[#1C1917] mb-1">No saved listings yet</p>
                <p className="text-sm text-[#A8A29E]">Browse properties and heart the ones you love</p>
              </div>
            ) : (
              <PropertyGrid listings={savedListings} loading={loadingSaved} />
            )}
          </div>
        )}

        {tab === 'searches' && (
          <div>
            <h2 className="text-lg font-bold text-[#1C1917] mb-5">
              Saved Searches <span className="text-[#A8A29E] font-normal">({savedSearches?.length || 0})</span>
            </h2>
            {!savedSearches?.length ? (
              <div className="bg-white rounded-2xl border border-[#E7DDD5] p-16 text-center">
                <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bookmark size={24} className="text-[#A8A29E]" />
                </div>
                <p className="font-semibold text-[#1C1917] mb-1">No saved searches yet</p>
                <p className="text-sm text-[#A8A29E]">Save a search from the results page to get alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedSearches.map((s) => (
                  <div key={s._id} className="bg-white border border-[#E7DDD5] rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-[#7B5328] transition-colors">
                    <div>
                      <div className="font-semibold text-[#1C1917]">{s.name}</div>
                      <div className="text-sm text-[#78716C] mt-0.5">
                        Alert: <span className="capitalize">{s.alertFrequency}</span> · {s.alertsEnabled ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-[#A8A29E]">Paused</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`p-2 rounded-xl ${s.alertsEnabled ? 'text-green-600 bg-green-50' : 'text-[#A8A29E] bg-[#F5F0EB]'}`}>
                        {s.alertsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                      </span>
                      <button onClick={async () => {
                        try { await deleteSearch(s._id).unwrap(); toast.success('Deleted'); }
                        catch { toast.error('Failed to delete'); }
                      }} className="p-2 text-[#A8A29E] hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-md">
            <h2 className="text-lg font-bold text-[#1C1917] mb-5">Account Settings</h2>
            <div className="bg-white border border-[#E7DDD5] rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#44403C] mb-1.5">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E7DDD5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] focus:border-[#7B5328]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#44403C] mb-1.5">Email Address</label>
                <input
                  defaultValue={user?.email}
                  disabled
                  className="w-full border border-[#E7DDD5] bg-[#F5F0EB] rounded-xl px-4 py-2.5 text-sm text-[#A8A29E] cursor-not-allowed"
                />
                <p className="text-xs text-[#A8A29E] mt-1">Email cannot be changed</p>
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-3 p-4 bg-[#F5F0EB] rounded-xl border border-[#E7DDD5]">
                  <div className="w-10 h-10 rounded-xl bg-[#7B5328] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">{user?.name}</p>
                    <p className="text-xs text-[#78716C] capitalize">{user?.role || 'user'} account</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#7B5328] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#5C3D1E] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
