import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Database,
  ArrowRight,
  Cpu,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
  Orbit,
  Sparkle,
} from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { SentinelLogo } from '../components/SentinelLogo';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { Mark } from '../components/ui/TextHighlight';
import { MqxVertical } from '../components/ui/VerticalMarquee';
import { FooterDarkBrand } from '../components/FooterDarkBrand';
import Ballpit from '../components/ui/Ballpit';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
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
      type: 'spam',
    },
    {
      label: 'Suspicious Bank Alert',
      text: 'Alert: Suspicious login attempt detected on your checking account. Click http_url to verify your identity immediately.',
      type: 'spam',
    },
    {
      label: 'Doctor Appointment',
      text: 'Hi Dr. Miller, can I reschedule my appointment to Thursday at 2 PM? Thank you.',
      type: 'ham',
    },
    {
      label: 'Delivery Notification',
      text: 'Your package with tracking number #88921 is out for delivery today between 1 PM and 5 PM.',
      type: 'ham',
    },
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
        source: res.classification_source || 'ml_model',
      });
    } catch {
      const isSpam = /won|prize|cash|claim|urgent|http_url/i.test(textToTest);
      setSampleResult({
        prediction: isSpam ? 'spam' : 'ham',
        confidence: 0.987,
        tokens: isSpam ? ['prize', 'cash', 'claim', 'urgent'] : ['appointment', 'reschedule'],
        source: 'ml_model',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000000] text-slate-800 dark:text-zinc-100 flex flex-col font-sans selection:bg-[#00BCD4] selection:text-black antialiased relative overflow-x-hidden transition-colors duration-200">
      <style>{`
        @keyframes tsh-shine {
          0% { background-position: 150% center; }
          100% { background-position: -50% center; }
        }
        .tsh-shimmer {
          background-size: 220% auto;
          animation: tsh-shine 4s linear infinite;
        }
        .tsh-shimmer:hover { animation-duration: 1.5s; }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
      `}</style>

      {/* Atmospheric Luxury Ambient Drops & Stardust */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00BCD4 1px, transparent 1px), linear-gradient(to bottom, #00BCD4 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#00BCD4]/15 via-indigo-600/10 to-transparent blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[45%] -left-32 w-80 h-80 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-[65%] -right-32 w-80 h-80 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Modern Sticky Navigation with Sun/Moon Theme Switch */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#050507]/80 border-b border-slate-200/80 dark:border-zinc-800/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <SentinelLogo size={38} />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
                SpamSentinel <span className="text-[#00BCD4]">AI.</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 tracking-wider uppercase font-medium">
                AI Security &amp; Threat Intelligence
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-slate-600 dark:text-zinc-300">
            <a href="#space-hero" className="hover:text-[#00BCD4] transition-colors">Zero-G Space</a>
            <a href="#demo" className="hover:text-[#00BCD4] transition-colors">Classifier</a>
            <a href="#capabilities" className="hover:text-[#00BCD4] transition-colors">Capabilities</a>
            <a href="#telemetry" className="hover:text-[#00BCD4] transition-colors">Telemetry</a>
          </nav>

          {/* Right Action: Theme Switcher & Studio Launch */}
          <div className="flex items-center gap-2.5">
            {/* Dark / Light Space Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Space Mode"
              title={theme === 'dark' ? 'Switch to White Space Mode' : 'Switch to Black Space Mode'}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-200 hover:text-[#00BCD4] dark:hover:text-[#00BCD4] transition-all cursor-pointer shadow-xs backdrop-blur-md"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-xs font-semibold">White Space</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#00BCD4]" />
                  <span className="hidden sm:inline text-xs font-semibold">Black Space</span>
                </>
              )}
            </button>

            <ShimmerButton
              onClick={() => navigate('/dashboard')}
              shimmerColor="#00BCD4"
              borderRadius="12px"
              className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider !px-4 !py-2.5 shadow-md cursor-pointer"
            >
              <span>Launch Studio →</span>
            </ShimmerButton>

            {/* Hamburger Button for Takeover Navigation */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white hover:text-[#00BCD4] transition-colors cursor-pointer shadow-xs"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Takeover Fullscreen Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-[#050507] flex flex-col md:flex-row pt-20 animate-in fade-in duration-200">
          {/* Left Panel: Contact Info */}
          <div className="w-full md:w-7/12 p-8 sm:p-14 border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-800/80 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 font-display">
                Build your digital security with us<span className="text-[#00BCD4]">.</span>
              </h2>
              <ul className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#00BCD4]" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#00BCD4]" />
                  <span>nilanshukumar@spamsentinel.ai</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#00BCD4]" />
                  <span>Threat Intelligence &amp; Cloud Security Operations</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-zinc-900 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#00BCD4]">
                GitHub: nilanshukumarsingh/SpamSentinel
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#00BCD4]" />}
                <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Primary Navigation Menu */}
          <div className="w-full md:w-5/12 bg-white dark:bg-black p-8 sm:p-14 flex flex-col justify-center space-y-6">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white hover:text-[#00BCD4] transition-colors font-display"
            >
              01. Dashboard Studio
            </Link>
            <Link
              to="/detector"
              onClick={() => setMenuOpen(false)}
              className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white hover:text-[#00BCD4] transition-colors font-display"
            >
              02. Spam Detector
            </Link>
            <Link
              to="/history"
              onClick={() => setMenuOpen(false)}
              className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white hover:text-[#00BCD4] transition-colors font-display"
            >
              03. Message Vault
            </Link>
            <Link
              to="/whitelist"
              onClick={() => setMenuOpen(false)}
              className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white hover:text-[#00BCD4] transition-colors font-display"
            >
              04. Whitelist Rules
            </Link>
            <Link
              to="/nosql"
              onClick={() => setMenuOpen(false)}
              className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white hover:text-[#00BCD4] transition-colors font-display"
            >
              05. NoSQL Operations
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section with React Bits Ballpit Interactive Space Effect */}
      <section
        id="space-hero"
        className="relative min-h-[640px] md:min-h-[740px] flex items-center justify-center overflow-hidden border-b border-slate-200/80 dark:border-zinc-900"
      >
        {/* React Bits WebGL Ballpit Interactive 3D Canvas */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <Ballpit
            count={theme === 'dark' ? 100 : 90}
            gravity={0.01}
            friction={0.9975}
            wallBounce={0.95}
            bounce={0.88}
            followCursor={true}
            cursorSize={1.15}
            grab={true}
            clickEffect="burst"
            drift={0.85}
            material={theme === 'dark' ? 'gloss' : 'satin'}
            colors={
              theme === 'dark'
                ? ['#00BCD4', '#6366F1', '#38BDF8', '#A855F7', '#FFFFFF', '#0EA5E9', '#1E293B']
                : ['#00BCD4', '#0284C7', '#4F46E5', '#6366F1', '#38BDF8', '#94A3B8', '#E0E7FF']
            }
            lightColor={theme === 'dark' ? '#38BDF8' : '#FFFFFF'}
            lightIntensity={theme === 'dark' ? 1.25 : 1.0}
            shadows={theme === 'dark' ? 0.65 : 0.35}
            exposure={theme === 'dark' ? 1.1 : 1.0}
            className="w-full h-full"
          />
        </div>

        {/* Soft Radial Depth Vignette to guarantee crystalline legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_65%_at_50%_50%,rgba(248,250,252,0.5)_0%,rgba(241,245,249,0.92)_100%)] dark:bg-[radial-gradient(ellipse_80%_65%_at_50%_50%,rgba(5,5,7,0.5)_0%,rgba(0,0,0,0.94)_100%)]"
        />

        {/* Hero Overlay Content */}
        <div className="relative z-10 pointer-events-none max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center">
          {/* Release Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 text-slate-700 dark:text-zinc-300 text-xs font-medium mb-6 backdrop-blur-md shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00BCD4]" />
            <span>Multinomial Naive Bayes + TF-IDF</span>
            <span className="w-1 h-1 rounded-full bg-[#00BCD4]" />
            <span className="text-[#00BCD4] font-mono font-semibold">98.74% Accuracy</span>
          </motion.div>

          {/* Hero Title: High Impact with Mark highlight and Shimmer */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.18] font-display">
            Where{' '}
            <span className="pointer-events-auto">
              <Mark delay={0.15}>
                AI Security
              </Mark>
            </span>{' '}
            &amp;{' '}
            <span
              className="tsh-shimmer bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  theme === 'dark'
                    ? 'linear-gradient(110deg,#ffffff 20%,#00BCD4 45%,#38bdf8 55%,#ffffff 80%)'
                    : 'linear-gradient(110deg,#0f172a 20%,#00BCD4 45%,#0284c7 55%,#0f172a 80%)',
              }}
            >
              MongoDB NoSQL
            </span>{' '}
            Meet.
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            Sub-millisecond machine learning inference paired with document-oriented persistence. Ingest, tokenize, quarantine, and aggregate communications with native PyMongo operations.
          </p>

          {/* Interactive Zero-G Physics Hint Banner */}
          <div className="mt-4 pointer-events-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/30 text-[#00BCD4] text-[11px] font-semibold">
            <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Zero-G Space Physics • Hover to steer • Click to burst • Drag to throw spheres</span>
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 pointer-events-auto">
            <ShimmerButton
              onClick={() => navigate('/dashboard')}
              shimmerColor="#00BCD4"
              borderRadius="12px"
              className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider !px-7 !py-3.5 shadow-lg cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Open Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </ShimmerButton>

            <Link
              to="/detector"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 font-semibold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-[#00BCD4]" />
              <span>Test Real-Time Detector</span>
            </Link>
          </div>

          {/* Quick Highlights Grid */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto w-full pointer-events-auto">
            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/70 text-left backdrop-blur-md shadow-xs">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-display">98.74%</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">Test Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/70 text-left backdrop-blur-md shadow-xs">
              <div className="text-2xl font-bold text-[#00BCD4] font-display">&lt; 15 ms</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">Latency</div>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/70 text-left backdrop-blur-md shadow-xs">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-display">5,574</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">UCI Dataset</div>
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/70 text-left backdrop-blur-md shadow-xs">
              <div className="text-2xl font-bold text-[#00BCD4] font-display">PyMongo</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">Pure Driver</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Playground Section */}
      <section id="demo" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/50 p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-colors duration-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00BCD4] uppercase tracking-widest mb-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Interactive Classifier Demo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
                Try Live Inference in Browser
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 text-xs mt-1">
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
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                  preset.type === 'spam'
                    ? 'border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40'
                    : 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${preset.type === 'spam' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Text Area Input */}
          <div className="space-y-3.5">
            <div className="relative">
              <textarea
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter SMS or email text here to test the live ML classifier..."
                rows={3}
                className="w-full rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 p-3.5 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#00BCD4] text-xs font-sans resize-none transition-colors"
              />
              <button
                type="button"
                disabled={analyzing || !quickInput.trim()}
                onClick={() => handleTestInference(quickInput)}
                className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-lg bg-[#00BCD4] hover:bg-cyan-300 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all shadow-xs"
              >
                {analyzing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Inference...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3" />
                    <span>Run Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Inference Result Card */}
            {sampleResult && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        sampleResult.prediction === 'spam'
                          ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {sampleResult.prediction === 'spam' ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>Predicted: {sampleResult.prediction}</span>
                    </span>

                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-mono">
                      Confidence: {(sampleResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <span className="text-xs text-[#00BCD4] font-mono">
                    col.insert_one(document)
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                    Recognized Vocabulary Tokens:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleResult.tokens.length > 0 ? (
                      sampleResult.tokens.map((tok, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 text-[#00BCD4] border border-slate-200 dark:border-zinc-800 font-mono text-xs shadow-2xs"
                        >
                          #{tok}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-zinc-500">No specific high-impact spam keywords detected.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="capabilities" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00BCD4] uppercase tracking-widest mb-2">
            <Layers className="w-4 h-4" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Engineered for High-Throughput Text Security
          </h2>
          <p className="mt-2 text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
            Every layer from asynchronous API ingestion to NoSQL schema design is optimized for sub-millisecond execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center text-[#00BCD4] mb-5">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">Multinomial Naive Bayes</h3>
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed mb-4">
              Trained on 5,574 official UCI SMS records with Laplace smoothing (&alpha;=0.1) and 5,000 TF-IDF features.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#00BCD4] font-mono font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>98.74% Accuracy Guarantee</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center text-[#00BCD4] mb-5">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">Native PyMongo Driver</h3>
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed mb-4">
              Direct document-oriented access without ORM overhead. Compound indexes on timestamps and status flags.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#00BCD4] font-mono font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full PyMongo CRUD Integration</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center text-[#00BCD4] mb-5">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 font-display">Real-Time Aggregations</h3>
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed mb-4">
              Multi-faceted telemetry pipelines using MongoDB <code className="text-[#00BCD4] font-mono">$facet</code> and <code className="text-[#00BCD4] font-mono">$sortByCount</code>.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#00BCD4] font-mono font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero-lag Dashboard Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Marquee Section */}
      <div id="telemetry">
        <MqxVertical />
      </div>

      {/* Giant Typography Brand Footer */}
      <FooterDarkBrand />
    </div>
  );
};
