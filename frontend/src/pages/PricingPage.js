import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import axios from 'axios';
import { Check, Crown, Zap, ArrowLeft, Loader2, ShoppingBag, Building2, Download, Users, BarChart3 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const shopperPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Perfect for casual shoppers',
    features: [
      '3 product checks per month',
      'Product match insights',
      'Things to know view',
      'Basic support'
    ],
    popular: false,
    disabled: true
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 6.99,
    period: '/month',
    description: 'For power shoppers',
    features: [
      'Unlimited product checks',
      'Save analysis history',
      'Priority AI processing',
      'Email support',
      'No ads'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 59,
    period: '/year',
    description: 'Best value - Save $24.88',
    features: [
      'Unlimited product checks',
      'Save analysis history',
      'Priority AI processing',
      'Email support',
      'No ads',
      '2 months free'
    ],
    popular: false
  }
];

const businessPlans = [
  {
    id: 'business_starter',
    name: 'Starter',
    price: 29,
    period: '/month',
    description: 'For small teams',
    features: [
      '100 checks per month',
      'Team dashboard',
      '3 team members',
      'Basic analytics',
      'Email support'
    ],
    popular: false,
    icon: Users
  },
  {
    id: 'business_pro',
    name: 'Pro',
    price: 99,
    period: '/month',
    description: 'For growing businesses',
    features: [
      '500 checks per month',
      'Unlimited team members',
      'CSV export',
      'Advanced analytics',
      'Priority support',
      'Campaign management'
    ],
    popular: true,
    icon: BarChart3
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited checks',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced analytics',
      'SLA guarantee'
    ],
    popular: false,
    icon: Building2
  }
];

export default function PricingPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('shopper');

  const handleSubscribe = async (planId) => {
    if (planId === 'free' || planId === 'enterprise') {
      if (planId === 'enterprise') {
        window.location.href = 'mailto:enterprise@veriqoapp.com?subject=Enterprise%20Plan%20Inquiry';
      }
      return;
    }

    if (user?.subscription_type === 'premium') {
      toast.info('You already have an active subscription');
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
      
      window.location.href = response.data.url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950" data-testid="pricing-page">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            Choose Your Plan
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Plans for every need
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From individual shoppers to enterprise teams, we have a plan for you
          </p>
        </div>

        {/* Free Plan Info */}
        {user?.subscription_type !== 'premium' && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white">Current Plan: Free</span>
            </div>
            <p className="text-blue-300">
              You have <span className="font-bold">{user?.checks_remaining || 0}</span> of 3 free checks remaining this month
            </p>
          </div>
        )}

        {/* Plan Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto h-14 bg-white/5 border border-white/10 rounded-2xl p-1.5 mb-10">
            <TabsTrigger 
              value="shopper" 
              className="flex-1 h-11 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-slate-400 font-semibold"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              For Shoppers
            </TabsTrigger>
            <TabsTrigger 
              value="business"
              className="flex-1 h-11 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-400 font-semibold"
            >
              <Building2 className="w-4 h-4 mr-2" />
              For Business
            </TabsTrigger>
          </TabsList>

          {/* Shopper Plans */}
          <TabsContent value="shopper">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {shopperPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-blue-500/30 shadow-xl shadow-blue-500/10' 
                      : 'bg-white/5 border-white/10'
                  }`}
                  data-testid={`plan-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-semibold rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full h-12 rounded-xl font-semibold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white'
                        : plan.disabled
                        ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    disabled={loading === plan.id || user?.subscription_type === 'premium' || plan.disabled}
                    data-testid={`subscribe-${plan.id}`}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : plan.disabled ? (
                      'Current Plan'
                    ) : user?.subscription_type === 'premium' ? (
                      'Active'
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Business Plans */}
          <TabsContent value="business">
            <div className="grid md:grid-cols-3 gap-6">
              {businessPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 shadow-xl shadow-purple-500/10' 
                      : 'bg-white/5 border-white/10'
                  }`}
                  data-testid={`plan-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
                        BEST VALUE
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    {plan.icon && (
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <plan.icon className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      {plan.price === 'Custom' ? (
                        <span className="text-4xl font-bold text-white">Custom</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-white">${plan.price}</span>
                          <span className="text-slate-400">{plan.period}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-purple-400" />
                        </div>
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full h-12 rounded-xl font-semibold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    disabled={loading === plan.id}
                    data-testid={`subscribe-${plan.id}`}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : plan.id === 'enterprise' ? (
                      'Contact Sales'
                    ) : (
                      'Start Trial'
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Enterprise Contact */}
            <div className="mt-12 text-center">
              <p className="text-slate-400 mb-4">
                Need a custom solution? Talk to our enterprise team.
              </p>
              <a href="mailto:enterprise@veriqoapp.com">
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                  <Building2 className="w-4 h-4 mr-2" />
                  Contact Enterprise Sales
                </Button>
              </a>
            </div>
          </TabsContent>
        </Tabs>

        {/* Guarantee */}
        <p className="text-center text-slate-500 text-sm mt-12">
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </main>
    </div>
  );
}
