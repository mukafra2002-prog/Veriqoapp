import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, Settings, LogOut, Crown, Zap, Heart, GitCompare, History, Shield, Bell } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const checksDisplay = user?.checks_remaining === -1 
    ? 'Unlimited' 
    : `${user?.checks_remaining || 0}/${3}`;

  return (
    <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2" data-testid="navbar-logo">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Veriqo</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/compare">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
                <GitCompare className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
            </Link>
            <Link to="/price-alerts">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Usage Counter */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm" data-testid="usage-counter">
              <span className="text-blue-400 font-bold">{checksDisplay}</span>
              <span className="text-slate-400">checks</span>
              {user?.subscription_type !== 'premium' && (
                <Link to="/pricing" className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium text-xs">
                  Upgrade
                </Link>
              )}
            </div>

            {/* Premium Badge */}
            {user?.subscription_type === 'premium' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-sm font-medium" data-testid="premium-badge">
                <Crown className="w-4 h-4" />
                Premium
              </div>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-white/10" data-testid="user-menu-trigger">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 rounded-full flex items-center justify-center">
                    {user?.picture ? (
                      <img src={user.picture} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email || user?.phone}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                {/* Mobile Navigation Links */}
                <div className="md:hidden">
                  <DropdownMenuItem onClick={() => navigate('/compare')} className="text-slate-300 focus:bg-white/10 focus:text-white">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')} className="text-slate-300 focus:bg-white/10 focus:text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    My Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/price-alerts')} className="text-slate-300 focus:bg-white/10 focus:text-white">
                    <Bell className="w-4 h-4 mr-2" />
                    Price Alerts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/history')} className="text-slate-300 focus:bg-white/10 focus:text-white">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                </div>
                <DropdownMenuItem onClick={() => navigate('/account')} className="text-slate-300 focus:bg-white/10 focus:text-white" data-testid="menu-account">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                {user?.is_admin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="text-red-400 focus:bg-red-500/10 focus:text-red-400" data-testid="menu-admin">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                {user?.subscription_type !== 'premium' && (
                  <DropdownMenuItem onClick={() => navigate('/pricing')} className="text-slate-300 focus:bg-white/10 focus:text-white" data-testid="menu-upgrade">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400" data-testid="menu-logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
