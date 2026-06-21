import { useState } from 'react';
import { useGetAgentAnalyticsQuery, useGetPropertyReportQuery } from '../../store/apiSlice';
import { useAuth } from '../../hooks/useAuth';
import { useGetListingsByAgentQuery } from '../../store/apiSlice';
import {
  BarChart2, TrendingUp, CheckCircle2, AlertCircle, Lightbulb,
  Clock, Users, Target, Star, Zap, ChevronRight, FileText
} from 'lucide-react';

const ScoreRing = ({ score }) => {
  const color = score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center mx-auto">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} strokeWidth="8" stroke="#E7DDD5" fill="none" />
        <circle cx="50" cy="50" r={radius} strokeWidth="8" stroke={color} fill="none"
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="text-center z-10">
        <span className="text-2xl font-bold text-[#1C1917]">{score}</span>
        <span className="text-xs text-[#78716C] block -mt-0.5">/ 100</span>
      </div>
    </div>
  );
};

const TagList = ({ items, color = 'green' }) => {
  const cls = color === 'green'
    ? 'bg-green-50 text-green-700 border-green-200'
    : color === 'amber'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-blue-50 text-blue-700 border-blue-200';
  return (
    <ul className="space-y-2 mt-3">
      {items?.map((item, i) => (
        <li key={i} className={`flex items-start gap-2 text-sm px-3 py-2 rounded-xl border ${cls}`}>
          {color === 'green' && <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />}
          {color === 'amber' && <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
          {color === 'blue' && <Lightbulb size={14} className="mt-0.5 flex-shrink-0" />}
          {item}
        </li>
      ))}
    </ul>
  );
};

function ReportView({ listingId }) {
  const { data, isLoading, error } = useGetPropertyReportQuery(listingId);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-white rounded-2xl border border-[#E7DDD5]" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map((n) => <div key={n} className="h-28 bg-white rounded-2xl border border-[#E7DDD5]" />)}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-[#E7DDD5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="font-semibold text-[#1C1917] mb-1">Could not generate report</p>
        <p className="text-sm text-[#A8A29E]">{error.data?.message || 'Please try again later'}</p>
      </div>
    );
  }

  if (!data) return null;

  const { report, listing, generatedAt } = data;

  return (
    <div className="space-y-5">
      {/* Hero score card */}
      <div className="bg-white rounded-2xl border border-[#E7DDD5] p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <ScoreRing score={report.overallScore} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-[#1C1917]">{listing.title}</h3>
            </div>
            <p className="text-sm text-[#78716C] mb-3">{listing.address?.street}, {listing.address?.city}, {listing.address?.state}</p>
            <div className="inline-flex items-center gap-1.5 bg-[#F5F0EB] text-[#7B5328] border border-[#E7DDD5] px-3 py-1 rounded-full text-sm font-medium">
              <BarChart2 size={13} />
              {report.marketPosition}
            </div>
            <p className="text-xs text-[#A8A29E] mt-3">Generated {new Date(generatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-5 shadow-sm text-center">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock size={18} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-[#1C1917]">{report.predictedDaysToSell}</p>
          <p className="text-xs text-[#78716C] mt-0.5">Predicted days to sell</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-5 shadow-sm text-center">
          <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target size={18} className="text-[#7B5328]" />
          </div>
          <p className="text-base font-bold text-[#1C1917] leading-tight">{report.targetBuyerProfile}</p>
          <p className="text-xs text-[#78716C] mt-0.5">Target buyer</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-5 shadow-sm text-center">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={18} className="text-amber-600" />
          </div>
          <p className="text-base font-bold text-[#1C1917] leading-tight">{report.priceAnalysis}</p>
          <p className="text-xs text-[#78716C] mt-0.5">Price analysis</p>
        </div>
      </div>

      {/* Performance summary */}
      {report.performanceSummary && (
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#F5F0EB] rounded-lg flex items-center justify-center">
              <Star size={15} className="text-[#7B5328]" />
            </div>
            <h4 className="font-bold text-[#1C1917]">Performance Summary</h4>
          </div>
          <p className="text-sm text-[#44403C] leading-relaxed">{report.performanceSummary}</p>
        </div>
      )}

      {/* Competitive landscape */}
      {report.competitiveLandscape && (
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart2 size={15} className="text-blue-600" />
            </div>
            <h4 className="font-bold text-[#1C1917]">Market Landscape</h4>
          </div>
          <p className="text-sm text-[#44403C] leading-relaxed">{report.competitiveLandscape}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={14} className="text-green-600" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Strengths</h4>
          </div>
          <TagList items={report.strengths} color="green" />
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertCircle size={14} className="text-amber-600" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Areas to Improve</h4>
          </div>
          <TagList items={report.improvements} color="amber" />
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-blue-600" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Recommended Actions</h4>
          </div>
          <TagList items={report.recommendedActions} color="blue" />
        </div>
      </div>
    </div>
  );
}

export default function PropertyReportTab() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const { data, isLoading } = useGetListingsByAgentQuery({ agentId: user?._id }, { skip: !user?._id });
  const listings = data?.results || [];

  const handleGenerate = () => {
    if (!selectedId) return;
    setActiveId(selectedId);
    setGenerating(false);
  };

  if (isLoading) {
    return <div className="h-32 bg-white rounded-2xl border border-[#E7DDD5] animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-[#7B5328] to-[#5C3D1E] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">AI Property Intelligence Report</h2>
            <p className="text-sm text-white/80">Get AI-powered analysis of any listing — market position, predicted sale timeline, buyer profile, and actionable recommendations.</p>
          </div>
        </div>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-2xl border border-[#E7DDD5] p-6 shadow-sm">
        <h3 className="font-bold text-[#1C1917] mb-4">Select a Listing to Analyze</h3>
        {!listings.length ? (
          <div className="text-center py-8">
            <FileText size={32} className="text-[#A8A29E] mx-auto mb-3" />
            <p className="text-sm text-[#A8A29E]">No listings found. Add a listing first.</p>
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            {listings.map((l) => {
              const cover = l.images?.find((i) => i.isCover) || l.images?.[0];
              const selected = selectedId === l._id;
              return (
                <button
                  key={l._id}
                  onClick={() => { setSelectedId(l._id); setActiveId(null); }}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
                    selected ? 'border-[#7B5328] bg-[#F5F0EB]' : 'border-[#E7DDD5] hover:border-[#7B5328]'
                  }`}
                >
                  {cover?.url ? (
                    <img src={cover.url} alt="" className="w-14 h-11 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-11 rounded-lg bg-[#E7DDD5] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1C1917] text-sm truncate">{l.title}</p>
                    <p className="text-xs text-[#A8A29E]">{l.address?.city}, {l.address?.state} · {l.viewCount} views</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${selected ? 'border-[#7B5328] bg-[#7B5328]' : 'border-[#E7DDD5]'}`}>
                    {selected && <div className="w-full h-full rounded-full scale-50 bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedId}
          className="w-full flex items-center justify-center gap-2 bg-[#7B5328] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#5C3D1E] transition-colors"
        >
          <BarChart2 size={16} />
          Generate AI Property Report
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Report output */}
      {activeId && <ReportView listingId={activeId} />}
    </div>
  );
}
