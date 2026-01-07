import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { ScoreGauge } from '../components/ScoreGauge';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { 
  ArrowLeft, 
  ExternalLink, 
  Info, 
  UserCheck, 
  Shield, 
  Clock,
  Share2,
  Heart,
  Loader2,
  Sparkles,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Safe Core: Helper to normalize verdict from old/new formats
const normalizeVerdict = (v) => {
  const map = {
    'buy': 'great_match', 'BUY': 'great_match', 'great_match': 'great_match',
    'think': 'good_match', 'THINK': 'good_match', 'good_match': 'good_match',
    'avoid': 'consider_options', 'AVOID': 'consider_options', 'consider_options': 'consider_options'
  };
  return map[v] || 'good_match';
};

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);
  const [savingToWishlist, setSavingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!analysis) {
      fetchAnalysis();
    }
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = response.data.find(item => item.id === id);
      if (found) {
        setAnalysis(found);
      } else {
        toast.error('Analysis not found');
        navigate('/home');
      }
    } catch (error) {
      toast.error('Failed to load analysis');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleSaveToWishlist = async () => {
    setSavingToWishlist(true);
    try {
      await axios.post(
        `${API_URL}/wishlist`,
        {
          product_url: analysis.amazon_url,
          product_name: analysis.product_name,
          product_image: analysis.product_image
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInWishlist(true);
      toast.success('Added to wishlist!');
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Already in wishlist');
        setIsInWishlist(true);
      } else {
        toast.error('Failed to save');
      }
    } finally {
      setSavingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-white/10 rounded"></div>
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-4 h-64 bg-white/10 rounded-2xl"></div>
              <div className="md:col-span-8 h-64 bg-white/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  // Safe Core: Get normalized verdict and use new field names with fallbacks
  const normalizedVerdict = normalizeVerdict(analysis.verdict);
  const thingsToKnow = analysis.things_to_know || analysis.top_complaints || [];
  const bestSuitedFor = analysis.best_suited_for || analysis.who_should_not_buy || [];
  const positiveHighlights = analysis.positive_highlights || [];

  const getVerdictDescription = () => {
    if (normalizedVerdict === 'great_match') {
      return 'Based on customer feedback patterns, this product appears to meet expectations for most users.';
    }
    if (normalizedVerdict === 'good_match') {
      return 'This product has mixed feedback. Review the insights below to see if it matches your needs.';
    }
    return 'Consider reviewing the feedback patterns carefully to determine if this product suits your specific requirements.';
  };

  const getVerdictStyles = () => {
    if (normalizedVerdict === 'great_match') {
      return 'bg-emerald-500/10 border border-emerald-500/20';
    }
    if (normalizedVerdict === 'good_match') {
      return 'bg-amber-500/10 border border-amber-500/20';
    }
    return 'bg-indigo-500/10 border border-indigo-500/20';
  };

  const getVerdictTextColor = () => {
    if (normalizedVerdict === 'great_match') return 'text-emerald-400';
    if (normalizedVerdict === 'good_match') return 'text-amber-400';
    return 'text-indigo-400';
  };

  return (
    <div className="min-h-screen bg-slate-950" data-testid="results-page">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </button>

        {/* Product Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" data-testid="product-name">
            {analysis.product_name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              AI-Powered Insight
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Analyzed {new Date(analysis.analyzed_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid mb-8">
          {/* Score Card */}
          <div className="bento-score bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center" data-testid="score-card">
            <ScoreGauge score={analysis.confidence_score} verdict={analysis.verdict} />
            <p className="text-sm text-slate-500 mt-4 text-center">
              Based on aggregated customer feedback
            </p>
          </div>

          {/* Verdict Card */}
          <div className="bento-verdict bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="verdict-card">
            <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
            <p className="text-slate-400 mb-6">{analysis.summary}</p>
            <div className={`p-4 rounded-xl ${getVerdictStyles()}`}>
              <p className={`text-sm ${getVerdictTextColor()}`}>
                {getVerdictDescription()}
              </p>
            </div>
          </div>

          {/* Things to Know Card (formerly Complaints) */}
          <div className="bento-complaints bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="things-to-know-card">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Things to Know</h2>
            </div>
            <div className="space-y-4">
              {thingsToKnow.map((item, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors" data-testid={`thing-to-know-${idx}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap">
                      {item.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Suited For (formerly Who Should NOT Buy - now positive framing) */}
          <div className="bento-full bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="best-suited-for">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Best Suited For</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bestSuitedFor.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                  data-testid={`suited-for-${idx}`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Positive Highlights */}
          {positiveHighlights.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="positive-highlights">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Positive Feedback Patterns</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {positiveHighlights.map((highlight, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-blue-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500 space-y-1">
              <p>This summary is based on aggregated public customer feedback and is for informational purposes only.</p>
              <p>Veriqo provides independent informational summaries and is not affiliated with Amazon or any brand.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={analysis.affiliate_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105"
            data-testid="view-on-amazon-btn"
          >
            <ExternalLink className="w-5 h-5" />
            View on Amazon
          </a>
          
          <Button
            variant="outline"
            className="h-14 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
            onClick={handleShare}
            data-testid="share-btn"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>

          <Button
            variant="outline"
            className={`h-14 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white ${isInWishlist ? 'border-pink-500/50 text-pink-400' : ''}`}
            onClick={handleSaveToWishlist}
            disabled={savingToWishlist || isInWishlist}
            data-testid="wishlist-btn"
          >
            {savingToWishlist ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-pink-400' : ''}`} />
            )}
            {isInWishlist ? 'Saved' : 'Save to Wishlist'}
          </Button>

          <Link to="/compare">
            <Button
              variant="outline"
              className="h-14 px-8 rounded-xl border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Compare Products
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
