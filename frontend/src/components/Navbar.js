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
import { User, Settings, LogOut, Crown, Zap } from 'lucide-react';

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
    <nav className="nav-glass sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2" data-testid="navbar-logo">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Veriqo</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Usage Counter */}
            <div className="usage-counter hidden sm:flex" data-testid="usage-counter">
              <span className="count">{checksDisplay}</span>
              <span>checks</span>
              {user?.subscription_type !== 'premium' && (
                <Link to="/pricing" className="ml-2 text-blue-600 hover:text-blue-700 font-medium text-xs">
                  Upgrade
                </Link>
              )}
            </div>

            {/* Premium Badge */}
            {user?.subscription_type === 'premium' && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium" data-testid="premium-badge">
                <Crown className="w-4 h-4" />
                Premium
              </div>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full" data-testid="user-menu-trigger">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/account')} data-testid="menu-account">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                {user?.subscription_type !== 'premium' && (
                  <DropdownMenuItem onClick={() => navigate('/pricing')} data-testid="menu-upgrade">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="menu-logout">
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
