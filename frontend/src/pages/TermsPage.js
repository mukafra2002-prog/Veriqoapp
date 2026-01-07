import { Link } from 'react-router-dom';
import { Zap, FileText, Scale, AlertCircle, UserCheck, Ban, CreditCard, Shield } from 'lucide-react';

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-4">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Agreement to Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using Veriqo ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the Service. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Service Description */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Service Description
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>Veriqo provides AI-powered product insight summaries based on publicly available customer feedback from Amazon. Our service:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Summarizes aggregated customer feedback patterns</li>
                <li>Provides informational insights to help you understand products</li>
                <li>Offers "Great Match," "Good Match," or "Consider Options" assessments</li>
                <li>Highlights key feedback patterns and user fit recommendations</li>
              </ul>
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-300 text-sm">
                  <strong>Important:</strong> Veriqo is an informational tool only. We do not verify reviews, guarantee product quality, or make claims about seller authenticity. All insights are for informational purposes to support your personal purchasing decisions.
                </p>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              User Accounts
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>When you create an account with us, you must:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
              <p className="mt-4">
                You must be at least 18 years old to use this Service. By using the Service, you represent that you meet this requirement.
              </p>
            </div>
          </section>

          {/* Subscriptions & Payments */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-400" />
              Subscriptions & Payments
            </h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Free Tier</h3>
                <p>Free accounts receive 3 product analyses per month with basic features.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Premium Subscriptions</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Premium plans are billed monthly or annually</li>
                  <li>Payments are processed securely via Stripe</li>
                  <li>Subscriptions auto-renew unless cancelled</li>
                  <li>You may cancel at any time from your account settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Refunds</h3>
                <p>We offer a 7-day refund policy for first-time subscribers. Contact support@veriqo.com for refund requests.</p>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              Prohibited Uses
            </h2>
            <p className="text-slate-300 mb-4">You agree NOT to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Violate any applicable laws or regulations</li>
              <li>Scrape, copy, or redistribute our content without permission</li>
              <li>Attempt to reverse-engineer our AI or algorithms</li>
              <li>Use automated tools to access the Service excessively</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Upload malicious code or interfere with Service operation</li>
              <li>Use insights to make defamatory claims about products or sellers</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Intellectual Property</h2>
            <p className="text-slate-300">
              The Service and its original content (excluding user-provided data), features, and functionality are owned by Veriqo and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Limitation of Liability
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VERIQO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Purchasing decisions made based on our insights</li>
                <li>Product quality or seller behavior</li>
                <li>Accuracy of third-party information</li>
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Termination</h2>
            <p className="text-slate-300">
              We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately. You may also delete your account at any time through your account settings.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p className="text-slate-300">
              We reserve the right to modify these terms at any time. We will notify users of material changes via email or prominent notice on our Service. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-slate-300">
              For questions about these Terms of Service, please contact us at:
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
