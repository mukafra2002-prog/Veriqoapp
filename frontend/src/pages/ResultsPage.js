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
  AlertTriangle, 
  UserX, 
  Shield, 
  Clock,
  Share2,
  Bookmark,
  Heart,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

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

  const getAuthenticityLabel = (score) => {
    if (score >= 80) return { label: 'Highly Trustworthy', color: 'text-emerald-400' };
    if (score >= 60) return { label: 'Mostly Reliable', color: 'text-blue-400' };
    if (score >= 40) return { label: 'Mixed Signals', color: 'text-amber-400' };
    return { label: 'Use Caution', color: 'text-red-400' };
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

  const getVerdictDescription = () => {
    if (analysis.verdict === 'buy') {
      return 'This product has strong positive reviews and is recommended for purchase.';
    }
    if (analysis.verdict === 'think') {
      return 'This product has mixed reviews. Consider the complaints before purchasing.';
    }
    return 'This product has significant issues. We recommend looking for alternatives.';
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
              Verified by AI
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
              Based on verified customer reviews
            </p>
          </div>

          {/* Verdict Card */}
          <div className="bento-verdict bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="verdict-card">
            <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
            <p className="text-slate-400 mb-6">{analysis.summary}</p>
            <div className={`p-4 rounded-xl ${
              analysis.verdict === 'buy' ? 'bg-emerald-500/10 border border-emerald-500/20' :
              analysis.verdict === 'think' ? 'bg-amber-500/10 border border-amber-500/20' :
              'bg-red-500/10 border border-red-500/20'
            }`}>
              <p className={`text-sm ${
                analysis.verdict === 'buy' ? 'text-emerald-400' :
                analysis.verdict === 'think' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {getVerdictDescription()}
              </p>
            </div>
          </div>

          {/* Complaints Card */}
          <div className="bento-complaints bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="complaints-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Top 3 Complaints</h2>
            </div>
            <div className="space-y-4">
              {analysis.top_complaints.map((complaint, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors" data-testid={`complaint-${idx}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{complaint.title}</h3>
                      <p className="text-sm text-slate-400">{complaint.description}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap">
                      {complaint.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Who Should Not Buy */}
          <div className="bento-full bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="who-should-not-buy">
            <div className="flex items-center gap-2 mb-4">
              <UserX className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Who Should NOT Buy This</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.who_should_not_buy.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  data-testid={`not-buy-${idx}`}
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-red-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Authenticity Score */}
          {analysis.authenticity_score && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="authenticity-card">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Review Authenticity</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8"/>
                    <circle 
                      cx="50" cy="50" r="42" fill="none" 
                      stroke={analysis.authenticity_score >= 70 ? '#10B981' : analysis.authenticity_score >= 40 ? '#F59E0B' : '#EF4444'} 
                      strokeWidth="8" strokeLinecap="round" 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (264 * analysis.authenticity_score / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{analysis.authenticity_score}%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${getAuthenticityLabel(analysis.authenticity_score).color}`}>
                    {getAuthenticityLabel(analysis.authenticity_score).label}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Our AI analyzes review patterns, language, and timing to detect potential fake or incentivized reviews.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alternative Suggestions */}
          {analysis.alternatives && analysis.alternatives.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6" data-testid="alternatives-card">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Consider These Alternatives</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {analysis.alternatives.map((alt, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"
                  >
                    <h3 className="font-semibold text-white mb-1">{alt.name}</h3>
                    <p className="text-slate-400 text-sm">{alt.reason}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-4">
                Search Amazon for these alternatives to find products with better reviews.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={analysis.affiliate_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105"
            data-testid="buy-on-amazon-btn"
          >
            <ExternalLink className="w-5 h-5" />
            Buy on Amazon
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
