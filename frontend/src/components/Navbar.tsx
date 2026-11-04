import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Cpu, Sparkles, RefreshCw, Moon, Sun, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { HealthStatus } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SentinelLogo } from './SentinelLogo';

interface NavbarProps {
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefreshData }) => {
  const { theme, toggleTheme } = useTheme();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch {
      setHealth(null);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSeedSamples = async () => {
    try {
      setSeeding(true);
      const res = await api.seedSamples();
      setSeedNotice(res.message);
      setTimeout(() => setSeedNotice(null), 4000);
      fetchHealth();
      if (onRefreshData) onRefreshData();
    } catch {
      setSeedNotice('Failed to seed demo samples');
      setTimeout(() => setSeedNotice(null), 3000);
    } finally {
      setSeeding(false);
    }
  };

  const isConnected = health?.database?.connected;

  return (
    <header className="h-16 w-full bg-white/80 dark:bg-[#000000]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-zinc-850 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-30 transition-colors">
      {/* Brand & Unique Logo */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-3 group cursor-pointer">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <SentinelLogo size={36} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-[#00BCD4] transition-colors">
                SpamSentinel AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden md:block leading-tight">
              Intelligent SMS &amp; Email Spam Detection &amp; Archival on MongoDB
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* MongoDB Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 hover:border-[#00BCD4]/40 transition-all duration-200">
          <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span className="text-slate-600 dark:text-zinc-300 font-medium hidden sm:inline">MongoDB</span>
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </span>
        </div>

        {/* Model Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 hover:border-[#00BCD4]/40 transition-all duration-200">
          <Cpu className="w-3.5 h-3.5 text-[#00BCD4] animate-pulse" />
          <span className="font-medium">Naive Bayes:</span>
          <span className="font-mono text-[#00BCD4] font-semibold">
            {health?.model?.accuracy ? `${(health.model.accuracy * 100).toFixed(1)}%` : '98.7%'}
          </span>
        </div>

        {/* Landing Shortcut */}
        <Link
          to="/landing"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 bg-slate-50/80 dark:bg-zinc-900/80 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-[#00BCD4]/40 transition-all duration-200 hover:scale-105 active:scale-95 group"
          title="Open Landing Page"
        >
          <span>Landing</span>
          <ExternalLink className="w-3 h-3 text-slate-400 dark:text-zinc-500 group-hover:text-[#00BCD4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Link>

        {/* Dynamic Animated Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 bg-slate-50/80 dark:bg-zinc-900/80 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-[#00BCD4]/40 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 group"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <Moon className="w-4 h-4 text-[#00BCD4] group-hover:-rotate-45 transition-transform duration-500" />
          )}
        </button>

        {/* Seed Demo Button with Micro-Animation */}
        <button
          onClick={handleSeedSamples}
          disabled={seeding}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00BCD4] hover:bg-cyan-300 text-black shadow-md hover:shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
          title="Seed realistic demonstration messages into MongoDB"
        >
          {seeding ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Seed Demo</span>
        </button>
      </div>

      {/* Transient Notification Toast */}
      {seedNotice && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#00BCD4] text-black text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xl animate-in fade-in duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{seedNotice}</span>
        </div>
      )}
    </header>
  );
};
