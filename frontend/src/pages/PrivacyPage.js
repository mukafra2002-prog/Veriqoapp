import { Link } from 'react-router-dom';
import { Zap, Shield, Lock, Eye, Database, Cookie, Mail, Globe } from 'lucide-react';

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Introduction
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Veriqo ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email address (when you create an account)</li>
                  <li>Name (if provided via Google login)</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Usage Data</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Products you analyze using our service</li>
                  <li>Your wishlist and saved items</li>
                  <li>Analysis history</li>
                  <li>Device information and browser type</li>
                  <li>IP address and general location</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>To provide and maintain our product insight service</li>
              <li>To process your subscription and payments</li>
              <li>To save your analysis history and preferences</li>
              <li>To send you service-related communications</li>
              <li>To improve our AI analysis algorithms</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* Cookies & Analytics */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-amber-400" />
              Cookies & Analytics
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>We use cookies and similar tracking technologies to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences</li>
                <li>Analyze how you use our service (via Google Analytics)</li>
                <li>Improve user experience</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our website. This service collects anonymous data about page views, session duration, and user behavior. You can opt out by using browser extensions like Google Analytics Opt-out.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Third-Party Services
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>We work with the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Stripe:</strong> For secure payment processing</li>
                <li><strong className="text-white">Google:</strong> For authentication (Google Sign-In)</li>
                <li><strong className="text-white">OpenAI:</strong> For AI-powered product analysis</li>
                <li><strong className="text-white">Amazon:</strong> For product data (we display Amazon product information)</li>
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                Each third-party service has its own privacy policy governing how they handle your data.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Data Retention</h2>
            <p className="text-slate-300">
              We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting us at <a href="mailto:support@veriqo.com" className="text-blue-400 hover:underline">support@veriqo.com</a>.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-slate-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-pink-400" />
              Contact Us
            </h2>
            <p className="text-slate-300">
              If you have questions about this Privacy Policy or your personal data, please contact us at:
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
