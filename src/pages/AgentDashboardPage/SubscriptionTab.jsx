import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { CreditCard, CheckCircle, Zap, Building2 } from 'lucide-react';

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$49',
    period: '/month',
    features: ['Unlimited listings', 'AI market analysis', 'Lead management', 'Analytics dashboard'],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$39',
    period: '/month',
    badge: 'Save 20%',
    features: ['Everything in Monthly', 'Priority support', 'Advanced analytics', 'Featured listings'],
  },
];

export default function SubscriptionTab() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const ap = user?.agentProfile;
  const isActive = ap?.subscriptionStatus === 'active' || ap?.subscriptionStatus === 'trialing';

  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success('Subscription activated! (demo mode — Stripe not connected)');
  };

  if (isActive) {
    return (
      <div className="max-w-md">
        <div className="bg-white border border-[#E7DDD5] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-[#7B5328]" />
            </div>
            <h2 className="text-lg font-bold text-[#1C1917]">Subscription Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#78716C] block mb-0.5">Status</span>
              <div className="flex items-center gap-1.5 font-semibold text-green-700">
                <CheckCircle size={15} className="text-green-500" />
                <span className="capitalize">{ap.subscriptionStatus}</span>
              </div>
            </div>
            <div>
              <span className="text-[#78716C] block mb-0.5">Plan</span>
              <span className="font-semibold text-[#1C1917] capitalize">{ap.subscriptionPlan || '—'}</span>
            </div>
            {ap.subscriptionCurrentPeriodEnd && (
              <div className="col-span-2 bg-[#F5F0EB] rounded-xl p-3 border border-[#E7DDD5]">
                <span className="text-[#78716C] block text-xs mb-0.5">Renewal Date</span>
                <span className="font-semibold text-[#1C1917]">
                  {new Date(ap.subscriptionCurrentPeriodEnd).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => toast.info('Billing portal coming soon')}
            className="w-full bg-[#7B5328] text-white py-2.5 rounded-xl font-semibold hover:bg-[#5C3D1E] transition-colors"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1C1917]">Choose your plan</h2>
        <p className="text-[#78716C] text-sm mt-1">Get full agent access with any plan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
              selected === plan.id
                ? 'border-[#7B5328] bg-[#F5F0EB]'
                : 'border-[#E7DDD5] bg-white hover:border-[#7B5328]'
            }`}
          >
            {plan.badge && (
              <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {plan.badge}
              </span>
            )}
            <div className="flex items-center gap-2 mb-3">
              {plan.id === 'annual' ? (
                <Building2 size={18} className="text-[#7B5328]" />
              ) : (
                <Zap size={18} className="text-[#7B5328]" />
              )}
              <span className="font-bold text-[#1C1917]">{plan.name}</span>
            </div>
            <div className="mb-3">
              <span className="text-3xl font-bold text-[#1C1917]">{plan.price}</span>
              <span className="text-[#78716C] text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#44403C]">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-[#7B5328] text-white py-3 rounded-2xl font-semibold hover:bg-[#5C3D1E] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard size={18} />
        {loading ? 'Processing...' : `Subscribe — ${PLANS.find((p) => p.id === selected)?.price}/mo`}
      </button>
      <p className="text-xs text-[#A8A29E] text-center mt-2">Demo mode — no real charge will occur</p>
    </div>
  );
}
