import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: Phone, title: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat, 9 AM–8 PM', color: 'bg-blue-50 text-blue-600' },
  { icon: Mail, title: 'Email Us', value: 'support@electrohub.in', sub: 'We reply within 2 hours', color: 'bg-indigo-50 text-indigo-600' },
  { icon: MapPin, title: 'Visit Us', value: 'ElectroHub HQ', sub: 'Bandra West, Mumbai 400050', color: 'bg-purple-50 text-purple-600' },
  { icon: Clock, title: 'Working Hours', value: 'Mon – Sat', sub: '9:00 AM to 8:00 PM IST', color: 'bg-orange-50 text-orange-600' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="h-16 w-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
          <p className="text-slate-300 text-xl">Have a question, feedback, or need support? We'd love to hear from you.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactInfo.map((info, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
              <div className={`h-14 w-14 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <info.icon className="h-7 w-7" />
              </div>
              <h3 className="font-extrabold text-slate-900 mb-1">{info.title}</h3>
              <p className="font-bold text-slate-700 text-sm">{info.value}</p>
              <p className="text-slate-400 text-xs mt-1">{info.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 max-w-sm">Thank you for reaching out. Our team will get back to you within 2 business hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Send Us a Message</h2>
                <p className="text-slate-400 mb-8">Fill out the form and our team will get back to you shortly.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Rahul Sharma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none"
                    >
                      <option value="">Select a topic...</option>
                      <option>Order Issue</option>
                      <option>Product Inquiry</option>
                      <option>Return & Refund</option>
                      <option>Technical Support</option>
                      <option>Warranty Claim</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <><div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Sending...</>
                    ) : (
                      <><Send className="h-5 w-5" /> Send Message</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Map + Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.318!2d72.8295!3d19.059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzMyLjAiTiA3MsKwNDknNDYuMiJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="ElectroHub Location"
              ></iframe>
              <div className="p-5">
                <h3 className="font-extrabold text-slate-900 mb-1">ElectroHub HQ</h3>
                <p className="text-slate-500 text-sm">Plot 42, Linking Road, Bandra West, Mumbai 400050, Maharashtra, India</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
              <h3 className="font-extrabold text-xl mb-2">24/7 Live Chat</h3>
              <p className="text-blue-200 text-sm mb-5">Need instant help? Chat with our support team right away.</p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" /> Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
