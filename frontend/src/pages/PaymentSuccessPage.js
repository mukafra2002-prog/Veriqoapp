import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle, Loader2, XCircle, Crown, ArrowRight } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    if (attempts >= maxAttempts) {
      setStatus('error');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.payment_status === 'paid') {
        setStatus('success');
        await refreshUser();
        toast.success('Welcome to Veriqo Premium!');
      } else if (response.data.status === 'expired') {
        setStatus('error');
      } else {
        setAttempts(prev => prev + 1);
        setTimeout(checkPaymentStatus, 2000);
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
      setAttempts(prev => prev + 1);
      if (attempts < maxAttempts - 1) {
        setTimeout(checkPaymentStatus, 2000);
      } else {
        setStatus('error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950" data-testid="payment-success-page">
      <Navbar />
      
      <main className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Processing Payment
              </h1>
              <p className="text-slate-400 mb-6">
                Please wait while we confirm your payment...
              </p>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
                <Crown className="w-4 h-4" />
                Premium Activated
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" data-testid="success-title">
                Payment Successful!
              </h1>
              <p className="text-slate-400 mb-8">
                Welcome to Veriqo Premium. You now have unlimited product checks!
              </p>
              <Button
                onClick={() => navigate('/home')}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold"
                data-testid="continue-btn"
              >
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Payment Issue
              </h1>
              <p className="text-slate-400 mb-8">
                We couldn't confirm your payment. If you were charged, please contact support.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/pricing')}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/home')}
                  className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  Go to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
