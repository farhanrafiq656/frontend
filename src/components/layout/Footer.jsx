import { Link } from 'react-router-dom';
import { Home, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#F5F0EB] border-t border-[#E7DDD5] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-[#7B5328] rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-[#1C1917]">Nestwell</span>
          </div>
          <p className="text-sm text-[#78716C] leading-relaxed mb-5">
            Making your first home journey simple and stress-free. Find your perfect nest with trusted agents and curated listings.
          </p>
          <p className="text-sm font-medium text-[#1C1917] mb-2">Stay Updated</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="flex-1 border border-[#E7DDD5] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B5328]"
            />
            <button
              onClick={() => { alert('Subscribed!'); setEmail(''); }}
              className="w-10 h-10 bg-[#7B5328] text-white rounded-lg flex items-center justify-center hover:bg-[#6A4520] transition-colors flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Browse */}
        <div>
          <h4 className="font-semibold text-[#1C1917] mb-4">Browse</h4>
          <ul className="space-y-2.5 text-sm text-[#78716C]">
            <li><Link to="/search" className="hover:text-[#7B5328] transition-colors">All Properties</Link></li>
            <li><Link to="/search?propertyType=house" className="hover:text-[#7B5328] transition-colors">Houses</Link></li>
            <li><Link to="/search?propertyType=condo" className="hover:text-[#7B5328] transition-colors">Apartments</Link></li>
            <li><Link to="/search?propertyType=condo" className="hover:text-[#7B5328] transition-colors">Condos</Link></li>
            <li><Link to="/search?propertyType=townhouse" className="hover:text-[#7B5328] transition-colors">Townhouses</Link></li>
          </ul>
        </div>

        {/* For Agents */}
        <div>
          <h4 className="font-semibold text-[#1C1917] mb-4">For Agents</h4>
          <ul className="space-y-2.5 text-sm text-[#78716C]">
            <li><Link to="/become-agent" className="hover:text-[#7B5328] transition-colors">Become an Agent</Link></li>
            <li><Link to="/agent/dashboard" className="hover:text-[#7B5328] transition-colors">Agent Dashboard</Link></li>
            <li><Link to="/agent/dashboard" className="hover:text-[#7B5328] transition-colors">Manage Listings</Link></li>
            <li><Link to="/agent/dashboard" className="hover:text-[#7B5328] transition-colors">Lead Inbox</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-semibold text-[#1C1917] mb-4">Account</h4>
          <ul className="space-y-2.5 text-sm text-[#78716C]">
            <li><Link to="/dashboard" className="hover:text-[#7B5328] transition-colors">Saved Properties</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#7B5328] transition-colors">My Profile</Link></li>
            <li><Link to="/login" className="hover:text-[#7B5328] transition-colors">Sign In</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E7DDD5] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-[#A8A29E]">&copy; {new Date().getFullYear()} Nestwell. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-[#A8A29E]">
            <span className="hover:text-[#7B5328] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#7B5328] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
