import { useAuth } from '../../hooks/useAuth';
import { useGetAgentAnalyticsQuery } from '../../store/apiSlice';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Eye, Users, Home, TrendingUp, ArrowUpRight } from 'lucide-react';

const MOCK_CHART = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  leads: Math.floor(Math.random() * 5) + 1,
  views: Math.floor(Math.random() * 30) + 10,
}));

export default function AnalyticsTab() {
  const { user } = useAuth();
  const { data, isLoading } = useGetAgentAnalyticsQuery({ days: 30 });

  const stats = data
    ? [
        { label: 'Active Listings', value: data.totalActiveListings, icon: Home, color: 'text-[#7B5328]', bg: 'bg-[#F5F0EB]', change: '+2 this month' },
        { label: '30-Day Views', value: data.totalViews30d?.toLocaleString() || '0', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', change: '+18% vs last month' },
        { label: '30-Day Leads', value: data.totalLeads30d || '0', icon: Users, color: 'text-green-600', bg: 'bg-green-50', change: '+5 this week' },
        { label: 'Conversion Rate', value: `${data.conversionRate || 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', change: 'Industry avg: 3%' },
      ]
    : [
        { label: 'Active Listings', value: '0', icon: Home, color: 'text-[#7B5328]', bg: 'bg-[#F5F0EB]', change: 'Add your first listing' },
        { label: '30-Day Views', value: '0', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', change: 'Views will appear here' },
        { label: '30-Day Leads', value: '0', icon: Users, color: 'text-green-600', bg: 'bg-green-50', change: 'Leads will appear here' },
        { label: 'Conversion Rate', value: '0%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', change: 'Industry avg: 3%' },
      ];

  const chartData = data?.leadsOverTime?.length > 0 ? data.leadsOverTime : MOCK_CHART;
  const topListings = data?.topPerformingListings || [];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-[#E7DDD5] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#78716C] font-medium">{label}</span>
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1C1917] mb-1">{isLoading ? '—' : value}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight size={12} /> {change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E7DDD5] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#1C1917]">Leads & Views (30 days)</h3>
              <p className="text-xs text-[#A8A29E] mt-0.5">Daily activity overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B5328" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7B5328" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A8A29E' }} />
              <YAxis tick={{ fontSize: 10, fill: '#A8A29E' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7DDD5', fontSize: 12 }} />
              <Area type="monotone" dataKey="leads" stroke="#7B5328" fill="url(#leadGrad)" strokeWidth={2} name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7DDD5] shadow-sm">
          <h3 className="font-bold text-[#1C1917] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Listing', desc: 'List a property for sale or rent', color: 'bg-[#7B5328]', tab: 'listings' },
              { label: 'View Leads', desc: `${data?.totalLeads30d || 0} new leads waiting`, color: 'bg-blue-600', tab: 'leads' },
              { label: 'Generate Report', desc: 'AI analysis for your listings', color: 'bg-green-600', tab: 'reports' },
            ].map(({ label, desc, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-[#E7DDD5] hover:border-[#7B5328] cursor-pointer transition-colors group">
                <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <ArrowUpRight size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1917] group-hover:text-[#7B5328] transition-colors">{label}</p>
                  <p className="text-xs text-[#A8A29E]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top listings */}
      {topListings.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#E7DDD5] shadow-sm">
          <h3 className="font-bold text-[#1C1917] mb-4">Top Performing Listings</h3>
          <div className="space-y-3">
            {topListings.map((l, i) => (
              <div key={l.listingId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F5F0EB] transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#7B5328] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                {l.thumbnail && (
                  <img src={l.thumbnail} alt="" className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1917] truncate">{l.title}</p>
                </div>
                <div className="text-right text-xs text-[#78716C] flex-shrink-0">
                  <div className="font-semibold text-[#1C1917]">{l.viewCount} views</div>
                  <div>{l.favoriteCount} saves</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
