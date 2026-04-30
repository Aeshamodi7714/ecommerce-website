import { useState } from 'react';
import { ChevronDown, ChevronUp, ShoppingCart, Truck, RotateCcw, Shield, CreditCard, Package, Star, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Orders & Shipping',
    icon: Truck,
    color: 'text-blue-600 bg-blue-50',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available for an additional fee. Metro cities like Mumbai, Delhi, and Bangalore get same-day delivery on orders placed before 12 PM.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on all orders above ₹5000. Orders below this amount have a flat shipping fee of ₹149.' },
      { q: 'Can I track my order?', a: 'Absolutely! Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from the "My Orders" section in your account.' },
      { q: 'Do you ship internationally?', a: 'Currently, we only ship within India. We are working on expanding to international markets soon.' },
    ]
  },
  {
    category: 'Returns & Refunds',
    icon: RotateCcw,
    color: 'text-green-600 bg-green-50',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. If you are not 100% satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Products must be in original condition with all accessories.' },
      { q: 'How do I initiate a return?', a: 'Visit "My Orders" in your account, select the order, and click "Return Item". Our team will arrange a free pickup within 2 business days and process your refund within 5–7 business days after inspection.' },
      { q: 'Are there any items that cannot be returned?', a: 'Sealed software, earbuds (for hygiene reasons if seal is broken), and customized products cannot be returned unless they are defective.' },
    ]
  },
  {
    category: 'Products & Authenticity',
    icon: Shield,
    color: 'text-purple-600 bg-purple-50',
    items: [
      { q: 'Are all products 100% genuine?', a: 'Absolutely! ElectroHub is an authorized reseller for all brands listed on our platform. Every product comes with an official manufacturer warranty and is sourced directly from brand distributors.' },
      { q: 'Do products come with manufacturer warranty?', a: 'Yes, all products come with their standard manufacturer warranty. Additionally, we offer extended warranty plans at a discounted price during checkout.' },
      { q: 'How do I verify my product is genuine?', a: 'All our products come with an official invoice, hologram seal, and manufacturer warranty card. You can also verify authenticity using the brand\'s official verification tool.' },
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    color: 'text-orange-600 bg-orange-50',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major Credit/Debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), EMI options (No-cost EMI on select products), and Cash on Delivery for orders below ₹20,000.' },
      { q: 'Is it safe to pay on ElectroHub?', a: 'Yes, 100%! We use industry-standard SSL encryption and are PCI-DSS compliant. Your payment information is never stored on our servers.' },
      { q: 'Do you offer No-Cost EMI?', a: 'Yes! No-Cost EMI is available on select products for 3, 6, and 12-month tenures with major bank cards. You can see EMI options on the product page.' },
    ]
  },
  {
    category: 'Account & Orders',
    icon: Package,
    color: 'text-pink-600 bg-pink-50',
    items: [
      { q: 'How do I create an account?', a: 'Click on "Register" in the top navigation, enter your name, email, and create a password. Verify your email, and you\'re ready to shop!' },
      { q: 'Can I order without creating an account?', a: 'Currently, you need an account to place orders so we can track your order history and provide better support. Registration is quick and free!' },
      { q: 'I forgot my password. What do I do?', a: 'Click on "Login" → "Forgot Password". Enter your registered email address and you\'ll receive a password reset link within 5 minutes.' },
    ]
  },
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = activeCategory !== null
    ? [faqData[activeCategory]]
    : faqData;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="h-16 w-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-300 text-xl">Find answers to the most common questions about shopping with ElectroHub.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeCategory === null ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200'}`}
          >
            All Topics
          </button>
          {faqData.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeCategory === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200'}`}
            >
              <cat.icon className="h-4 w-4" /> {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredFaqs.map((cat, catIdx) => {
            const realIdx = activeCategory !== null ? activeCategory : catIdx;
            return (
              <div key={catIdx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-slate-100">
                  <div className={`h-12 w-12 rounded-2xl ${cat.color} flex items-center justify-center flex-shrink-0`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">{cat.category}</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${realIdx}-${itemIdx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={itemIdx}>
                        <button
                          onClick={() => toggle(realIdx, itemIdx)}
                          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors group"
                        >
                          <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors pr-4">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 bg-slate-50">
                            <p className="text-slate-600 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center shadow-xl shadow-blue-500/20">
          <Star className="h-12 w-12 text-yellow-300 fill-current mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-white mb-2">Still have questions?</h3>
          <p className="text-blue-200 mb-6">Our support team is available 24/7 to help you.</p>
          <Link to="/contact" className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-xl transition-all">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
