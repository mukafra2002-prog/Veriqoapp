import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              Veriqo ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our product review analysis service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">2.1 Account Information</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Email address</li>
                  <li>Name (optional)</li>
                  <li>Password (encrypted)</li>
                  <li>Google account information (if using social login)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">2.2 Usage Data</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Product URLs you analyze</li>
                  <li>Analysis history and saved products</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">2.3 Payment Information</h3>
                <p className="text-slate-300">
                  Payment processing is handled by Stripe. We do not store your credit card information. Stripe's privacy policy governs the collection and use of your payment data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>To provide and maintain our product analysis service</li>
              <li>To process your subscription payments</li>
              <li>To send you service-related communications</li>
              <li>To improve our AI analysis algorithms</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. AI and Data Processing</h2>
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <p className="text-slate-300 mb-4">
                Our service uses artificial intelligence to analyze aggregated customer feedback from publicly available Amazon product reviews. Important disclosures:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>AI analysis summarizes patterns in publicly available reviews only</li>
                <li>We do not make accusations about review authenticity</li>
                <li>Analysis results are for informational purposes only</li>
                <li>AI outputs are cached to improve performance and reduce costs</li>
                <li>We use neutral language and include appropriate disclaimers</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing</h2>
            <p className="text-slate-300 mb-4">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Service Providers:</strong> Stripe (payments), OpenAI (AI processing), MongoDB (database)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Amazon Affiliate Disclosure</h2>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <p className="text-amber-200">
                Veriqo is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases made through our affiliate links.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Security</h2>
            <p className="text-slate-300">
              We implement industry-standard security measures including encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
            <p className="text-slate-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your analysis history</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies</h2>
            <p className="text-slate-300">
              We use essential cookies to maintain your session and preferences. We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-slate-300">
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p className="text-slate-300">
              If you have questions about this Privacy Policy, please contact us at privacy@veriqo.com.
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
