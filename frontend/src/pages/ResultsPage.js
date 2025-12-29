import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
  Bookmark
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="skeleton h-8 w-48"></div>
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-4 skeleton h-64 rounded-2xl"></div>
              <div className="md:col-span-8 skeleton h-64 rounded-2xl"></div>
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
    <div className="min-h-screen bg-slate-50" data-testid="results-page">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </button>

        {/* Product Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2" data-testid="product-name">
            {analysis.product_name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Verified by AI
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Analyzed {new Date(analysis.analyzed_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="bento-grid mb-8">
          {/* Score Card */}
          <div className="bento-score card-base flex flex-col items-center justify-center" data-testid="score-card">
            <ScoreGauge score={analysis.confidence_score} verdict={analysis.verdict} />
            <p className="text-sm text-slate-600 mt-4 text-center">
              Based on verified customer reviews
            </p>
          </div>

          {/* Verdict Card */}
          <div className="bento-verdict card-base" data-testid="verdict-card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
            <p className="text-slate-600 mb-6">{analysis.summary}</p>
            <div className={`p-4 rounded-xl ${
              analysis.verdict === 'buy' ? 'bg-emerald-50 border border-emerald-100' :
              analysis.verdict === 'think' ? 'bg-amber-50 border border-amber-100' :
              'bg-red-50 border border-red-100'
            }`}>
              <p className={`text-sm ${
                analysis.verdict === 'buy' ? 'text-emerald-700' :
                analysis.verdict === 'think' ? 'text-amber-700' :
                'text-red-700'
              }`}>
                {getVerdictDescription()}
              </p>
            </div>
          </div>

          {/* Complaints Card */}
          <div className="bento-complaints card-base" data-testid="complaints-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900">Top 3 Complaints</h2>
            </div>
            <div className="space-y-4">
              {analysis.top_complaints.map((complaint, idx) => (
                <div key={idx} className="complaint-card" data-testid={`complaint-${idx}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{complaint.title}</h3>
                      <p className="text-sm text-slate-600">{complaint.description}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                      {complaint.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Who Should Not Buy */}
          <div className="bento-full card-base" data-testid="who-should-not-buy">
            <div className="flex items-center gap-2 mb-4">
              <UserX className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-slate-900">Who Should NOT Buy This</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.who_should_not_buy.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl"
                  data-testid={`not-buy-${idx}`}
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-red-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={analysis.affiliate_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="affiliate-btn"
            data-testid="buy-on-amazon-btn"
          >
            <ExternalLink className="w-5 h-5" />
            Buy on Amazon
          </a>
          
          <Button
            variant="outline"
            className="h-12 px-6 rounded-xl"
            onClick={handleShare}
            data-testid="share-btn"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>

          {user?.subscription_type === 'premium' && (
            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl"
              data-testid="save-btn"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save Result
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
