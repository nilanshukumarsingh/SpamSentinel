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
    <header className="h-16 w-full bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-30 transition-colors">
      {/* Brand & Unique Logo */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-3 group cursor-pointer">
          <SentinelLogo size={36} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                SpamSentinel AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                CSE 494
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
        {/* MongoDB Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
          <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span className="text-slate-600 dark:text-zinc-300 font-medium hidden sm:inline">MongoDB</span>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        </div>

        {/* Model Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300">
          <Cpu className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-medium">Naive Bayes:</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
            {health?.model?.accuracy ? `${(health.model.accuracy * 100).toFixed(1)}%` : 'Ready'}
          </span>
        </div>

        {/* Landing Shortcut */}
        <Link
          to="/landing"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-colors"
          title="Open Landing Page"
        >
          <span>Landing</span>
          <ExternalLink className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
        </Link>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Seed Demo Button */}
        <button
          onClick={handleSeedSamples}
          disabled={seeding}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          title="Seed 8 realistic demonstration messages into MongoDB"
        >
          {seeding ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          )}
          <span>Seed Demo</span>
        </button>
      </div>

      {/* Transient Notification Toast */}
      {seedNotice && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xl animate-in fade-in duration-200">
          {seedNotice}
        </div>
      )}
    </header>
  );
};
