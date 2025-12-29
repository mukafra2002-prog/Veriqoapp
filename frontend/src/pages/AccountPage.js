import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone,
  Crown, 
  Calendar, 
  History, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function AccountPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'buy') return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (verdict === 'think') return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950" data-testid="account-page">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">Account Settings</h1>

        {/* Profile Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6" data-testid="profile-card">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 rounded-full flex items-center justify-center">
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white" data-testid="user-name">{user?.name}</p>
                <p className="text-sm text-slate-500">Account holder</p>
              </div>
            </div>

            {user?.email && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-white" data-testid="user-email">{user.email}</p>
                  <p className="text-sm text-slate-500">Email address</p>
                </div>
              </div>
            )}

            {user?.phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-white" data-testid="user-phone">{user.phone}</p>
                  <p className="text-sm text-slate-500">Phone number</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6" data-testid="subscription-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Subscription</h2>
            {user?.subscription_type === 'premium' ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                Premium
              </span>
            ) : (
              <span className="px-3 py-1 bg-white/10 text-slate-400 rounded-full text-sm font-medium">
                Free Plan
              </span>
            )}
          </div>

          {user?.subscription_type === 'premium' ? (
            <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">
                  Expires: {user?.subscription_expires ? formatDate(user.subscription_expires) : 'N/A'}
                </span>
              </div>
              <p className="text-sm text-emerald-400">
                Unlimited product checks active
              </p>
            </div>
          ) : (
            <div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-300 mb-2">
                  <span className="font-bold">{user?.checks_remaining || 0}</span> of 3 free checks remaining this month
                </p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${((3 - (user?.checks_remaining || 0)) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold"
                data-testid="upgrade-btn"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          )}
        </div>

        {/* Usage History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6" data-testid="history-card">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-white">Recent Usage</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`, { state: { analysis: item } })}
                  className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${getVerdictColor(item.verdict)}`}>
                      {item.verdict}
                    </span>
                    <span className="text-sm text-slate-300 truncate">{item.product_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {formatDate(item.analyzed_at)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-8">
              No analyses yet
            </p>
          )}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
          onClick={handleLogout}
          data-testid="logout-btn"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </main>
    </div>
  );
}
