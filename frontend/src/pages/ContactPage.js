import { Link } from 'react-router-dom';
import { Zap, Mail, MessageSquare, Clock, Shield, HelpCircle } from 'lucide-react';

export default function ContactPage() {
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
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Email */}
          <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl p-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Email Support</h2>
            <p className="text-slate-300 mb-6">
              For all inquiries including support, feedback, partnerships, and business questions.
            </p>
            <a 
              href="mailto:support@veriqo.com" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              support@veriqo.com
            </a>
          </div>

          {/* Response Time */}
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-8">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Response Time</h2>
            <p className="text-slate-300 mb-4">
              We aim to respond to all inquiries within:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <strong className="text-white">Premium users:</strong> 24 hours
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <strong className="text-white">Free users:</strong> 48-72 hours
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 bg-slate-800/50 border border-white/5 rounded-2xl p-8 text-center">
          <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Looking for Quick Answers?</h2>
          <p className="text-slate-400 mb-6">
            Check our FAQ for answers to common questions about Veriqo.
          </p>
          <Link 
            to="/faq" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            View FAQ
          </Link>
        </div>

        {/* Contact Categories */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { 
              title: 'Technical Support', 
              desc: 'Issues with your account, analysis, or subscriptions',
              icon: Shield,
              color: 'text-blue-400'
            },
            { 
              title: 'Feedback', 
              desc: 'Share your thoughts and suggestions for improvement',
              icon: MessageSquare,
              color: 'text-emerald-400'
            },
            { 
              title: 'Business Inquiries', 
              desc: 'Partnerships, enterprise plans, and API access',
              icon: Mail,
              color: 'text-purple-400'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-white/5 rounded-xl p-6">
              <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>
            By contacting us, you agree to our <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
            We will only use your information to respond to your inquiry.
          </p>
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
            <Link to="/trust" className="hover:text-white">Trust & Transparency</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
