import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { OnboardingModal } from '../components/OnboardingModal';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Search, Loader2, History, ExternalLink, Shield, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function HomePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if onboarding needs to be shown
    if (user && !user.onboarding_completed) {
      setShowOnboarding(true);
    }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter an Amazon product URL');
      return;
    }

    if (!url.includes('amazon.com') && !url.includes('amzn.to')) {
      toast.error('Please enter a valid Amazon product URL');
      return;
    }

    // Check usage limits
    if (user?.subscription_type !== 'premium' && user?.checks_remaining <= 0) {
      toast.error('You\'ve used all your free checks. Upgrade to premium for unlimited access.');
      navigate('/pricing');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/analyze`,
        { amazon_url: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Analysis complete!');
      navigate(`/results/${response.data.id}`, { state: { analysis: response.data } });
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Free checks exhausted. Upgrade to premium!');
        navigate('/pricing');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to analyze product');
      }
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'buy') return 'text-emerald-600 bg-emerald-50';
    if (verdict === 'think') return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="home-page">
      <Navbar />
      
      <OnboardingModal 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Check Before You Buy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste any Amazon product link below to get instant AI-powered review analysis
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleAnalyze} className="mb-12" data-testid="analyze-form">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Amazon product link here..."
              className="search-hero-input w-full pr-32"
              disabled={loading}
              data-testid="amazon-url-input"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={loading}
              data-testid="analyze-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          
          {/* Usage Info */}
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              AI-verified analysis
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Results in ~10 seconds
            </span>
          </div>
        </form>

        {/* Recent History */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-900">Recent Analyses</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-24 w-full"></div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`, { state: { analysis: item } })}
                  className="w-full text-left card-base hover:shadow-lg transition-all group"
                  data-testid={`history-item-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {item.amazon_url}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getVerdictColor(item.verdict)}`}>
                        {item.verdict}
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        {item.confidence_score}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700 mb-2">No analyses yet</h3>
              <p className="text-slate-500 text-sm">
                Paste an Amazon product link above to get started
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
