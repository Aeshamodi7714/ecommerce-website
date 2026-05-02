import { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, Wand2, MessageSquare, Search, 
  RefreshCw, CheckCircle2, AlertCircle, Copy, Send,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';

const AITools = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTool, setActiveTool] = useState('generator');
  
  // Generator State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sentiment State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);

  const fetchData = async () => {
    try {
      const [prodRes, revRes] = await Promise.all([
        axiosInstance.get('/product/all'),
        axiosInstance.get('/admin/all/reviews')
      ]);
      setProducts(prodRes.data.products || []);
      setReviews(revRes.data.reviews || []);
    } catch (error) {
      toast.error('Failed to load AI source data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedProduct) return toast.error('Please select a product');
    setIsGenerating(true);
    
    // Simulate AI Generation
    setTimeout(() => {
      const product = products.find(p => p._id === selectedProduct);
      const texts = {
        professional: `Experience the future with ${product.name}. Engineered for performance and designed with elegance, this ${product.category} category leader offers unparalleled reliability. Perfect for modern professionals seeking the best in class.`,
        creative: `Unlock your imagination with the all-new ${product.name}! ✨ From its stunning design to lightning-fast performance, it's not just a ${product.category}, it's a lifestyle upgrade. Ready to stand out?`,
        minimal: `${product.name}. Pure performance. Sleek design. The essential ${product.category} for your daily life.`
      };
      setGeneratedText(texts[tone]);
      setIsGenerating(false);
      toast.success('Description generated!');
    }, 2000);
  };

  const analyzeSentiment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const positive = reviews.filter(r => r.rating >= 4).length;
      const neutral = reviews.filter(r => r.rating === 3).length;
      const negative = reviews.filter(r => r.rating <= 2).length;
      
      setSentimentResult({
        positive: (positive / reviews.length * 100).toFixed(1),
        neutral: (neutral / reviews.length * 100).toFixed(1),
        negative: (negative / reviews.length * 100).toFixed(1),
        total: reviews.length
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            AI Matrix Hub <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
          </h1>
          <p className="text-slate-500 font-medium">Neural-powered tools for content and sentiment analysis.</p>
        </div>
      </div>

      {/* Tool Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setActiveTool('generator')}
          className={`p-10 rounded-[3.5rem] border-2 transition-all text-left relative overflow-hidden group ${activeTool === 'generator' ? 'border-blue-600 bg-blue-50/30 shadow-xl shadow-blue-500/10' : 'border-slate-50 bg-white hover:border-slate-200'}`}
        >
          <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${activeTool === 'generator' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
             <Wand2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Content Generator</h3>
          <p className="text-slate-500 font-medium text-sm">Create SEO-optimized product descriptions instantly.</p>
        </button>

        <button 
          onClick={() => setActiveTool('sentiment')}
          className={`p-10 rounded-[3.5rem] border-2 transition-all text-left relative overflow-hidden group ${activeTool === 'sentiment' ? 'border-indigo-600 bg-indigo-50/30 shadow-xl shadow-indigo-500/10' : 'border-slate-50 bg-white hover:border-slate-200'}`}
        >
          <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${activeTool === 'sentiment' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
             <Brain className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Sentiment Engine</h3>
          <p className="text-slate-500 font-medium text-sm">Analyze overall customer satisfaction from real reviews.</p>
        </button>
      </div>

      {activeTool === 'generator' ? (
        <div className="bg-white p-12 rounded-[4rem] border-2 border-slate-50 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Select Target Product</label>
                 <select 
                   className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                   value={selectedProduct}
                   onChange={(e) => setSelectedProduct(e.target.value)}
                 >
                    <option value="">Select a product...</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description Tone</label>
                 <div className="flex flex-wrap gap-3">
                    {['professional', 'creative', 'minimal'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setTone(t)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${tone === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                      >
                         {t}
                      </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                 {isGenerating ? <><RefreshCw className="h-5 w-5 animate-spin" /> Neural Processing...</> : <><Sparkles className="h-5 w-5" /> Generate Description</>}
              </button>
           </div>

           <div className="relative h-full min-h-[300px]">
              <div className="absolute inset-0 bg-slate-900 rounded-[3rem] p-10 text-white font-mono text-sm leading-relaxed overflow-hidden">
                 <div className="flex items-center gap-2 mb-6 text-slate-500">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="ml-4 text-[10px] font-black uppercase tracking-widest opacity-50">Output Console</span>
                 </div>
                 {generatedText ? (
                   <div className="animate-fade-in">
                      <p className="mb-8">{generatedText}</p>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(generatedText); toast.success('Copied!'); }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                         <Copy className="h-4 w-4" /> Copy to Clipboard
                      </button>
                   </div>
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-20 flex-col gap-4">
                      <Terminal className="h-12 w-12" />
                      <p className="font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Instructions</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[4rem] border-2 border-slate-50 shadow-sm space-y-12">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center">
                    <Brain className="h-10 w-10" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Review Sentiment Analysis</h3>
                    <p className="text-slate-500 font-medium">Scanning {reviews.length} real customer reviews.</p>
                 </div>
              </div>
              <button 
                onClick={analyzeSentiment}
                disabled={isAnalyzing || reviews.length === 0}
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-3"
              >
                 {isAnalyzing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                 Start Deep Scan
              </button>
           </div>

           {sentimentResult ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                 {[
                   { label: 'Positive', value: sentimentResult.positive, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                   { label: 'Neutral', value: sentimentResult.neutral, icon: Minus, color: 'text-amber-500', bg: 'bg-amber-50' },
                   { label: 'Negative', value: sentimentResult.negative, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' }
                 ].map(s => (
                   <div key={s.label} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex flex-col items-center gap-6">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${s.bg} ${s.color}`}>
                         <s.icon className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                         <p className="text-4xl font-black text-slate-900">{s.value}%</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label} Feedback</p>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                         <div className={`h-full ${s.bg.replace('50', '500')}`} style={{ width: `${s.value}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           ) : (
              <div className="h-[400px] border-4 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center gap-6 text-slate-200">
                 <RefreshCw className="h-16 w-16 animate-spin-slow opacity-50" />
                 <p className="font-black uppercase tracking-[0.4em] text-xs">Awaiting Neural Link</p>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

const Terminal = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

export default AITools;
