import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Check, Crown, Zap, ArrowLeft, Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 6.99,
    period: '/month',
    description: 'Perfect for regular shoppers',
    features: [
      'Unlimited product checks',
      'Save product results',
      'Priority AI analysis',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 59,
    period: '/year',
    description: 'Best value for power users',
    features: [
      'Unlimited product checks',
      'Save product results',
      'Priority AI analysis',
      'Priority email support',
      'Early access to new features',
      'Save $24.88 vs monthly'
    ],
    popular: true
  }
];

export default function PricingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planId) => {
    if (user?.subscription_type === 'premium') {
      toast.info('You already have an active premium subscription');
      return;
    }

    setLoading(planId);
    try {
      const response = await axios.post(
        `${API_URL}/payments/checkout`,
        { 
          plan_id: planId,
          origin_url: window.location.origin
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Redirect to Stripe
      window.location.href = response.data.url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="pricing-page">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            Upgrade to Premium
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Unlimited product checks
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Never second-guess a purchase again. Get unlimited AI-powered review analysis.
          </p>
        </div>

        {/* Free Plan Info */}
        {user?.subscription_type !== 'premium' && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Free Plan</span>
            </div>
            <p className="text-blue-700">
              You have <span className="font-bold">{user?.checks_remaining || 0}</span> of {3} free checks remaining this month
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''} relative`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full h-12 rounded-full font-semibold ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
                disabled={loading === plan.id || user?.subscription_type === 'premium'}
                data-testid={`subscribe-${plan.id}`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : user?.subscription_type === 'premium' ? (
                  'Current Plan'
                ) : (
                  'Get Started'
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Cancel anytime. No questions asked.
        </p>
      </main>
    </div>
  );
}
