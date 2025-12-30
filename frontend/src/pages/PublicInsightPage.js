import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { 
  Zap, CheckCircle, AlertTriangle, XCircle, Shield,
  ShoppingCart, Star, Users, Clock, ExternalLink,
  ThumbsUp, ThumbsDown, ArrowRight, Share2, Loader2
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

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
    switch (verdict?.toUpperCase()) {
      case 'BUY':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          label: 'Recommended',
          description: 'This product receives positive feedback from most buyers.'
        };
      case 'THINK':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          label: 'Consider Carefully',
          description: 'This product has mixed reviews. Consider if it fits your needs.'
        };
      case 'AVOID':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: 'Not Recommended',
          description: 'This product has significant issues reported by customers.'
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
          text: `Is "${insight?.product_name}" worth it? Check out this AI-powered analysis.`,
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{insight?.product_name} - Is It Worth It? | Veriqo Product Insight</title>
        <meta name="description" content={`${insight?.summary?.slice(0, 155)}... Read the full AI-powered analysis of ${insight?.product_name} on Veriqo.`} />
        <meta property="og:title" content={`${insight?.product_name} - Product Insight | Veriqo`} />
        <meta property="og:description" content={insight?.summary?.slice(0, 200)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Navigation */}
      <nav className="border-b border-white/5 sticky top-0 bg-slate-950/90 backdrop-blur-xl z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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
      <main className="max-w-4xl mx-auto px-4 py-8">
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
            <div className="w-full md:w-48 h-48 bg-white rounded-2xl overflow-hidden flex-shrink-0">
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

              {/* Buy Button */}
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

        {/* Score Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Confidence Score */}
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-400" />
              Confidence Score
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8"/>
                  <circle 
                    cx="50" cy="50" r="42" fill="none" 
                    stroke={insight?.confidence_score >= 70 ? '#10B981' : insight?.confidence_score >= 40 ? '#F59E0B' : '#EF4444'} 
                    strokeWidth="8" strokeLinecap="round" 
                    strokeDasharray="264" 
                    strokeDashoffset={264 - (264 * (insight?.confidence_score || 0) / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{insight?.confidence_score}</span>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">
                  Based on analysis of verified customer reviews
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Analysis Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verdict</span>
                <span className={`font-semibold ${verdictConfig.color}`}>{insight?.verdict}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Complaints Found</span>
                <span className="text-white">{insight?.top_complaints?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Updated</span>
                <span className="text-white text-sm">
                  {new Date(insight?.analyzed_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Is "{insight?.product_name?.slice(0, 50)}" Worth It?
          </h2>
          <p className="text-slate-300 leading-relaxed">{insight?.summary}</p>
        </div>

        {/* Top Complaints */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ThumbsDown className="w-5 h-5 text-red-400" />
            Top Customer Complaints
          </h2>
          <div className="space-y-4">
            {insight?.top_complaints?.map((complaint, idx) => (
              <div key={idx} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{complaint.title}</h3>
                    <p className="text-slate-400 text-sm">{complaint.description}</p>
                  </div>
                  <span className="text-red-400 text-sm font-medium ml-4">{complaint.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Should Not Buy */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Who Should NOT Buy This Product?
          </h2>
          <ul className="space-y-3">
            {insight?.who_should_not_buy?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <XCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
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

        {/* Disclaimer */}
        <div className="text-center text-slate-500 text-sm mb-8">
          <p>
            This analysis is generated by AI based on publicly available customer reviews. 
            As an Amazon Associate, Veriqo earns from qualifying purchases.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">Veriqo</span>
          </Link>
          <p className="text-slate-500 text-sm">© 2024 Veriqo. Verify before you buy.</p>
          <div className="flex items-center gap-4">
            <Link to="/shoppers" className="text-slate-500 hover:text-white text-sm">For Shoppers</Link>
            <Link to="/sellers" className="text-slate-500 hover:text-white text-sm">For Sellers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
