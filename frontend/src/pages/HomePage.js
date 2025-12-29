import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { OnboardingModal } from '../components/OnboardingModal';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Search, Loader2, History, ExternalLink, Shield, Clock, Sparkles } from 'lucide-react';

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
    // Only show onboarding for new users who haven't completed it
    if (user && user.onboarding_completed === false) {
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
    if (verdict === 'buy') return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (verdict === 'think') return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950" data-testid="home-page">
      <Navbar />
      
      <OnboardingModal 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Check Before You Buy
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
              className="w-full h-16 px-6 pr-36 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg"
              disabled={loading}
              data-testid="amazon-url-input"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold shadow-lg"
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
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              AI-verified analysis
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Results in ~10 seconds
            </span>
          </div>
        </form>

        {/* Recent History */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/results/${item.id}`, { state: { analysis: item } })}
                  className="w-full text-left p-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all group"
                  data-testid={`history-item-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {item.amazon_url}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getVerdictColor(item.verdict)}`}>
                        {item.verdict}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {item.confidence_score}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">No analyses yet</h3>
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
