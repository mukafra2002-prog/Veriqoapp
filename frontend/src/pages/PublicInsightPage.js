import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { 
  Zap, CheckCircle, Info, Lightbulb, Shield,
  ShoppingCart, Star, Users, Clock, ExternalLink,
  ThumbsUp, ThumbsDown, ArrowRight, Share2, Loader2,
  Target, UserCheck, TrendingUp, BarChart3,
  Lock, Sparkles, Eye, Award
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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

export default function PublicInsightPage() {
  const { productId } = useParams();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsight();
  }, [productId]);

  const fetchInsight = async () => {
    try {
      const response = await axios.get(`${API_URL}/insights/${productId}`);
      setInsight(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Product insight not found');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictConfig = (verdict) => {
    const normalized = normalizeVerdict(verdict);
    switch (normalized) {
      case 'great_match':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          label: 'Great Match',
          description: 'Based on feedback patterns, this product appears to meet expectations for most users.'
        };
      case 'good_match':
        return {
          icon: Info,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          label: 'Good Match',
          description: 'This product has mixed feedback. Review the insights to see if it fits your needs.'
        };
      case 'consider_options':
        return {
          icon: Lightbulb,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-500/10',
          borderColor: 'border-indigo-500/30',
          label: 'Consider Options',
          description: 'Review the feedback patterns carefully to determine if this suits your requirements.'
        };
      default:
        return {
          icon: Shield,
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/30',
          label: 'Under Review',
          description: 'Analysis in progress.'
        };
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${insight?.product_name} - Product Insight | Veriqo`,
          text: `Check out this AI-powered product insight for "${insight?.product_name}".`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Safe Core: Generate ideal buyers based on verdict and score
  const getIdealBuyers = () => {
    const score = insight?.confidence_score || 50;
    if (score >= 70) {
      return [
        "Budget-conscious shoppers looking for good value",
        "Users who prioritize functionality over premium finish",
        "First-time buyers in this product category"
      ];
    } else if (score >= 40) {
      return [
        "Users with flexible expectations",
        "Those who can verify compatibility before purchase",
        "Shoppers comfortable with standard delivery times"
      ];
    }
    return [
      "Users who can thoroughly research specs first",
      "Those with flexible requirements",
      "Shoppers with easy return access"
    ];
  };

  // Calculate expectation score
  const getExpectationScore = () => {
    const confidence = insight?.confidence_score || 50;
    return Math.round(confidence * 0.9); // Simplified calculation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">Veriqo</span>
            </Link>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Product Insight Not Found</h1>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600">
              Analyze a Product
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const verdictConfig = getVerdictConfig(insight?.verdict);
  const VerdictIcon = verdictConfig.icon;
  const expectationScore = getExpectationScore();
  const idealBuyers = getIdealBuyers();

  // Safe Core: Get data with fallbacks for both old and new field names
  const thingsToKnow = insight?.things_to_know || insight?.top_complaints || [];
  const bestSuitedFor = insight?.best_suited_for || insight?.who_should_not_buy || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{insight?.product_name} - Product Insight | Veriqo</title>
        <meta name="description" content={`${insight?.summary?.slice(0, 155)}... Read the full AI-powered insight for ${insight?.product_name} on Veriqo.`} />
        <meta property="og:title" content={`${insight?.product_name} - Product Insight | Veriqo`} />
        <meta property="og:description" content={insight?.summary?.slice(0, 200)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Navigation */}
      <nav className="border-b border-white/5 sticky top-0 bg-slate-950/90 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Veriqo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-slate-400 hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                Try Veriqo Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/insights" className="hover:text-white">Product Insights</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">{insight?.product_name?.slice(0, 30)}...</span>
        </div>

        {/* Product Header */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="w-full md:w-56 h-56 bg-white rounded-2xl overflow-hidden flex-shrink-0">
              {insight?.product_image ? (
                <img 
                  src={insight.product_image} 
                  alt={insight.product_name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <ShoppingCart className="w-16 h-16 text-slate-300" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                {insight?.product_name}
              </h1>
              
              {/* Verdict Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${verdictConfig.bgColor} ${verdictConfig.borderColor} border mb-4`}>
                <VerdictIcon className={`w-5 h-5 ${verdictConfig.color}`} />
                <span className={`font-semibold ${verdictConfig.color}`}>{verdictConfig.label}</span>
              </div>

              <p className="text-slate-400 mb-6">{verdictConfig.description}</p>

              {/* View on Amazon Button */}
              <a 
                href={insight?.affiliate_url || insight?.amazon_url} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="inline-block"
              >
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-6">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View on Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* FREE CONTENT SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Free Insights</h2>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">PUBLIC</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Expectation Score */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Expectation Score</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8"/>
                    <circle 
                      cx="50" cy="50" r="42" fill="none" 
                      stroke={expectationScore >= 70 ? '#10B981' : expectationScore >= 40 ? '#F59E0B' : '#6366F1'} 
                      strokeWidth="8" strokeLinecap="round" 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (264 * expectationScore / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{expectationScore}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm mb-2">
                    {expectationScore >= 70 ? 'High likelihood of meeting expectations' : 
                     expectationScore >= 40 ? 'Mixed results - review details before buying' : 
                     'Consider reviewing feedback patterns carefully'}
                  </p>
                  <p className="text-slate-500 text-xs">
                    Based on aggregated customer feedback analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Confidence Score</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8"/>
                    <circle 
                      cx="50" cy="50" r="42" fill="none" 
                      stroke={insight?.confidence_score >= 70 ? '#10B981' : insight?.confidence_score >= 40 ? '#F59E0B' : '#6366F1'} 
                      strokeWidth="8" strokeLinecap="round" 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (264 * (insight?.confidence_score || 0) / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{insight?.confidence_score}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm mb-2">
                    AI-calculated insight confidence score
                  </p>
                  <p className="text-slate-500 text-xs">
                    Based on customer feedback patterns
                  </p>
                </div>
              </div>
            </div>

            {/* Things to Know (Safe Core naming) */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Things to Know</h3>
              </div>
              <div className="space-y-3">
                {thingsToKnow.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-400 text-xs font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-amber-400 text-xs mt-1">{item.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">AI Summary</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{insight?.summary}</p>
            </div>

            {/* Best Suited For (Safe Core naming - positive framing) */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Best Suited For</h3>
              </div>
              <ul className="space-y-2">
                {idealBuyers.map((buyer, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{buyer}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who It Works For */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">User Fit</h3>
              </div>
              <ul className="space-y-2">
                {bestSuitedFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* PAID CONTENT SECTION - Locked */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Premium Insights</h2>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">PRO</span>
          </div>

          <div className="relative">
            {/* Blurred Preview */}
            <div className="grid md:grid-cols-3 gap-6 filter blur-sm opacity-60 pointer-events-none">
              {/* Advanced Analytics */}
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Advanced Analytics</h3>
                </div>
                <div className="h-32 bg-slate-700/50 rounded-xl"></div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Feedback Trends</h3>
                </div>
                <div className="h-32 bg-slate-700/50 rounded-xl"></div>
              </div>

              {/* Seller Dashboard */}
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Seller Insights</h3>
                </div>
                <div className="h-32 bg-slate-700/50 rounded-xl"></div>
              </div>
            </div>

            {/* Unlock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-900/95 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unlock Premium Insights</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Get advanced analytics, trend analysis, and more with a Veriqo subscription.
                </p>
                <div className="space-y-3">
                  <Link to="/register" className="block">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/pricing" className="block">
                    <Button variant="outline" className="w-full border-white/20 text-slate-300 hover:text-white">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Want to Analyze Any Amazon Product?
          </h2>
          <p className="text-slate-400 mb-6">
            Get instant AI-powered insights for any product. 3 free checks per month.
          </p>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold px-8 h-12">
              Start Free Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Disclaimer (Safe Core) */}
        <div className="text-center text-slate-500 text-xs mb-8 space-y-1">
          <p>
            This summary is based on aggregated public customer feedback and is for informational purposes only.
          </p>
          <p>
            Veriqo provides independent informational summaries and is not affiliated with Amazon or any brand.
          </p>
          <p>
            As an Amazon Associate, Veriqo earns from qualifying purchases.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">Veriqo</span>
          </Link>
          <p className="text-slate-500 text-sm">© 2024 Veriqo. Product insights made simple.</p>
          <div className="flex items-center gap-4">
            <Link to="/shoppers" className="text-slate-500 hover:text-white text-sm">For Shoppers</Link>
            <Link to="/sellers" className="text-slate-500 hover:text-white text-sm">For Sellers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
