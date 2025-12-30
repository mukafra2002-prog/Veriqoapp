import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { 
  Zap, CheckCircle, AlertTriangle, XCircle, 
  Search, ShoppingBag, ArrowRight, Loader2,
  TrendingUp, Clock
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function InsightsDirectoryPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/insights`);
      setInsights(response.data);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'BUY':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'THINK':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'AVOID':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-slate-400" />;
    }
  };

  const getVerdictStyles = (verdict) => {
    switch (verdict?.toUpperCase()) {
      case 'BUY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'THINK':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'AVOID':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterVerdict === 'all' || insight.verdict?.toUpperCase() === filterVerdict;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Product Insights Directory - Amazon Product Reviews Analysis | Veriqo</title>
        <meta name="description" content="Browse AI-powered product insights for popular Amazon products. Get Buy/Think/Avoid verdicts, top complaints, and more before you purchase." />
        <meta property="og:title" content="Product Insights Directory | Veriqo" />
        <meta property="og:description" content="Browse AI-powered product insights for popular Amazon products." />
        <link rel="canonical" href={`${window.location.origin}/insights`} />
      </Helmet>

      {/* Navigation */}
      <nav className="border-b border-white/5 sticky top-0 bg-slate-950/90 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Veriqo</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/shoppers" className="text-slate-400 hover:text-white transition-colors">For Shoppers</Link>
            <Link to="/sellers" className="text-slate-400 hover:text-white transition-colors">For Sellers</Link>
            <Link to="/insights" className="text-white font-medium">Insights</Link>
          </div>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
              Try Veriqo Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
            <TrendingUp className="w-4 h-4" />
            Featured Product Insight
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Free Product Insight Preview
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            See how Veriqo analyzes Amazon products. Sign up free to analyze any product you want.
          </p>
        </div>
      </section>

      {/* Search & Filter - Hidden since only 1 product */}
      {/* Removed search and filter since we only show 1 product */}

      {/* Insights Grid */}
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No insights available</h3>
              <p className="text-slate-400 mb-6">
                Be the first to analyze a product!
              </p>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600">
                  Analyze a Product
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Single Featured Product */}
              {insights.map((insight) => (
                <Link
                  key={insight.id}
                  to={`/insights/${insight.id}`}
                  className="group block"
                >
                  <article className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:bg-slate-800/70 transition-all">
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="md:w-64 h-48 md:h-auto bg-white p-4 flex items-center justify-center flex-shrink-0">
                        {insight.product_image ? (
                          <img 
                            src={insight.product_image} 
                            alt={insight.product_name}
                            className="max-h-full object-contain"
                          />
                        ) : (
                          <ShoppingBag className="w-16 h-16 text-slate-300" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                            FEATURED INSIGHT
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getVerdictStyles(insight.verdict)}`}>
                            {getVerdictIcon(insight.verdict)}
                            {insight.verdict}
                          </span>
                        </div>
                        
                        {/* Product Name */}
                        <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                          {insight.product_name}
                        </h2>
                        
                        {/* Summary */}
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                          {insight.summary}
                        </p>
                        
                        {/* Meta */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-sm flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(insight.analyzed_at).toLocaleDateString()}
                          </span>
                          <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Full Analysis
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}

              {/* Unlock More CTA */}
              <div className="mt-8 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-2xl text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Want to Analyze More Products?
                </h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Sign up for free and get 3 product analyses per month. 
                  Analyze any Amazon product instantly.
                </p>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold px-8 h-12">
                    Get 3 Free Analyses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">Veriqo</span>
          </Link>
          <p className="text-slate-500 text-sm">© 2024 Veriqo. Verify before you buy.</p>
        </div>
      </footer>
    </div>
  );
}
