import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft, Download, Search, Filter, Calendar, 
  ShoppingBag, CheckCircle, Info, Lightbulb,
  ChevronRight, Loader2, FileDown, Clock, TrendingUp
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

export default function HistoryPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyses(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (user?.subscription_type === 'free') {
      toast.error('CSV export is available for Premium and Business plans');
      navigate('/pricing');
      return;
    }

    setExporting(true);
    try {
      const response = await axios.get(`${API_URL}/history/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `veriqo-history-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('History exported successfully!');
    } catch (error) {
      console.error('Failed to export:', error);
      toast.error('Failed to export history');
    } finally {
      setExporting(false);
    }
  };

  const getVerdictIcon = (verdict) => {
    const normalized = normalizeVerdict(verdict);
    switch (normalized) {
      case 'great_match':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'good_match':
        return <Info className="w-5 h-5 text-amber-400" />;
      case 'consider_options':
        return <Lightbulb className="w-5 h-5 text-indigo-400" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-slate-400" />;
    }
  };

  const getVerdictStyles = (verdict) => {
    const normalized = normalizeVerdict(verdict);
    switch (normalized) {
      case 'great_match':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'good_match':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'consider_options':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter analyses (Safe Core: use normalized verdicts)
  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const normalized = normalizeVerdict(analysis.verdict);
    const matchesFilter = filterVerdict === 'all' || normalized === filterVerdict;
    return matchesSearch && matchesFilter;
  });

  // Count by normalized verdict
  const greatMatchCount = analyses.filter(a => normalizeVerdict(a.verdict) === 'great_match').length;
  const goodMatchCount = analyses.filter(a => normalizeVerdict(a.verdict) === 'good_match').length;
  const considerCount = analyses.filter(a => normalizeVerdict(a.verdict) === 'consider_options').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/home">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h1 className="text-lg font-semibold">Analysis History</h1>
              </div>
            </div>
            
            <Button
              onClick={handleExportCSV}
              disabled={exporting || analyses.length === 0}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats - Safe Core naming */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">Total Analyses</span>
            </div>
            <p className="text-2xl font-bold text-white">{analyses.length}</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Great Match</span>
            </div>
            <p className="text-2xl font-bold text-white">{greatMatchCount}</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-sm">Good Match</span>
            </div>
            <p className="text-2xl font-bold text-white">{goodMatchCount}</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">Consider</span>
            </div>
            <p className="text-2xl font-bold text-white">{considerCount}</p>
          </div>
        </div>

        {/* Filters - Safe Core naming */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'great_match', label: 'Great Match' },
              { key: 'good_match', label: 'Good Match' },
              { key: 'consider_options', label: 'Consider' }
            ].map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setFilterVerdict(filter.key)}
                variant={filterVerdict === filter.key ? 'default' : 'outline'}
                className={filterVerdict === filter.key 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No analyses found</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery || filterVerdict !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start analyzing Amazon products to see them here'}
            </p>
            <Link to="/home">
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500">
                Analyze a Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <Link
                key={analysis.id}
                to={`/results/${analysis.id}`}
                className="block group"
              >
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:bg-slate-800/70 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex-shrink-0 overflow-hidden">
                      {analysis.product_image ? (
                        <img 
                          src={analysis.product_image} 
                          alt={analysis.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-slate-500" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {analysis.product_name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getVerdictStyles(analysis.verdict)}`}>
                          {getVerdictIcon(analysis.verdict)}
                          {getVerdictLabel(analysis.verdict)}
                        </span>
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Score: {analysis.confidence_score}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(analysis.analyzed_at)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
