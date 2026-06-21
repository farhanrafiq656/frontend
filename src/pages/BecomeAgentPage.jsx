import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, ArrowLeft, Building2, BadgeCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBecomeAgentMutation } from '../store/apiSlice';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

const FEATURES = [
  'Unlimited property listings',
  'Lead inbox & CRM management',
  'Public verified agent profile',
  'AI Property Intelligence Reports',
  'Professional agent dashboard',
  'Analytics & performance insights',
  'Listing management & CRUD tools',
  'AI listing description generator',
];

const inputCls = 'w-full border border-[#E7DDD5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] focus:border-[#7B5328] bg-white';
const labelCls = 'block text-sm font-medium text-[#44403C] mb-1.5';

export default function BecomeAgentPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [becomeAgent, { isLoading }] = useBecomeAgentMutation();

  const [form, setForm] = useState({
    brokerageName: '',
    licenseNumber: '',
    licenseState: '',
    bio: '',
    yearsOfExperience: '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'agent') {
      toast.info('You already have an agent account');
      navigate('/agent/dashboard');
      return;
    }
    try {
      const result = await becomeAgent(form).unwrap();
      dispatch(setUser(result));
      toast.success('Welcome to Nestwell Agents! Your dashboard is ready.');
      navigate('/agent/dashboard');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to upgrade account');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <div className="max-w-5xl mx-auto px-4 py-14">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#7B5328] mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Nestwell
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#7B5328]/10 text-[#7B5328] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={14} /> For Real Estate Professionals
          </div>
          <h1 className="text-4xl font-bold text-[#1C1917] mb-3">Become a Nestwell Agent</h1>
          <p className="text-[#78716C] text-lg max-w-xl mx-auto">List properties, connect with buyers, manage leads, and grow your business with AI-powered tools.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E7DDD5] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#7B5328] rounded-xl flex items-center justify-center">
                  <BadgeCheck size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-[#1C1917]">What you get</h2>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-3 py-2 border-b border-[#F5F0EB] last:border-0">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-green-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-[#44403C]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[['500+', 'Active Agents'], ['10K+', 'Listings'], ['4.9★', 'Agent Rating']].map(([val, lbl]) => (
                <div key={lbl} className="bg-white rounded-2xl border border-[#E7DDD5] p-4 text-center shadow-sm">
                  <p className="text-xl font-bold text-[#7B5328]">{val}</p>
                  <p className="text-xs text-[#78716C] mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-up form */}
          <div className="bg-white rounded-2xl border border-[#E7DDD5] p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center">
                <Building2 size={18} className="text-[#7B5328]" />
              </div>
              <div>
                <h2 className="font-bold text-[#1C1917]">Agent Profile</h2>
                <p className="text-xs text-[#78716C]">Optional — you can fill this in later</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Brokerage Name</label>
                <input name="brokerageName" value={form.brokerageName} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Mitchell Realty Group" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>License Number</label>
                  <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange}
                    className={inputCls} placeholder="CA-DRE-12345" />
                </div>
                <div>
                  <label className={labelCls}>License State</label>
                  <input name="licenseState" value={form.licenseState} onChange={handleChange}
                    className={inputCls} placeholder="CA" maxLength={2} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Years of Experience</label>
                <input name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange}
                  type="number" min="0" className={inputCls} placeholder="5" />
              </div>
              <div>
                <label className={labelCls}>Short Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Tell buyers about your expertise and specialities..." />
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-6 bg-[#F5F0EB] rounded-xl p-4 border border-[#E7DDD5]">
              <div className="flex items-center justify-between text-sm text-[#44403C] mb-2">
                <span>Agent Plan</span>
                <span className="font-semibold">$29/month</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[#44403C] mb-3">
                <span>First 30 days</span>
                <span className="font-semibold text-green-600">Free Trial</span>
              </div>
              <div className="border-t border-[#E7DDD5] pt-2 flex items-center justify-between">
                <span className="font-bold text-[#1C1917]">Due Today</span>
                <span className="font-bold text-2xl text-[#7B5328]">$0</span>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full mt-5 bg-[#7B5328] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#5C3D1E] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <BadgeCheck size={18} />
              {isLoading ? 'Activating Agent Account...' : 'Activate Agent Account — Free'}
            </button>
            <p className="text-xs text-[#A8A29E] text-center mt-3">Demo mode — no real charge occurs. Cancel anytime.</p>

            {!isAuthenticated && (
              <p className="text-sm text-center text-[#78716C] mt-3">
                You must be signed in.{' '}
                <button onClick={() => navigate('/login')} className="text-[#7B5328] font-semibold hover:underline">Sign in</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
