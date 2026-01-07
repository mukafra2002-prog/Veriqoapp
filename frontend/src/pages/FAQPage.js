import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, HelpCircle, ChevronDown, ChevronUp, Search, ShoppingBag, CreditCard, Shield, Settings, Sparkles } from 'lucide-react';

const faqCategories = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    color: 'text-blue-400',
    questions: [
      {
        q: 'What is Veriqo?',
        a: 'Veriqo is an AI-powered product insight platform that helps you understand Amazon products before you buy. We summarize thousands of customer reviews into easy-to-read insights, highlighting key feedback patterns and helping you determine if a product is right for you.'
      },
      {
        q: 'How does Veriqo work?',
        a: 'Simply paste an Amazon product URL into Veriqo. Our AI analyzes publicly available customer feedback and generates a summary with key insights, including a "Great Match," "Good Match," or "Consider Options" assessment, things to know, and who the product is best suited for.'
      },
      {
        q: 'Is Veriqo affiliated with Amazon?',
        a: 'No. Veriqo is an independent platform and is not affiliated with Amazon or any brand. We provide neutral, unbiased insights based solely on aggregated customer feedback.'
      },
      {
        q: 'What does "Great Match," "Good Match," and "Consider Options" mean?',
        a: '"Great Match" means the product has predominantly positive feedback patterns and is likely to meet expectations. "Good Match" indicates mixed feedback - worth considering but review the details. "Consider Options" suggests reviewing the feedback patterns carefully before purchasing.'
      }
    ]
  },
  {
    id: 'using',
    name: 'Using Veriqo',
    icon: ShoppingBag,
    color: 'text-emerald-400',
    questions: [
      {
        q: 'How many products can I analyze for free?',
        a: 'Free accounts can analyze up to 3 products per month. Premium subscribers get unlimited analyses.'
      },
      {
        q: 'Can I save my analysis history?',
        a: 'Yes! All your product analyses are saved to your account automatically. You can access them anytime from the History page. Premium users can also export their history as a CSV file.'
      },
      {
        q: 'What is the Wishlist feature?',
        a: 'The Wishlist lets you save products you\'re interested in for later. You can add any analyzed product to your wishlist and access it anytime to compare options or make a decision when you\'re ready.'
      },
      {
        q: 'Can I compare multiple products?',
        a: 'Yes! Our Compare feature lets you analyze 2-3 products side by side. Just paste the Amazon URLs and get a detailed comparison of all products.'
      },
      {
        q: 'Which Amazon sites are supported?',
        a: 'Currently, Veriqo supports Amazon.com (US). We\'re working on adding support for other Amazon marketplaces in the future.'
      }
    ]
  },
  {
    id: 'billing',
    name: 'Billing & Subscriptions',
    icon: CreditCard,
    color: 'text-purple-400',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards through Stripe, including Visa, Mastercard, American Express, and Discover.'
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can cancel your subscription at any time from your Account settings. You\'ll continue to have access to Premium features until the end of your billing period.'
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer a 7-day refund policy for first-time subscribers. If you\'re not satisfied, contact support@veriqo.com within 7 days of your first payment for a full refund.'
      },
      {
        q: 'What happens when my free checks run out?',
        a: 'When you\'ve used your 3 free monthly checks, you can either wait until next month for your checks to reset, or upgrade to Premium for unlimited analyses.'
      }
    ]
  },
  {
    id: 'trust',
    name: 'Trust & Safety',
    icon: Shield,
    color: 'text-amber-400',
    questions: [
      {
        q: 'Are the insights accurate?',
        a: 'Our AI summarizes patterns from publicly available customer feedback. While we strive for accuracy, insights are informational only and should be used alongside your own research. We don\'t verify individual reviews or make guarantees about product quality.'
      },
      {
        q: 'Do you verify if reviews are fake?',
        a: 'No. Veriqo does not verify the authenticity of individual reviews, score seller authenticity, or make claims about fraud. We summarize publicly available feedback patterns to help you understand products better.'
      },
      {
        q: 'Is my data safe?',
        a: 'Yes. We take data security seriously. We use encryption, secure authentication, and don\'t share your personal information with third parties. See our Privacy Policy for full details.'
      },
      {
        q: 'Why do you use affiliate links?',
        a: 'As an Amazon Associate, we earn from qualifying purchases when you click our "View on Amazon" buttons. This helps support our service at no additional cost to you. We clearly disclose this on all pages.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Settings',
    icon: Settings,
    color: 'text-pink-400',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Get Started" on our homepage. You can sign up with your email address or use Google Sign-In for a faster experience.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset code to create a new password.'
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Contact support@veriqo.com to request account deletion. We\'ll remove your account and associated data within 30 days.'
      },
      {
        q: 'How do I change my email address?',
        a: 'Currently, email changes require contacting support. Send a request to support@veriqo.com from your registered email address.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('general');

  const toggleItem = (categoryId, questionIdx) => {
    const key = `${categoryId}-${questionIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about Veriqo.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8">
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {(searchQuery ? filteredCategories : faqCategories.filter(c => c.id === activeCategory)).map(category => (
            <div key={category.id}>
              {searchQuery && (
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${category.color}`}>
                  <category.icon className="w-5 h-5" />
                  {category.name}
                </h2>
              )}
              <div className="space-y-3">
                {category.questions.map((item, idx) => {
                  const key = `${category.id}-${idx}`;
                  const isOpen = openItems[key];
                  
                  return (
                    <div 
                      key={idx}
                      className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(category.id, idx)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                      >
                        <span className="font-medium text-white pr-4">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-slate-400 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-slate-400 mb-6">Try different keywords or browse categories above.</p>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <HelpCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
          <p className="text-slate-400 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-colors"
          >
            Contact Support
          </Link>
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
