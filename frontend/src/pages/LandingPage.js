import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Zap, Shield, Clock, ArrowRight, CheckCircle, Star, 
  Sparkles, TrendingUp, Users, Play, ChevronRight,
  ShoppingBag, BadgeCheck, AlertTriangle, Building2,
  BarChart3, Download, UserPlus, Crown
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden" data-testid="landing-page">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Veriqo</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/shoppers" className="text-slate-400 hover:text-white transition-colors">For Shoppers</Link>
              <Link to="/sellers" className="text-slate-400 hover:text-white transition-colors">For Sellers</Link>
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10" data-testid="login-btn">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full px-6 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105" data-testid="signup-btn">
                  Start Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-full text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Trusted by <span className="text-white font-semibold">50,000+</span> shoppers & businesses</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up">
            <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              Verify before
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              you buy.
            </span>
          </h1>
          
          {/* Subheadline - Safe Core */}
          <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            AI-powered Amazon product insights. Get instant
            <span className="inline-flex items-center mx-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-lg font-semibold">
              <CheckCircle className="w-4 h-4 mr-1.5" /> Great Match
            </span>
            <span className="inline-flex items-center mx-2 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-lg font-semibold">
              <AlertTriangle className="w-4 h-4 mr-1.5" /> Good Match
            </span>
            <span className="inline-flex items-center mx-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-lg font-semibold">
              <Shield className="w-4 h-4 mr-1.5" /> Consider Options
            </span>
            insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up stagger-2">
            <Link to="/register">
              <Button 
                className="h-16 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-emerald-500/25 transition-all hover:scale-105 group"
                data-testid="hero-cta"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#enterprise">
              <Button 
                variant="outline" 
                className="h-16 px-10 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg backdrop-blur-sm"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Enterprise Solutions
              </Button>
            </a>
          </div>

          <p className="text-slate-500 text-sm animate-fade-in stagger-3">
            3 free checks per month • No credit card required • 10-second results
          </p>
        </div>

        {/* Hero Visual - Mock Results Card */}
        <div className="max-w-4xl mx-auto mt-20 animate-slide-up stagger-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="53"/>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981"/>
                          <stop offset="100%" stopColor="#3B82F6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white">87</span>
                      <span className="text-sm text-slate-400">Score</span>
                    </div>
                  </div>
                  <div className="mt-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">GREAT MATCH</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Verified by AI • Updated 2 min ago</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Sony WH-1000XM5 Wireless Headphones</h3>
                  <p className="text-slate-400 mb-6">Exceptional noise cancellation and sound quality. Minor complaints about comfort during extended use.</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-slate-300">Build Quality Concerns</span>
                      <span className="text-slate-500 text-sm">12% of reviews</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-slate-300">Comfort Issues</span>
                      <span className="text-slate-500 text-sm">8% of reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active Users', icon: Users },
              { value: '1M+', label: 'Products Analyzed', icon: ShoppingBag },
              { value: '4.9', label: 'User Rating', icon: Star },
              { value: '<10s', label: 'Analysis Time', icon: Clock }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
              <TrendingUp className="w-4 h-4" />
              Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Shop smarter in 3 steps
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our AI analyzes thousands of reviews to give you actionable insights in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Link',
                description: 'Copy any Amazon product URL and paste it into Veriqo',
                icon: '🔗',
                gradient: 'from-blue-600 to-cyan-600'
              },
              {
                step: '02',
                title: 'AI Analyzes',
                description: 'Our AI reads and understands verified customer reviews',
                icon: '🤖',
                gradient: 'from-purple-600 to-pink-600'
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Receive Great Match/Good Match/Consider Options insights with key feedback highlighted',
                icon: '✅',
                gradient: 'from-emerald-600 to-teal-600'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/5 rounded-3xl hover:border-white/10 transition-all group-hover:translate-y-[-4px]">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-mono text-slate-500 mb-2 block">{item.step}</span>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
                {idx < 2 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-6 w-8 h-8 text-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
                <Shield className="w-4 h-4" />
                Why Veriqo
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Trust signals that matter
              </h2>
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, title: 'Real Review Analysis', desc: 'We analyze verified purchase reviews, filtering out fake ones' },
                  { icon: Clock, title: 'Instant Results', desc: 'Get your verdict in under 10 seconds, not minutes' },
                  { icon: Shield, title: 'Unbiased Insights', desc: 'No sponsorships or affiliate bias—just honest AI analysis' },
                  { icon: Star, title: 'Top Complaints', desc: 'Know exactly what real buyers complain about most' },
                  { icon: Download, title: 'Export Data', desc: 'Download analysis reports in CSV format (Business plans)' },
                  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track trends and insights across products (Enterprise)' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-emerald-600/30 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  {['Durability concerns after 6 months', 'Battery life shorter than advertised', 'Customer support response times'].map((complaint, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-slate-300">{complaint}</span>
                      <span className="ml-auto text-red-400 text-sm">{23 - idx * 5}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Best Suited For</span>
                  </div>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>• Budget-conscious shoppers</li>
                    <li>• Users with flexible expectations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
              <Crown className="w-4 h-4" />
              Simple Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Plans for everyone
            </h2>
            <p className="text-xl text-slate-400">
              From individual shoppers to enterprise teams
            </p>
          </div>

          {/* Shopper Plans */}
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-400" />
            For Shoppers
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl">
            {[
              {
                name: 'Free',
                price: '0',
                period: '/month',
                description: 'Perfect for casual shoppers',
                features: ['3 product checks per month', 'Product match insights', 'Things to know view', 'Basic support'],
                popular: false,
                cta: 'Get Started'
              },
              {
                name: 'Premium',
                price: '6.99',
                period: '/month',
                description: 'For power shoppers',
                features: ['Unlimited product checks', 'Save analysis history', 'Priority AI processing', 'Email support', 'No ads'],
                popular: true,
                cta: 'Start Free Trial'
              }
            ].map((plan, idx) => (
              <div key={idx} className={`relative p-6 rounded-2xl border transition-all ${plan.popular ? 'bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full text-white text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button className={`w-full h-11 rounded-xl font-semibold ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Business Plans */}
          <h3 id="enterprise" className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            For Business
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '29',
                period: '/month',
                description: 'For small teams',
                features: ['100 checks per month', 'Team dashboard', '3 team members', 'Basic analytics', 'Email support'],
                popular: false,
                cta: 'Start Trial'
              },
              {
                name: 'Pro',
                price: '99',
                period: '/month',
                description: 'For growing businesses',
                features: ['500 checks per month', 'Unlimited team members', 'CSV export', 'Advanced analytics', 'Priority support', 'Campaign management'],
                popular: true,
                cta: 'Start Trial'
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For large organizations',
                features: ['Unlimited checks', 'API access', 'Custom integrations', 'Dedicated account manager', 'Advanced analytics', 'SLA guarantee'],
                popular: false,
                cta: 'Contact Sales'
              }
            ].map((plan, idx) => (
              <div key={idx} className={`relative p-6 rounded-2xl border transition-all ${plan.popular ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30' : 'bg-white/5 border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xs font-semibold">
                    BEST VALUE
                  </div>
                )}
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price === 'Custom' ? '' : '$'}{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={plan.name === 'Enterprise' ? '#' : '/register'}>
                  <Button className={`w-full h-11 rounded-xl font-semibold ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to shop smarter?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Join 50,000+ shoppers and businesses making confident purchase decisions with Veriqo.
              </p>
              <Link to="/register">
                <Button 
                  className="h-14 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="footer-cta"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">Veriqo</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 Veriqo. Verify before you buy.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Terms</a>
            <a href="mailto:support@veriqoapp.com" className="text-slate-500 hover:text-white transition-colors text-sm">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
