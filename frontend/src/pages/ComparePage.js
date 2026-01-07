import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { 
  GitCompare, Plus, Trash2, Loader2, CheckCircle, Info, 
  Lightbulb, Trophy, ShoppingBag, ExternalLink, ArrowRight, Sparkles
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

// Safe Core: Get display label for verdict
const getVerdictLabel = (verdict) => {
  const normalized = normalizeVerdict(verdict);
  const labels = {
    'great_match': 'Great Match',
    'good_match': 'Good Match',
    'consider_options': 'Consider Options'
  };
  return labels[normalized] || 'Good Match';
};

export default function ComparePage() {
  const { token, user } = useAuth();
  const [urls, setUrls] = useState(['', '']);
  const [comparing, setComparing] = useState(false);
  const [results, setResults] = useState(null);

  const addUrl = () => {
    if (urls.length < 3) {
      setUrls([...urls, '']);
    }
  };

  const removeUrl = (index) => {
    if (urls.length > 2) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const compareProducts = async () => {
    const validUrls = urls.filter(url => url.trim() && url.includes('amazon'));
    
    if (validUrls.length < 2) {
      toast.error('Please enter at least 2 valid Amazon URLs');
      return;
    }

    setComparing(true);
    setResults(null);

    try {
      const response = await axios.post(
        `${API_URL}/compare`,
        { product_urls: validUrls },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data);
      toast.success('Comparison complete!');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to compare products';
      toast.error(message);
    } finally {
      setComparing(false);
    }
  };

  const getVerdictConfig = (verdict) => {
    const normalized = normalizeVerdict(verdict);
    switch (normalized) {
      case 'great_match':
        return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      case 'good_match':
        return { icon: Info, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
      case 'consider_options':
        return { icon: Lightbulb, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' };
      default:
        return { icon: ShoppingBag, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-4">
            <GitCompare className="w-4 h-4" />
            Product Comparison
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Compare Products Side by Side</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Enter 2-3 Amazon product URLs to compare their feedback patterns and insights.
          </p>
        </div>

        {/* URL Input Section */}
        {!results && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Enter Product URLs</h2>
              
              <div className="space-y-3 mb-4">
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                        #{index + 1}
                      </span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        placeholder="https://amazon.com/dp/..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    {urls.length > 2 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeUrl(index)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {urls.length < 3 && (
                <Button
                  variant="outline"
                  onClick={addUrl}
                  className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Product
                </Button>
              )}

              <Button
                onClick={compareProducts}
                disabled={comparing}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
              >
                {comparing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Products...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-5 h-5 mr-2" />
                    Compare Products
                  </>
                )}
              </Button>

              <p className="text-slate-500 text-sm text-center mt-3">
                Uses {urls.filter(u => u.trim()).length} of your remaining checks
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Winner Banner */}
            {results.winner && (
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-amber-400 mb-1">TOP RECOMMENDATION</h3>
                    <p className="text-xl font-bold text-white">{results.winner.product_name}</p>
                    <p className="text-slate-400 text-sm">{results.winner.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-400">{results.winner.confidence_score}%</div>
                    <div className="text-slate-400 text-sm">Score</div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Comparison Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.products.map((product, index) => {
                if (product.error) {
                  return (
                    <div key={index} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                      <Lightbulb className="w-8 h-8 text-red-400 mb-2" />
                      <p className="text-red-400">Failed to analyze</p>
                      <p className="text-slate-500 text-sm truncate">{product.url}</p>
                    </div>
                  );
                }

                const verdictConfig = getVerdictConfig(product.verdict);
                const VerdictIcon = verdictConfig.icon;
                const isWinner = results.winner?.product_name === product.product_name;

                // Safe Core: Get data with fallbacks for both old and new field names
                const thingsToKnow = product.things_to_know || product.top_complaints || [];

                return (
                  <div 
                    key={product.id}
                    className={`bg-slate-800/50 border rounded-2xl p-6 relative ${isWinner ? 'border-amber-500/50 ring-2 ring-amber-500/20' : 'border-white/10'}`}
                  >
                    {isWinner && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        TOP PICK
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="w-full h-32 bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {product.product_image ? (
                        <img src={product.product_image} alt={product.product_name} className="max-h-full object-contain p-2" />
                      ) : (
                        <ShoppingBag className="w-12 h-12 text-slate-300" />
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-white mb-3 line-clamp-2">{product.product_name}</h3>

                    {/* Verdict & Score */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${verdictConfig.bg} ${verdictConfig.border}`}>
                        <VerdictIcon className={`w-4 h-4 ${verdictConfig.color}`} />
                        <span className={verdictConfig.color}>{getVerdictLabel(product.verdict)}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{product.confidence_score}%</div>
                    </div>

                    {/* Top Thing to Know */}
                    <div className="mb-4">
                      <p className="text-slate-500 text-xs mb-1">KEY INSIGHT</p>
                      <p className="text-slate-300 text-sm">{thingsToKnow[0]?.title || 'N/A'}</p>
                    </div>

                    {/* Summary */}
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{product.summary}</p>

                    {/* Action */}
                    <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white">
                        View on Amazon
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Compare Again */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setResults(null);
                  setUrls(['', '']);
                }}
                variant="outline"
                className="border-white/20 text-slate-400 hover:text-white"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Different Products
              </Button>
            </div>
          </div>
        )}

        {/* How it Works */}
        {!results && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">How Comparison Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Add Products', desc: 'Paste 2-3 Amazon product URLs you want to compare' },
                { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes feedback patterns for each product' },
                { step: '3', title: 'See Results', desc: 'Get a clear comparison to help inform your decision' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-400 font-bold">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
