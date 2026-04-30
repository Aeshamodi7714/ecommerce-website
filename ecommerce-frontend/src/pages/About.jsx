import { Shield, Zap, Users, Award, Target, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Rajesh Mehta', role: 'Founder & CEO', avatar: 'RM', color: 'from-blue-500 to-indigo-600' },
  { name: 'Priya Sharma', role: 'Head of Product', avatar: 'PS', color: 'from-purple-500 to-pink-600' },
  { name: 'Arjun Patel', role: 'Lead Engineer', avatar: 'AP', color: 'from-orange-500 to-red-500' },
  { name: 'Sneha Kapoor', role: 'Customer Success', avatar: 'SK', color: 'from-green-500 to-teal-600' },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '5000+', label: 'Products Available' },
  { value: '99.8%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Customer Support' },
];

const values = [
  { icon: Shield, title: 'Trust & Authenticity', desc: 'Every product is 100% genuine and sourced directly from official brand distributors and authorized dealers.', color: 'bg-blue-50 text-blue-600' },
  { icon: Zap, title: 'Lightning Fast Delivery', desc: 'We partner with premium logistics providers to ensure your orders reach you in the fastest possible time.', color: 'bg-yellow-50 text-yellow-600' },
  { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our top priority. We go above and beyond to ensure an exceptional shopping experience.', color: 'bg-red-50 text-red-500' },
  { icon: Award, title: 'Premium Quality', desc: 'We curate only the finest electronics, ensuring every product meets our strict quality standards.', color: 'bg-purple-50 text-purple-600' },
  { icon: Users, title: 'Community Driven', desc: 'Built by tech enthusiasts, for tech enthusiasts. Our team deeply understands what you need.', color: 'bg-green-50 text-green-600' },
  { icon: Target, title: 'Best Value', desc: 'We negotiate directly with brands to offer you the most competitive prices in the market.', color: 'bg-orange-50 text-orange-600' },
];

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-400 text-xs font-black uppercase tracking-widest rounded-full mb-6 border border-blue-500/20">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            We're on a Mission to Make <span className="text-blue-400">Premium Tech</span> Accessible
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
            ElectroHub was founded in 2020 with a simple belief: everyone deserves access to the world's best technology without compromise.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center">
              <p className="text-4xl font-black text-blue-600 mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4 block">Who We Are</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Your Trusted Tech Partner Since 2020</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>ElectroHub started as a small online store with a handpicked collection of premium electronics. Today, we're one of India's most trusted platforms for buying authentic tech products.</p>
              <p>We believe that great technology should be accessible to everyone. That's why we work directly with brands to offer the best prices, and partner with expert logistics to ensure lightning-fast delivery.</p>
              <p>From the latest smartphones to professional-grade laptops and everything in between, we've got you covered with a curated selection that's always up-to-date with the latest releases.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
              Explore Products <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80" alt="Team working" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 rounded-2xl p-6 shadow-2xl text-white">
              <p className="text-3xl font-black">5★</p>
              <p className="text-blue-200 text-sm font-semibold">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 block">Why Choose Us</span>
            <h2 className="text-4xl font-extrabold text-slate-900">Built on Values That Matter</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`h-14 w-14 ${v.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 block">The People</span>
          <h2 className="text-4xl font-extrabold text-slate-900">Meet Our Team</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Passionate about technology and dedicated to giving you the best experience.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div key={i} className="text-center group">
              <div className={`h-24 w-24 rounded-3xl bg-gradient-to-br ${member.color} text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {member.avatar}
              </div>
              <h4 className="font-extrabold text-slate-900">{member.name}</h4>
              <p className="text-sm text-slate-400 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Shop the Best Tech?</h2>
          <p className="text-blue-100 text-lg mb-8">Join over 50,000 happy customers who trust ElectroHub for their electronics needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-xl transition-all">Browse Products</Link>
            <Link to="/contact" className="px-8 py-4 bg-blue-500/40 text-white font-bold rounded-2xl border border-white/30 hover:bg-blue-500/60 transition-all">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
