import { useState } from 'react';
import { toast } from 'sonner';
import { useGetLeadsQuery, useUpdateLeadStatusMutation } from '../../store/apiSlice';
import { ChevronDown, ChevronUp, Phone, Mail, Calendar, Users } from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'New', bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  scheduled: { label: 'Scheduled', bg: 'bg-purple-100 text-purple-700 border-purple-200' },
  closed: { label: 'Closed', bg: 'bg-green-100 text-green-700 border-green-200' },
};
const STATUSES = ['new', 'contacted', 'scheduled', 'closed'];

export default function LeadsTrackerTab() {
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const { data, isLoading } = useGetLeadsQuery({ status: statusFilter || undefined, limit: 50 });
  const [updateStatus] = useUpdateLeadStatusMutation();

  const onStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const leads = data?.results || [];
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === s ? 'border-[#7B5328] bg-[#F5F0EB]' : 'border-[#E7DDD5] bg-white hover:border-[#7B5328]'}`}
          >
            <p className="text-2xl font-bold text-[#1C1917]">{counts[s] || 0}</p>
            <p className="text-sm text-[#78716C] capitalize mt-0.5">{STATUS_CONFIG[s].label}</p>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!statusFilter ? 'bg-[#7B5328] text-white border-[#7B5328]' : 'border-[#E7DDD5] text-[#44403C] hover:border-[#7B5328]'}`}>
          All Leads ({leads.length})
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${statusFilter === s ? 'bg-[#7B5328] text-white border-[#7B5328]' : 'border-[#E7DDD5] text-[#44403C] hover:border-[#7B5328]'}`}>
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-white rounded-2xl animate-pulse border border-[#E7DDD5]" />)}
        </div>
      ) : !leads.length ? (
        <div className="bg-white rounded-2xl border border-[#E7DDD5] p-16 text-center">
          <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-[#A8A29E]" />
          </div>
          <p className="font-semibold text-[#1C1917] mb-1">No leads yet</p>
          <p className="text-sm text-[#A8A29E]">Leads from your listings will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const isExp = expanded === lead._id;
            const name = lead.user?.name || lead.guestContact?.name || 'Guest';
            const email = lead.user?.email || lead.guestContact?.email;
            const phone = lead.user?.phone || lead.guestContact?.phone;
            const cfg = STATUS_CONFIG[lead.status];

            return (
              <div key={lead._id} className="bg-white border border-[#E7DDD5] rounded-2xl overflow-hidden shadow-sm">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#F5F0EB] transition-colors"
                  onClick={() => setExpanded(isExp ? null : lead._id)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#7B5328] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[#1C1917] text-sm">{name}</span>
                      {lead.tourRequested && (
                        <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          <Calendar size={10} /> Tour
                        </span>
                      )}
                    </div>
                    {lead.listing && <p className="text-xs text-[#A8A29E] truncate">{lead.listing.title}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={lead.status}
                      onChange={(e) => { e.stopPropagation(); onStatusChange(lead._id, e.target.value); }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold border cursor-pointer focus:outline-none capitalize ${cfg.bg}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-white text-[#1C1917]">{STATUS_CONFIG[s].label}</option>)}
                    </select>
                    <span className="text-xs text-[#A8A29E] hidden sm:block">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    {isExp ? <ChevronUp size={16} className="text-[#A8A29E]" /> : <ChevronDown size={16} className="text-[#A8A29E]" />}
                  </div>
                </div>

                {isExp && (
                  <div className="border-t border-[#E7DDD5] px-4 py-4 bg-[#F5F0EB] space-y-3">
                    {lead.message && <p className="text-sm text-[#44403C] bg-white rounded-xl p-3 border border-[#E7DDD5]">{lead.message}</p>}
                    <div className="flex flex-wrap gap-3">
                      {email && (
                        <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-sm text-[#7B5328] hover:underline">
                          <Mail size={14} /> {email}
                        </a>
                      )}
                      {phone && (
                        <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm text-[#7B5328] hover:underline">
                          <Phone size={14} /> {phone}
                        </a>
                      )}
                    </div>
                    {lead.requestedTourTime && (
                      <p className="text-sm text-[#44403C] flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#7B5328]" />
                        Tour requested: {new Date(lead.requestedTourTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
