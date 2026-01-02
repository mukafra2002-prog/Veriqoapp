import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <nav className="border-b border-white/5 sticky top-0 bg-slate-950/90 backdrop-blur-xl z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Veriqo</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: January 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using Veriqo ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-slate-300 mb-4">
              Veriqo provides AI-powered analysis of Amazon product reviews to help users make informed purchasing decisions. Our service includes:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Product analysis with Buy/Think/Avoid verdicts</li>
              <li>Aggregated feedback summaries</li>
              <li>Product comparison tools</li>
              <li>Analysis history and wishlist features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Important Disclaimers</h2>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-2">3.1 Not Professional Advice</h3>
                <p className="text-slate-300">
                  Veriqo's analysis is for informational purposes only and does not constitute professional, financial, or purchasing advice. Always conduct your own research before making purchase decisions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-2">3.2 AI Limitations</h3>
                <p className="text-slate-300">
                  Our AI summarizes aggregated customer feedback patterns. Results may not be 100% accurate, complete, or up-to-date. Individual experiences with products may vary significantly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-2">3.3 No Review Authenticity Claims</h3>
                <p className="text-slate-300">
                  Veriqo does not make claims about the authenticity of Amazon reviews. We do not accuse sellers, manufacturers, or other parties of fraudulent practices.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-2">3.4 Not Affiliated with Amazon</h3>
                <p className="text-slate-300">
                  Veriqo is an independent service and is not affiliated with, endorsed by, or sponsored by Amazon.com, Inc. or its affiliates.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. User Accounts</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>One person may not maintain multiple free accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription Plans</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">5.1 Free Plan</h3>
                <p className="text-slate-300">
                  Free users receive 3 product analyses per month. Unused analyses do not roll over.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">5.2 Premium Plan</h3>
                <p className="text-slate-300">
                  Premium subscribers receive unlimited analyses, CSV export, and priority support. Subscription fees are billed monthly or annually.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">5.3 Cancellation</h3>
                <p className="text-slate-300">
                  You may cancel your subscription at any time. Access continues until the end of your billing period. No refunds for partial months.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Acceptable Use</h2>
            <p className="text-slate-300 mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to reverse-engineer or copy our AI analysis methods</li>
              <li>Scrape, crawl, or automatically access the Service</li>
              <li>Share your account credentials with others</li>
              <li>Circumvent usage limits or security measures</li>
              <li>Use the Service to defame products, sellers, or manufacturers</li>
              <li>Republish our analysis as your own content without attribution</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-slate-300">
              The Service, including its AI algorithms, design, and content, is owned by Veriqo and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Amazon Affiliate Program</h2>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <p className="text-amber-200">
                Veriqo participates in the Amazon Services LLC Associates Program. When you click our "Buy on Amazon" links and make a purchase, we may earn a commission at no additional cost to you. This affiliate relationship does not influence our analysis results.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <p className="text-slate-300">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VERIQO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE OR RELIANCE ON OUR ANALYSIS RESULTS.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
            <p className="text-slate-300">
              You agree to indemnify and hold harmless Veriqo, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Service Availability</h2>
            <p className="text-slate-300">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may suspend the Service for maintenance, updates, or security reasons. The AI analysis feature may be temporarily disabled for maintenance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Modifications to Service</h2>
            <p className="text-slate-300">
              We reserve the right to modify, suspend, or discontinue the Service at any time. We will provide reasonable notice for significant changes. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
            <p className="text-slate-300">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. Dispute Resolution</h2>
            <p className="text-slate-300">
              Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration, except where prohibited by law. You waive any right to participate in class action lawsuits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
            <p className="text-slate-300">
              For questions about these Terms, please contact us at legal@veriqo.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">16. Severability</h2>
            <p className="text-slate-300">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">Veriqo</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white text-sm">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
