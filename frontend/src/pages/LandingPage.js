import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Zap, Shield, Clock, ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="landing-page">
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Veriqo</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium" data-testid="login-btn">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6" data-testid="signup-btn">
                  Sign up free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Shield className="w-4 h-4" />
            Trusted by 10,000+ smart shoppers
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 animate-slide-up">
            Verify before you buy.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
            Paste any Amazon link. Get instant AI-powered review analysis with a clear 
            <span className="text-emerald-600 font-semibold"> Buy</span> / 
            <span className="text-amber-600 font-semibold"> Think</span> / 
            <span className="text-red-600 font-semibold"> Avoid</span> verdict.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
            <Link to="/register">
              <Button 
                className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all hover:scale-[1.02]"
                data-testid="hero-cta"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="h-14 px-8 rounded-full border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50"
            >
              See How It Works
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-4 animate-fade-in stagger-3">
            3 free checks per month • No credit card required
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Make confident purchases in seconds
          </h2>
          <p className="text-slate-600 text-center mb-16 max-w-2xl mx-auto">
            Our AI analyzes thousands of real reviews to give you actionable insights
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Amazon Link',
                description: 'Copy any Amazon product URL and paste it into Veriqo',
                icon: '🔗'
              },
              {
                step: '02',
                title: 'AI Analyzes Reviews',
                description: 'Our AI reads and understands verified customer feedback',
                icon: '🤖'
              },
              {
                step: '03',
                title: 'Get Clear Verdict',
                description: 'Receive Buy/Think/Avoid score with top complaints highlighted',
                icon: '✅'
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="relative p-8 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all"
              >
                <span className="text-5xl mb-4 block">{item.icon}</span>
                <span className="text-sm font-mono text-blue-600 mb-2 block">{item.step}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Why shoppers trust Veriqo
              </h2>
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, title: 'Real Review Analysis', desc: 'We analyze verified purchase reviews, not fake ones' },
                  { icon: Clock, title: 'Instant Results', desc: 'Get your verdict in under 10 seconds' },
                  { icon: Shield, title: 'Unbiased Insights', desc: 'No sponsorships, just honest AI-powered analysis' },
                  { icon: Star, title: 'Top Complaints Highlighted', desc: 'Know exactly what real buyers complain about' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 relative overflow-hidden">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">87</div>
                    <div className="text-sm text-slate-500">Confidence Score</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  <CheckCircle className="w-4 h-4" />
                  BUY
                </div>
                <p className="text-slate-600 text-sm">
                  "Highly rated for durability and value. Minor complaints about packaging."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to shop smarter?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of shoppers making confident purchase decisions with Veriqo.
          </p>
          <Link to="/register">
            <Button 
              className="h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
              data-testid="footer-cta"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Veriqo</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2024 Veriqo. Verify before you buy.
          </p>
        </div>
      </footer>
    </div>
  );
}
