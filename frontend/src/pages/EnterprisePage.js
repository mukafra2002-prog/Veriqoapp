import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Zap, Building2, Users, BarChart3, Shield, Check,
  Mail, Phone, MessageSquare, ArrowRight, Loader2,
  Globe, Clock, Headphones, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    employees: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    // For now, just simulate submission since we don't have email service
    // In production, this would send to your backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    toast.success('Thank you! Our team will contact you within 24 hours.');
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const enterpriseFeatures = [
    { icon: Users, title: 'Unlimited Team Members', desc: 'Add your entire team with role-based access' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into product performance' },
    { icon: Shield, title: 'SLA Guarantee', desc: '99.9% uptime with dedicated support' },
    { icon: Globe, title: 'API Access', desc: 'Integrate Veriqo into your workflows' },
    { icon: Headphones, title: 'Dedicated Account Manager', desc: 'Personal support for your team' },
    { icon: FileText, title: 'Custom Integrations', desc: 'Tailored solutions for your needs' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Veriqo</span>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View All Plans
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-6">
            <Building2 className="w-4 h-4" />
            Enterprise Solutions
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Veriqo for Enterprise
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Custom solutions for large organizations. Get unlimited product insights, 
            dedicated support, and advanced analytics for your entire team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Enterprise Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {enterpriseFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-slate-800/50 border border-white/5 rounded-xl"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Trusted By */}
            <div className="mt-8 p-6 bg-slate-800/30 border border-white/5 rounded-xl">
              <p className="text-slate-400 text-sm mb-4">Trusted by teams at</p>
              <div className="flex flex-wrap gap-6 items-center opacity-60">
                <span className="text-xl font-bold text-slate-300">Amazon Sellers</span>
                <span className="text-xl font-bold text-slate-300">D2C Brands</span>
                <span className="text-xl font-bold text-slate-300">Agencies</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Contact Sales</h2>
              <p className="text-slate-400 mb-6">Fill out the form and our team will get back to you within 24 hours.</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-slate-400 mb-6">
                    We've received your inquiry. Our enterprise team will contact you within 24 hours.
                  </p>
                  <p className="text-slate-500 text-sm">
                    In the meantime, feel free to email us directly at:<br />
                    <a href="mailto:support@veriqo.com" className="text-purple-400 hover:underline">
                      support@veriqo.com
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Size
                    </label>
                    <select
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="">Select...</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      How can we help?
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Contact Sales
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Direct Contact */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-slate-400 text-sm text-center mb-4">Or reach us directly:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:support@veriqo.com"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@veriqo.com
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Clock className="w-4 h-4" />
              Average response time: &lt; 24 hours
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 Veriqo. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
