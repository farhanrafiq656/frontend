import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AnalyticsTab from './AnalyticsTab';
import ListingsManagementTab from './ListingsManagementTab';
import LeadsTrackerTab from './LeadsTrackerTab';
import SubscriptionTab from './SubscriptionTab';
import PropertyReportTab from './PropertyReportTab';
import { BarChart2, Home, Users, CreditCard, FileText, Star, MapPin } from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview', icon: BarChart2 },
  { key: 'listings', label: 'My Listings', icon: Home },
  { key: 'leads', label: 'Leads CRM', icon: Users },
  { key: 'reports', label: 'Property Reports', icon: FileText },
  { key: 'subscription', label: 'Subscription', icon: CreditCard },
];

export default function AgentDashboardPage() {
  const [tab, setTab] = useState('overview');
  const { user } = useAuth();
  const ap = user?.agentProfile;

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Header */}
      <div className="bg-white border-b border-[#E7DDD5]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#7B5328] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-[#1C1917]">{user?.name}</h1>
                <span className="bg-[#F5F0EB] text-[#7B5328] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E7DDD5]">
                  Agent
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {ap?.brokerageName && (
                  <span className="flex items-center gap-1 text-sm text-[#78716C]">
                    <MapPin size={13} /> {ap.brokerageName}
                  </span>
                )}
                {ap?.ratingAverage > 0 && (
                  <span className="flex items-center gap-1 text-sm text-[#78716C]">
                    <Star size={13} className="text-amber-400 fill-amber-400" /> {ap.ratingAverage} ({ap.ratingCount} reviews)
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-xl text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Active Agent
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  tab === key
                    ? 'border-[#7B5328] text-[#7B5328]'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'overview' && <AnalyticsTab />}
        {tab === 'listings' && <ListingsManagementTab />}
        {tab === 'leads' && <LeadsTrackerTab />}
        {tab === 'reports' && <PropertyReportTab />}
        {tab === 'subscription' && <SubscriptionTab />}
      </div>
    </div>
  );
}
