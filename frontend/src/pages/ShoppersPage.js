import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Zap, Shield, Clock, ArrowRight, CheckCircle, Star, 
  ShoppingCart, Search, AlertTriangle, ThumbsUp,
  BadgeCheck, Gift, Sparkles, Target, Eye, Heart
} from 'lucide-react';

export default function ShoppersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Veriqo</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/shoppers" className="text-white font-medium">For Shoppers</Link>
              <Link to="/sellers" className="text-slate-400 hover:text-white transition-colors">For Sellers</Link>
              <Link to="/#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-full px-6">
                  Start Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full text-sm mb-8">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Smart Shopping Made Easy</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              Shop with
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Never regret a purchase again. Get instant AI analysis of Amazon products 
            before you buy. Know what real customers complain about in seconds.
          </p>

          <Link to="/register">
            <Button 
              className="h-16 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-lg shadow-2xl shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <Gift className="w-5 h-5 mr-2" />
              Get 3 Free Checks
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <p className="text-slate-500 text-sm mt-4">
            No credit card required • Results in 10 seconds
          </p>
        </div>
      </section>

      {/* How It Works - Step by Step Guide */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              3 Simple Steps to Smart Shopping
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From product link to purchase decision in under a minute
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Find Your Product',
                description: 'Browse Amazon and find a product you\'re interested in. Copy the product URL from your browser.',
                icon: Search,
                gradient: 'from-emerald-600 to-teal-600',
                tip: 'Works with any Amazon.com product link'
              },
              {
                step: '02',
                title: 'Paste & Analyze',
                description: 'Paste the link into Veriqo. Our AI instantly reads through hundreds of verified reviews.',
                icon: Zap,
                gradient: 'from-blue-600 to-cyan-600',
                tip: 'Analysis takes only 10 seconds'
              },
              {
                step: '03',
                title: 'Make Smart Decision',
                description: 'Get a clear Buy/Think/Avoid verdict with the top complaints highlighted.',
                icon: Target,
                gradient: 'from-purple-600 to-pink-600',
                tip: 'Know exactly what to watch out for'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/5 rounded-3xl hover:border-white/10 transition-all h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-mono text-slate-500 mb-2 block">STEP {item.step}</span>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    {item.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
              <Eye className="w-4 h-4" />
              What You Get
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need to Decide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Verdict Card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Clear Verdict</h3>
                  <p className="text-slate-400 text-sm">Know instantly if it's worth it</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">BUY</span>
                  <span className="text-slate-400 text-sm ml-auto">Score 70-100</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-semibold">THINK</span>
                  <span className="text-slate-400 text-sm ml-auto">Score 40-69</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">AVOID</span>
                  <span className="text-slate-400 text-sm ml-auto">Score 0-39</span>
                </div>
              </div>
            </div>

            {/* Complaints Card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Top 3 Complaints</h3>
                  <p className="text-slate-400 text-sm">What real buyers say</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { complaint: 'Battery dies quickly', percent: '23%' },
                  { complaint: 'Build quality issues', percent: '18%' },
                  { complaint: 'Smaller than expected', percent: '12%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-slate-300">{item.complaint}</span>
                    <span className="text-red-400 text-sm font-medium">{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who Should Not Buy */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Who Should NOT Buy</h3>
                  <p className="text-slate-400 text-sm">Personalized recommendations</p>
                </div>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  Heavy users expecting 3+ years of use
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  People with large hands (controls too small)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  Users without reliable customer support access
                </li>
              </ul>
            </div>

            {/* Confidence Score */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Confidence Score</h3>
                  <p className="text-slate-400 text-sm">AI-calculated rating</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGradient2)" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="66"/>
                    <defs>
                      <linearGradient id="scoreGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981"/>
                        <stop offset="100%" stopColor="#3B82F6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">75</span>
                    <span className="text-xs text-slate-400">out of 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Shoppers Love Veriqo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Save Time', desc: 'Skip reading hundreds of reviews. Get the summary in 10 seconds.' },
              { icon: Shield, title: 'Avoid Regret', desc: 'Know the hidden problems before they become your problems.' },
              { icon: Heart, title: 'Shop Smarter', desc: 'Make confident decisions backed by AI analysis.' },
              { icon: Gift, title: '3 Free Checks', desc: 'Try it free every month. No credit card needed.' },
              { icon: CheckCircle, title: 'Real Reviews', desc: 'Analysis based on verified customer purchases only.' },
              { icon: Star, title: 'Unbiased', desc: 'No sponsorships. Pure AI-driven honest analysis.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all">
                <item.icon className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600"></div>
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Shop Smarter?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of smart shoppers making confident purchase decisions.
              </p>
              <Link to="/register">
                <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg">
                  Start Free Today
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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">Veriqo</span>
          </Link>
          <p className="text-slate-500 text-sm">© 2024 Veriqo. Shop smart.</p>
        </div>
      </footer>
    </div>
  );
}
