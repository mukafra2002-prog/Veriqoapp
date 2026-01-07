import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, Info, Shield, ExternalLink } from 'lucide-react';

export default function DisclaimerPage() {
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Disclaimer</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Main Disclaimer */}
          <section className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Important Notice</h2>
                <p className="text-lg text-slate-200 leading-relaxed">
                  VERIQO provides independent, informational summaries based on publicly available customer feedback. VERIQO does not verify reviews, does not make guarantees, and is not affiliated with Amazon or any brand.
                </p>
              </div>
            </div>
          </section>

          {/* What Veriqo Does */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              What Veriqo Does
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>Veriqo is an AI-powered tool that:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Summarizes large volumes of publicly available customer feedback</li>
                <li>Provides neutral, easy-to-read insights about products</li>
                <li>Helps you understand product expectations before purchasing</li>
                <li>Offers "Great Match," "Good Match," or "Consider Options" assessments</li>
              </ul>
            </div>
          </section>

          {/* What Veriqo Does NOT Do */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              What Veriqo Does NOT Do
            </h2>
            <div className="space-y-4 text-slate-300">
              <p className="font-semibold text-white">Veriqo does NOT:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Verify the authenticity of individual reviews</li>
                <li>Score or rate seller authenticity</li>
                <li>Make claims about fraud or product legitimacy</li>
                <li>Guarantee product quality or seller behavior</li>
                <li>Provide professional purchasing advice</li>
                <li>Replace your own research and judgment</li>
              </ul>
            </div>
          </section>

          {/* Informational Purpose */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Informational Purpose Only</h2>
            <p className="text-slate-300 leading-relaxed">
              All insights provided by Veriqo are <strong className="text-white">informational only</strong> and are meant to support your personal purchasing decisions. Our AI summarizes patterns in customer feedback to help you understand what to expect from a product. The final purchasing decision is always yours.
            </p>
          </section>

          {/* No Warranty */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">No Warranty</h2>
            <p className="text-slate-300 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, COMPLETENESS, OR RELIABILITY OF THE INSIGHTS PROVIDED. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          {/* Affiliate Disclosure */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              Affiliate Disclosure
            </h2>
            <p className="text-slate-300 leading-relaxed">
              As an Amazon Associate, Veriqo earns from qualifying purchases. When you click on product links and make a purchase on Amazon, we may receive a small commission at no additional cost to you. This helps support our service and allows us to continue providing free insights.
            </p>
          </section>

          {/* Independence Statement */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Independence Statement</h2>
            <p className="text-slate-300 leading-relaxed">
              Veriqo is an <strong className="text-white">independent platform</strong> and is not affiliated with Amazon or any brand. Our insights are generated independently using publicly available customer feedback. We do not receive compensation from brands for favorable reviews or assessments.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              IN NO EVENT SHALL VERIQO BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE OR ANY PURCHASING DECISIONS MADE BASED ON OUR INSIGHTS. YOUR USE OF THIS SERVICE IS AT YOUR OWN RISK.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Questions?</h2>
            <p className="text-slate-300">
              If you have questions about this Disclaimer, please contact us at:
            </p>
            <p className="mt-2">
              <a href="mailto:support@veriqo.com" className="text-blue-400 hover:underline font-semibold">
                support@veriqo.com
              </a>
            </p>
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
