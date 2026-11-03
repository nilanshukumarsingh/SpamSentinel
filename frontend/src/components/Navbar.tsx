import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Cpu, Sparkles, RefreshCw, Home } from 'lucide-react';
import { api } from '../services/api';
import { HealthStatus } from '../types';

interface NavbarProps {
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefreshData }) => {
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
    } catch (e: any) {
      setSeedNotice('Failed to seed demo samples');
      setTimeout(() => setSeedNotice(null), 3000);
    } finally {
      setSeeding(false);
    }
  };

  const isConnected = health?.database?.connected;
  const isModelReady = health?.model?.loaded;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/landing" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  SpamSentinel AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  CSE-494
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Intelligent SMS & Email Spam Detection and Archival System using MongoDB
              </p>
            </div>
          </Link>

          {/* Right Status Indicators & Action */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* MongoDB Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-slate-200 bg-slate-50">
              <Database className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-rose-500'}`} />
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="font-semibold text-slate-700">MongoDB (PyMongo)</span>
                <span className="text-[10px] text-slate-500">{isConnected ? 'Connected: spamguard_db' : 'Disconnected'}</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            </div>

            {/* Model Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-purple-200 bg-purple-50/70 text-purple-900">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold">Naive Bayes + TF-IDF</span>
                <span className="text-[10px] text-purple-600 font-mono">
                  {health?.model?.accuracy ? `Acc: ${(health.model.accuracy * 100).toFixed(1)}%` : 'Ready'}
                </span>
              </div>
            </div>

            {/* Landing page shortcut */}
            <Link
              to="/landing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
              title="View Public Showcase Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-indigo-600" />
              <span>Landing</span>
            </Link>

            {/* Demo Sample Seeder Button */}
            <button
              onClick={handleSeedSamples}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Seed 8 realistic demonstration messages into MongoDB"
            >
              {seeding ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span className="hidden sm:inline">Seed Demo Data</span>
            </button>
          </div>
        </div>

        {/* Transient Notice */}
        {seedNotice && (
          <div className="bg-emerald-50 border-t border-emerald-200 text-emerald-800 text-xs py-1.5 px-4 text-center font-medium animate-fadeIn">
            {seedNotice}
          </div>
        )}
      </div>
    </header>
  );
};

