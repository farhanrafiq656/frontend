import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = async () => {
    await handleLogout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white border-b border-[#E7DDD5] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#7B5328] rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-[#1C1917]">Nestwell</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-[#44403C] hover:text-[#7B5328] font-medium transition-colors">
              Browse Properties
            </Link>
            {(!isAuthenticated || (user?.role !== 'agent' && user?.role !== 'admin')) && (
              <Link to="/become-agent" className="text-[#44403C] hover:text-[#7B5328] font-medium transition-colors">
                Become an Agent
              </Link>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-[#44403C] hover:text-[#7B5328] font-medium transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-brand text-sm">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-[#44403C]">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#7B5328] flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col leading-none">
                    <span className="font-medium text-[#1C1917]">{user?.name}</span>
                    {user?.role === 'agent' || user?.role === 'admin' ? (
                      <span className="text-[10px] font-bold text-[#7B5328] uppercase tracking-wide">Agent</span>
                    ) : (
                      <span className="text-[10px] text-[#A8A29E] uppercase tracking-wide">Member</span>
                    )}
                  </div>
                </div>
                <Link
                  to={user?.role === 'agent' || user?.role === 'admin' ? '/agent/dashboard' : '/dashboard'}
                  className="flex items-center gap-1 text-[#44403C] hover:text-[#7B5328] text-sm font-medium"
                >
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button onClick={onLogout} className="flex items-center gap-1 text-[#44403C] hover:text-red-500 text-sm font-medium transition-colors">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-[#44403C]" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[#E7DDD5] flex flex-col gap-4">
            <Link to="/search" className="text-[#44403C] font-medium" onClick={() => setMobileOpen(false)}>Browse Properties</Link>
            <Link to="/become-agent" className="text-[#44403C] font-medium" onClick={() => setMobileOpen(false)}>Become an Agent</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-[#44403C] font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn-brand text-sm text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <Link to={user?.role === 'agent' ? '/agent/dashboard' : '/dashboard'} className="text-[#44403C] font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={onLogout} className="text-left text-red-500 font-medium">Sign Out</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
