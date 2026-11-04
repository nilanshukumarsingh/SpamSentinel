import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Inbox,
  Archive,
  ArrowRight,
  Send,
  Sparkles,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { api } from '../services/api';
import { AnalyticsData, Message } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { MessageModal } from '../components/Modal';

const PIE_COLORS = ['#ef4444', '#10b981']; // Balanced Red (Spam), Emerald Green (Ham)

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Quick detector state on dashboard
  const [quickText, setQuickText] = useState('');
  const [quickSender, setQuickSender] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [quickResult, setQuickResult] = useState<Message | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) {
      setQuickError("Message text cannot be empty or contain only whitespace.");
      return;
    }
    try {
      setQuickError(null);
      setAnalyzing(true);
      const res = await api.detectMessage(quickText.trim(), quickSender || undefined);
      setQuickResult(res);
      loadData(); // refresh dashboard stats
    } catch (err: any) {
      let msg = "Classification failed.";
      const detail = err.response?.data?.detail;
      if (detail) {
        msg = Array.isArray(detail) ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ') : String(detail);
      }
      setQuickError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const summary = data?.summary || {
    total_messages: 0,
    spam_count: 0,
    ham_count: 0,
    archived_count: 0,
    whitelisted_count: 0,
    unreviewed_count: 0,
    spam_rate_percent: 0,
    whitelist_rules_count: 0,
  };

  const pieData = [
    { name: 'Spam', value: summary.spam_count },
    { name: 'Ham (Safe)', value: summary.ham_count },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Multinomial Naive Bayes + TF-IDF</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Security Telemetry &amp; Operations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time SMS &amp; email classification with persistent MongoDB document archival and aggregation telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/detector')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Spam Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={loadData}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Analyzed"
          value={summary.total_messages}
          subtitle="Documents in MongoDB"
          icon={Inbox}
          colorScheme="slate"
        />
        <StatCard
          title="Spam Intercepted"
          value={summary.spam_count}
          subtitle="Flagged malicious / promo"
          icon={ShieldAlert}
          colorScheme="rose"
          badge={`${summary.spam_rate_percent}% rate`}
        />
        <StatCard
          title="Legitimate (Ham)"
          value={summary.ham_count}
          subtitle="Clean verified communications"
          icon={ShieldCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="Archived & Whitelist"
          value={`${summary.archived_count} / ${summary.whitelisted_count}`}
          subtitle="Archived vs Whitelisted"
          icon={Archive}
          colorScheme="blue"
        />
      </div>

      {/* Charts & Quick Test Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Test Widget */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Quick Test Scanner
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Live PyMongo</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Instantly classify any message snippet and view classification &amp; confidence.
            </p>

            <form onSubmit={handleQuickAnalyze} className="space-y-3">
              <input
                type="text"
                placeholder="Sender ID / Phone / Email (Optional)"
                value={quickSender}
                onChange={(e) => setQuickSender(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              <textarea
                rows={3}
                placeholder="Paste message text to test (e.g., You won £1,000 cash prize!)..."
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none font-sans transition-colors"
              />
              {quickError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {quickError}
                </div>
              )}
              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {analyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Run Instant Classification</span>
              </button>
            </form>
          </div>

          {/* Quick Result Preview */}
          {quickResult && (
            <div className={`mt-4 p-3.5 rounded-xl border space-y-2 animate-fadeIn ${
              quickResult.classification_source === 'whitelist'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50'
                : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Classification Result:</span>
                <Badge
                  type="prediction"
                  value={quickResult.prediction}
                  confidence={quickResult.confidence}
                  source={quickResult.classification_source}
                />
              </div>
              {quickResult.classification_source === 'whitelist' && (
                <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                  Policy Override: Forced to HAM (ML would predict: {quickResult.model_prediction?.toUpperCase()})
                </p>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                "{quickResult.text}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span>Stored in MongoDB</span>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(quickResult)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  Inspect Document →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Spam vs Ham Ratio Pie Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Spam vs Ham Ratio
            </h2>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {summary.spam_rate_percent}% Spam
            </span>
          </div>
          <div className="h-56 w-full">
            {summary.total_messages > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No data yet. Seed demo messages above.
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
              <span className="block font-bold">{summary.spam_count}</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400">Spam Messages</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              <span className="block font-bold">{summary.ham_count}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Legitimate (Ham)</span>
            </div>
          </div>
        </div>

        {/* Activity Timeline Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Activity Inflow
            </h2>
            <span className="text-xs text-slate-400 font-mono">PyMongo $group</span>
          </div>
          <div className="h-56 w-full">
            {data?.timeline && data.timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="spam" name="Spam" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ham" name="Ham" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No timeline records available yet.
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Aggregated by Date</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Daily Inflow</span>
          </div>
        </div>
      </div>

      {/* Top Recurring Keywords & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Keywords */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Top Spam Keywords
            </h2>
            <span className="text-xs text-slate-400 font-mono">$sortByCount</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            High frequency vocabulary terms in classified spam.
          </p>
          <div className="flex flex-wrap gap-2">
            {data?.top_keywords && data.top_keywords.length > 0 ? (
              data.top_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{kw.keyword}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
                    {kw.frequency}
                  </span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No keyword tokens logged yet.</span>
            )}
          </div>
        </div>

        {/* Recent Analyzed Stream */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Recent Message Stream
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {data?.recent_messages && data.recent_messages.length > 0 ? (
              data.recent_messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {msg.sender || 'Unknown Sender'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge type="prediction" value={msg.prediction} confidence={msg.confidence} />
                    <Badge type="status" value={msg.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent messages found. Use the scanner above or click "Seed Demo".
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details & Feedback Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={() => {
            loadData();
            setSelectedMessage(null);
          }}
          onDeleted={() => {
            loadData();
            setSelectedMessage(null);
          }}
        />
      )}
    </div>
  );
};
