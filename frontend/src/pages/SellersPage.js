import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Zap, Shield, ArrowRight, CheckCircle, 
  TrendingUp, Target, BarChart3, Users, Eye,
  Search, AlertTriangle, Building2, Sparkles,
  FileText, PieChart, Crosshair, Award
} from 'lucide-react';

export default function SellersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
              <Link to="/shoppers" className="text-slate-400 hover:text-white transition-colors">For Shoppers</Link>
              <Link to="/sellers" className="text-white font-medium">For Sellers</Link>
              <Link to="/#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6">
                  Start Free Trial
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
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-sm mb-8">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">For Amazon Sellers & Brands</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              Understand Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Customers Better
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            VERIQO helps Amazon sellers understand customer expectations, reduce returns, and 
            improve product listings using aggregated customer feedback. Transform thousands of 
            reviews into clear insights—without risk to account health or marketplace compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register">
              <Button 
                className="h-16 px-10 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-lg shadow-2xl shadow-purple-500/25 transition-all hover:scale-105"
              >
                <Crosshair className="w-5 h-5 mr-2" />
                Start Analyzing Reviews
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-slate-500 text-sm">
            Business plans start at $29/month • 100 product checks included
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Turn Customer Feedback Into Competitive Advantage
            </h3>
            <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
              By transforming thousands of reviews into clear insights, VERIQO shows where 
              expectations don't match real usage and which buyers a product is best suited for.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">↓ Returns</div>
                <p className="text-slate-400 text-sm">Understand customer expectations before they buy</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">↑ Listings</div>
                <p className="text-slate-400 text-sm">Optimize based on real customer feedback</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">0 Risk</div>
                <p className="text-slate-400 text-sm">No risk to account health or compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Analysis Features */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-4">
              <Target className="w-4 h-4" />
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Optimize Listings, Target the Right Customers
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Improve long-term performance with AI-powered review intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Aggregated Feedback Analysis</h3>
              <p className="text-slate-400 mb-6">
                Transform thousands of customer reviews into actionable insights. 
                Understand what buyers really think about your products.
              </p>
              <ul className="space-y-2">
                {['Customer expectations analysis', 'Pain point identification', 'Feature sentiment breakdown'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Expectation Gap Detection</h3>
              <p className="text-slate-400 mb-6">
                See where customer expectations don't match real product usage. 
                Fix listing issues before they lead to returns.
              </p>
              <ul className="space-y-2">
                {['Listing vs reality comparison', 'Return reason analysis', 'Messaging improvement tips'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ideal Customer Profiling</h3>
              <p className="text-slate-400 mb-6">
                Discover which buyers your product is best suited for. 
                Target the right customers and reduce negative reviews.
              </p>
              <ul className="space-y-2">
                {['Best-fit customer profiles', 'Use case identification', 'Target audience insights'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Compliance Safe</h3>
              <p className="text-slate-400 mb-6">
                Our analysis methods are 100% compliant with Amazon's terms. 
                No risk to your account health or seller status.
              </p>
              <ul className="space-y-2">
                {['TOS compliant analysis', 'No account risk', 'Safe marketplace practices'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Use Cases
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How Sellers Use VERIQO
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: 'Reduce Returns',
                desc: 'Understand why customers return products and fix listing issues before they cause problems.',
                example: 'Analyze returns → Identify expectation gaps → Update listing copy'
              },
              {
                icon: Award,
                title: 'Optimize Listings',
                desc: 'Improve product descriptions based on actual customer feedback and pain points.',
                example: 'Review complaints → Highlight strengths → Address concerns upfront'
              },
              {
                icon: PieChart,
                title: 'Target Right Buyers',
                desc: 'Find the customers who will love your product and reduce negative reviews.',
                example: '"Not for heavy users" → Target casual users → Better reviews'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all">
                <item.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <p className="text-purple-300 text-xs font-mono">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Pricing */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-pink-950/20 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Business Plans
            </h2>
            <p className="text-xl text-slate-400">
              Scale your competitive intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '29',
                checks: '100',
                features: ['100 competitor checks/month', 'Team dashboard', '3 team members', 'Basic analytics', 'Email support'],
                popular: false
              },
              {
                name: 'Pro',
                price: '99',
                checks: '500',
                features: ['500 competitor checks/month', 'Unlimited team members', 'CSV export', 'Advanced analytics', 'Priority support', 'Campaign tracking'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                checks: 'Unlimited',
                features: ['Unlimited checks', 'API access', 'Custom integrations', 'Dedicated manager', 'Custom reports', 'SLA guarantee'],
                popular: false
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
                  {plan.price !== 'Custom' && <span className="text-slate-400">/month</span>}
                </div>
                <p className="text-sm text-purple-400 mb-4">{plan.checks} checks/month</p>
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
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Improve Your Performance?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Start understanding your customers better and optimize your listings for long-term success.
              </p>
              <Link to="/register">
                <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg">
                  Start Free Trial
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
          <p className="text-slate-500 text-sm">© 2024 Veriqo. Outsmart the competition.</p>
        </div>
      </footer>
    </div>
  );
}
