import { Link } from 'react-router-dom';
import { Zap, Shield, CheckCircle, XCircle, Heart, Eye, Target } from 'lucide-react';

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Veriqo</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            <Shield className="w-4 h-4" />
            Our Commitment
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Trust & Transparency</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Understanding how Veriqo works and what you can expect from our service.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Our Mission */}
          <section className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Our goal is to help shoppers better understand products before they buy. We use AI to summarize large volumes of publicly available customer feedback into neutral, easy-to-read insights.
            </p>
          </section>

          {/* What We Do */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              What Veriqo Does
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Summarizes Feedback', desc: 'We analyze thousands of customer reviews to identify common patterns and themes.' },
                { title: 'Provides Neutral Insights', desc: 'Our insights are objective and based solely on aggregated feedback data.' },
                { title: 'Helps Set Expectations', desc: 'We help you understand what to expect before making a purchase.' },
                { title: 'Saves Your Time', desc: 'Instead of reading hundreds of reviews, get key insights in seconds.' },
                { title: 'Highlights Key Patterns', desc: 'We identify the most frequently mentioned feedback points.' },
                { title: 'Suggests User Fit', desc: 'We help you determine if a product is right for your needs.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What We Don't Do */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              What Veriqo Does NOT Do
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Verify Reviews', desc: 'We do not verify the authenticity of individual customer reviews.' },
                { title: 'Score Seller Authenticity', desc: 'We do not rate or score sellers or their trustworthiness.' },
                { title: 'Make Fraud Claims', desc: 'We never make claims about fraud, scams, or product legitimacy.' },
                { title: 'Guarantee Quality', desc: 'We cannot guarantee product quality or seller behavior.' },
                { title: 'Replace Your Judgment', desc: 'Our insights support but don\'t replace your own research.' },
                { title: 'Affiliate with Brands', desc: 'We are independent and not affiliated with Amazon or any brand.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How Our Insights Work */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              How Our Insights Work
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Data Collection</h3>
                  <p className="text-slate-400">We collect publicly available customer feedback from Amazon product pages.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">AI Analysis</h3>
                  <p className="text-slate-400">Our AI processes the feedback to identify patterns, themes, and common sentiments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Neutral Summary</h3>
                  <p className="text-slate-400">We generate a neutral, easy-to-understand summary highlighting key insights.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Your Decision</h3>
                  <p className="text-slate-400">You use our insights along with your own research to make an informed decision.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Transparency', desc: 'We\'re open about how we work and our limitations.' },
                { title: 'Neutrality', desc: 'We present information without bias or judgment.' },
                { title: 'Independence', desc: 'We\'re not affiliated with any brand or seller.' }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 bg-slate-900/50 rounded-xl">
                  <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer Banner */}
          <section className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <p className="text-amber-200 text-center">
              <strong>Remember:</strong> All insights are informational only and meant to support your personal purchasing decisions. The final choice is always yours.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Questions or Feedback?</h2>
            <p className="text-slate-300 mb-4">
              We'd love to hear from you. Reach out anytime:
            </p>
            <a href="mailto:support@veriqo.com" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-colors">
              support@veriqo.com
            </a>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 Veriqo. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-white">Disclaimer</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
