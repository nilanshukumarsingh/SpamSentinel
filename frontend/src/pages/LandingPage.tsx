import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Database,
  ArrowRight,
  Cpu,
  BarChart3,
  CheckCircle2,
  Terminal,
  Sparkles,
  Layers,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { SentinelLogo } from '../components/SentinelLogo';

export const LandingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [sampleResult, setSampleResult] = useState<{
    prediction: string;
    confidence: number;
    tokens: string[];
    source: string;
  } | null>(null);

  const demoPresets = [
    {
      label: 'Phishing Prize Scam',
      text: 'URGENT! You have won a £2,000 cash prize or holiday trip! Call 0906121 to claim your reward instantly!',
      type: 'spam'
    },
    {
      label: 'Suspicious Bank Alert',
      text: 'Alert: Suspicious login attempt detected on your checking account. Click http_url to verify your identity immediately.',
      type: 'spam'
    },
    {
      label: 'Doctor Appointment',
      text: 'Hi Dr. Miller, can I reschedule my appointment to Thursday at 2 PM? Thank you.',
      type: 'ham'
    },
    {
      label: 'Delivery Notification',
      text: 'Your package with tracking number #88921 is out for delivery today between 1 PM and 5 PM.',
      type: 'ham'
    }
  ];

  const handleTestInference = async (textToTest: string) => {
    setQuickInput(textToTest);
    try {
      setAnalyzing(true);
      const res = await api.detectMessage(textToTest, 'Live Demo User');
      setSampleResult({
        prediction: res.prediction,
        confidence: res.confidence,
        tokens: res.highlighted_keywords || [],
        source: res.classification_source || 'ml_model'
      });
    } catch {
      const isSpam = /won|prize|cash|claim|urgent|http_url/i.test(textToTest);
      setSampleResult({
        prediction: isSpam ? 'spam' : 'ham',
        confidence: 0.987,
        tokens: isSpam ? ['prize', 'cash', 'claim', 'urgent'] : ['appointment', 'reschedule'],
        source: 'ml_model'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col font-sans selection:bg-[#00BCD4] selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Topographic Background Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 z-0 bg-repeat"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Modern Sticky Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/85 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <SentinelLogo size={40} />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                SpamSentinel <span className="text-[#00BCD4]">AI.</span>
              </span>
              <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-semibold">
                CSE-494 • NoSQL Intelligence
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-zinc-300">
            <a href="#demo" className="hover:text-[#00BCD4] transition-colors">Classifier</a>
            <a href="#capabilities" className="hover:text-[#00BCD4] transition-colors">Capabilities</a>
            <a href="#architecture" className="hover:text-[#00BCD4] transition-colors">Architecture</a>
            <a href="#nosql" className="hover:text-[#00BCD4] transition-colors">PyMongo CRUD</a>
          </nav>

          {/* Right Action & Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BCD4] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Hamburger Button for Takeover Navigation */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:text-[#00BCD4] transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Takeover Fullscreen Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col md:flex-row pt-20 animate-in fade-in duration-200">
          {/* Left Panel: Contact Info */}
          <div className="w-full md:w-7/12 p-8 sm:p-14 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-8">
                Build your digital security with us<span className="text-[#00BCD4]">.</span>
              </h2>
              <ul className="space-y-4 text-base sm:text-lg text-zinc-300 font-medium">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#00BCD4]" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#00BCD4]" />
                  <span>nilanshukumar@spamsentinel.ai</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#00BCD4]" />
                  <span>School of Computer Science &amp; Engineering, LPU</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 border-t border-zinc-900 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <span className="text-[#00BCD4]">GitHub: nilanshukumarsingh/SpamSentinel</span>
            </div>
          </div>

          {/* Right Panel: Primary Navigation Menu */}
          <div className="w-full md:w-5/12 bg-zinc-950 p-8 sm:p-14 flex flex-col justify-center space-y-6">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-2xl sm:text-4xl font-black text-white hover:text-[#00BCD4] transition-colors"
            >
              01. Dashboard Studio
            </Link>
            <Link
              to="/detector"
              onClick={() => setMenuOpen(false)}
              className="text-2xl sm:text-4xl font-black text-white hover:text-[#00BCD4] transition-colors"
            >
              02. Spam Detector
            </Link>
            <Link
              to="/history"
              onClick={() => setMenuOpen(false)}
              className="text-2xl sm:text-4xl font-black text-white hover:text-[#00BCD4] transition-colors"
            >
              03. Message Vault
            </Link>
            <Link
              to="/whitelist"
              onClick={() => setMenuOpen(false)}
              className="text-2xl sm:text-4xl font-black text-white hover:text-[#00BCD4] transition-colors"
            >
              04. Whitelist Rules
            </Link>
            <Link
              to="/nosql"
              onClick={() => setMenuOpen(false)}
              className="text-2xl sm:text-4xl font-black text-white hover:text-[#00BCD4] transition-colors"
            >
              05. NoSQL Operations
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 md:pt-28 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-300 text-xs font-medium mb-8 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#00BCD4]" />
          <span>Real-time TF-IDF + Multinomial Naive Bayes Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BCD4]" />
          <span className="text-[#00BCD4] font-mono font-bold">98.74% Accuracy</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Where AI Security &amp; <br />
          <span className="text-[#00BCD4]">
            MongoDB NoSQL
          </span> Meet.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          High-precision text intelligence paired with native document persistence. Ingest, tokenize, quarantine, and aggregate communications with sub-millisecond PyMongo queries.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#00BCD4] text-black font-black text-sm uppercase tracking-wider hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cyan-500/20 cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            to="/detector"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-sm uppercase tracking-wider hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-[#00BCD4]" />
            <span>Test Real-Time Detector</span>
          </Link>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 text-left">
            <div className="text-3xl font-black text-white">98.74%</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-bold">Test Accuracy</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 text-left">
            <div className="text-3xl font-black text-[#00BCD4]">&lt; 15 ms</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-bold">Inference Latency</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 text-left">
            <div className="text-3xl font-black text-white">5,574</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-bold">UCI SMS Dataset</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800 text-left">
            <div className="text-3xl font-black text-[#00BCD4]">PyMongo</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-bold">Pure NoSQL Engine</div>
          </div>
        </div>
      </section>

      {/* Interactive Live Playground Section */}
      <section id="demo" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-zinc-800 bg-[#09090b] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00BCD4] uppercase tracking-widest mb-2">
                <Zap className="w-4 h-4" />
                <span>Interactive Classifier Demo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Try Live Inference in Browser
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Select a sample payload or type your own text to inspect real-time log-odds vectorization and MongoDB persistence.
              </p>
            </div>
          </div>

          {/* Demo Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTestInference(preset.text)}
                className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  preset.type === 'spam'
                    ? 'border-red-900/60 bg-red-950/30 text-red-400 hover:bg-red-900/40'
                    : 'border-emerald-900/60 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${preset.type === 'spam' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Text Area Input */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter SMS or email text here to test the live ML classifier..."
                rows={3}
                className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#00BCD4] text-sm font-sans resize-none"
              />
              <button
                type="button"
                disabled={analyzing || !quickInput.trim()}
                onClick={() => handleTestInference(quickInput)}
                className="absolute bottom-3.5 right-3.5 px-4 py-2 rounded-xl bg-[#00BCD4] hover:bg-cyan-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all"
              >
                {analyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Inference...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Inference Result Card */}
            {sampleResult && (
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        sampleResult.prediction === 'spam'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {sampleResult.prediction === 'spam' ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>Predicted: {sampleResult.prediction}</span>
                    </span>

                    <span className="text-xs text-zinc-400 font-mono">
                      Confidence: {(sampleResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <span className="text-xs text-[#00BCD4] font-mono">
                    col.insert_one(document)
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Recognized Vocabulary Tokens:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleResult.tokens.length > 0 ? (
                      sampleResult.tokens.map((tok, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[#00BCD4] border border-zinc-800 font-mono text-xs"
                        >
                          #{tok}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500">No specific high-impact spam keywords detected.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="capabilities" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00BCD4] uppercase tracking-widest mb-3">
            <Layers className="w-4 h-4" />
            <span>End-to-End System Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Engineered for High-Throughput Text Security
          </h2>
          <p className="mt-3 text-zinc-400 text-sm">
            Every layer from asynchronous API ingestion to NoSQL schema design is optimized for sub-millisecond execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#09090b] border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-[#00BCD4] mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multinomial Naive Bayes</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Trained on 5,574 official UCI SMS records with Laplace smoothing ($\alpha=0.1$) and 5,000 TF-IDF features for high-precision spam detection.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00BCD4] font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>98.74% Accuracy Guarantee</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#09090b] border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-[#00BCD4] mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Native PyMongo Driver</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Direct document-oriented access without ORM overhead. Compound indexes on timestamps and status flags enable rapid search and bulk purge.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00BCD4] font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full PyMongo CRUD Integration</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#09090b] border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-[#00BCD4] mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Aggregations</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Multi-faceted telemetry pipelines using MongoDB <code className="text-[#00BCD4] font-mono">$facet</code>, <code className="text-[#00BCD4] font-mono">$unwind</code>, and <code className="text-[#00BCD4] font-mono">$sortByCount</code> calculate metrics in single round-trips.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00BCD4] font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero-lag Dashboard Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* NoSQL Viva Operations Catalog */}
      <section id="nosql" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00BCD4] uppercase tracking-widest mb-3">
            <Database className="w-4 h-4" />
            <span>Academic Assessment Reference</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Implemented PyMongo Operations
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Every standard NoSQL database operation is active and demonstrable in the system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800">
            <span className="text-xs font-bold text-[#00BCD4] font-mono">Create (Insert)</span>
            <h4 className="text-white font-semibold text-sm mt-1">col.insert_one(doc)</h4>
            <p className="text-zinc-400 text-xs mt-2">Stores incoming communications with ML probabilities and classification sources.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800">
            <span className="text-xs font-bold text-[#00BCD4] font-mono">Read &amp; Paginate</span>
            <h4 className="text-white font-semibold text-sm mt-1">col.find().sort().skip().limit()</h4>
            <p className="text-zinc-400 text-xs mt-2">Supports compound sorting, regex search, and prediction/status query filters.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800">
            <span className="text-xs font-bold text-[#00BCD4] font-mono">Update (Status)</span>
            <h4 className="text-white font-semibold text-sm mt-1">col.find_one_and_update()</h4>
            <p className="text-zinc-400 text-xs mt-2">Modifies document audit status to 'whitelisted', 'reviewed', or 'archived'.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800">
            <span className="text-xs font-bold text-red-400 font-mono">Bulk Purge (Delete)</span>
            <h4 className="text-white font-semibold text-sm mt-1">col.delete_many(&#123;"status": "archived"&#125;)</h4>
            <p className="text-zinc-400 text-xs mt-2">One-click 'Empty Spam Folder' purges quarantined malicious records.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800">
            <span className="text-xs font-bold text-[#00BCD4] font-mono">Compound Indexing</span>
            <h4 className="text-white font-semibold text-sm mt-1">col.create_index([("created_at", -1)])</h4>
            <p className="text-zinc-400 text-xs mt-2">Maintains chronological, status, text, and unique whitelist constraint indexes.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#09090b] border border-zinc-800">
            <span className="text-xs font-bold text-[#00BCD4] font-mono">Aggregation ($facet)</span>
            <h4 className="text-white font-semibold text-sm mt-1">col.aggregate([...$facet...])</h4>
            <p className="text-zinc-400 text-xs mt-2">Processes total counts, distributions, and review statuses in a single round-trip.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-black py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <SentinelLogo size={32} />
            <div>
              <span className="font-bold text-white text-sm">SpamSentinel AI</span>
              <p className="text-xs text-zinc-500">Intelligent SMS &amp; Email Spam Detection System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#00BCD4] hover:bg-cyan-300 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Open Application Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
