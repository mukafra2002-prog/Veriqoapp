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
  Crown, 
  Calendar, 
  History, 
  LogOut,
  ExternalLink,
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
    if (verdict === 'buy') return 'text-emerald-600 bg-emerald-50';
    if (verdict === 'think') return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="account-page">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">Account Settings</h1>

        {/* Profile Info */}
        <div className="card-base mb-6" data-testid="profile-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900" data-testid="user-name">{user?.name}</p>
                <p className="text-sm text-slate-500">Account holder</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900" data-testid="user-email">{user?.email}</p>
                <p className="text-sm text-slate-500">Email address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card-base mb-6" data-testid="subscription-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Subscription</h2>
            {user?.subscription_type === 'premium' ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                Premium
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                Free Plan
              </span>
            )}
          </div>

          {user?.subscription_type === 'premium' ? (
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-600">
                  Expires: {user?.subscription_expires ? formatDate(user.subscription_expires) : 'N/A'}
                </span>
              </div>
              <p className="text-sm text-emerald-700">
                Unlimited product checks active
              </p>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-bold">{user?.checks_remaining || 0}</span> of 3 free checks remaining this month
                </p>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${((3 - (user?.checks_remaining || 0)) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid="upgrade-btn"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          )}
        </div>

        {/* Usage History */}
        <div className="card-base mb-6" data-testid="history-card">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Usage</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 w-full rounded-xl"></div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`, { state: { analysis: item } })}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${getVerdictColor(item.verdict)}`}>
                      {item.verdict}
                    </span>
                    <span className="text-sm text-slate-700 truncate">{item.product_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {formatDate(item.analyzed_at)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
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
          className="w-full h-12 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
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
