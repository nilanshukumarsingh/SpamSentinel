import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Info,
  Database,
  BookmarkCheck,
  Flag,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import { Message } from '../types';
import { Badge } from '../components/Badge';
import { MessageModal } from '../components/Modal';

const SAMPLE_MESSAGES = [
  {
    title: 'Prize Winner Spam',
    sender: '+447911999888',
    text: 'Congratulations! You have won £1,000 cash prize or a guaranteed £2,000 holiday! Call 0906121 to claim your reward now! Terms apply.',
  },
  {
    title: 'Bank Phishing Alert',
    sender: 'AlertDesk',
    text: 'URGENT: Your bank debit card has been suspended due to 3 suspicious login attempts. Verify your details immediately at http://secure-bank-login.xyz',
  },
  {
    title: 'Normal Friendly Chat',
    sender: 'Rohan Sharma',
    text: 'Hey Rohan, are we still meeting up for lunch at the cafeteria around 1:30 PM today?',
  },
  {
    title: 'Internal Team Notice',
    sender: 'Operations Lead',
    text: 'Reminder for engineering team: Please review and submit your quarterly database migration checklist before Friday 5 PM.',
  },
  {
    title: 'Promotional Lottery Offer',
    sender: '88088',
    text: 'WINNER! You were selected for a $500 Amazon Gift Voucher. Text CLAIM to 88088 to redeem your code now!',
  },
];

export const Detector: React.FC = () => {
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Message | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedModalMessage, setSelectedModalMessage] = useState<Message | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Please enter or paste message text to analyze.');
      return;
    }

    try {
      setErrorMsg(null);
      setLoading(true);
      const data = await api.detectMessage(text.trim(), sender || undefined, 'manual');
      setResult(data);
    } catch (err: any) {
      let message = 'Classification request failed.';
      const detail = err.response?.data?.detail;
      if (detail) {
        if (Array.isArray(detail)) {
          message = detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        } else {
          message = String(detail);
        }
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setSender('');
    setResult(null);
    setErrorMsg(null);
  };

  const handleSelectSample = (sample: typeof SAMPLE_MESSAGES[0]) => {
    setText(sample.text);
    setSender(sample.sender);
    setResult(null);
    setErrorMsg(null);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const summaryText = `[SpamSentinel AI]\nPrediction: ${result.prediction.toUpperCase()}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nText: ${result.text}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Intelligent Text Classifier</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Spam & Phishing Detector
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Paste an SMS, email content, or promotional message. Our Multinomial Naive Bayes model will evaluate feature vectors using TF-IDF and store the result in MongoDB.
        </p>
      </div>

      {/* Dataset & Scope Notice Box */}
      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3 text-xs text-indigo-900">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Dataset Transparency Note:</span>
          <p className="text-indigo-800 leading-relaxed">
            The machine learning model is trained on the official UCI SMS Spam Collection dataset (5,574 labeled communications). While you may paste SMS or email content, note that feature vocabulary is optimized for real-world SMS spam patterns.
          </p>
        </div>
      </div>

      {/* Sample Quick Load Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Load Pre-built Test Examples:
        </label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_MESSAGES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 text-slate-700 font-medium transition-all shadow-2xs cursor-pointer"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <form onSubmit={handleAnalyze} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Sender Identifier (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. +447911123456, SecurityAlert, or trusted@domain.com"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Raw Message Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {wordCount} words • {charCount} chars
              </span>
            </div>
            <textarea
              rows={5}
              placeholder="Paste raw SMS or email text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y font-sans leading-relaxed text-slate-800"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Input
            </button>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Vector Features...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Prediction Output Card */}
        {result && (
          <div className="border-t border-slate-200 bg-slate-50/70 p-6 animate-fadeIn">
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Whitelist Override Explanatory Banner if applicable */}
              {result.classification_source === 'whitelist' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 shadow-2xs">
                  <BookmarkCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm block text-blue-950">Administrative Whitelist Override Active</span>
                    <p className="mt-0.5 text-blue-800">
                      This message matched a trusted rule in MongoDB (<span className="font-semibold">{result.whitelist_reason || 'Approved Whitelist Entry'}</span>). 
                      The effective classification is forced to <strong className="text-emerald-700 uppercase font-bold">HAM (SAFE)</strong> with 100% policy confidence.
                    </p>
                    {result.model_prediction && (
                      <p className="mt-2 font-mono text-[11px] text-blue-900 bg-blue-100/80 inline-block px-2.5 py-1 rounded-md border border-blue-200">
                        Raw ML Model Prediction: <strong>{result.model_prediction.toUpperCase()}</strong> (Model Spam Probability: {((result.spam_probability ?? 0) * 100).toFixed(1)}%)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Prediction Badge & Confidence Banner */}
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                  result.prediction === 'spam'
                    ? 'bg-rose-50/90 border-rose-200'
                    : result.classification_source === 'whitelist'
                    ? 'bg-blue-50/90 border-blue-200'
                    : 'bg-emerald-50/90 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      result.prediction === 'spam'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                        : result.classification_source === 'whitelist'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                    }`}
                  >
                    {result.prediction === 'spam' ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold tracking-tight text-slate-900">
                        {result.classification_source === 'whitelist'
                          ? 'WHITELIST OVERRIDE (SAFE)'
                          : result.prediction === 'spam'
                          ? 'SPAM DETECTED'
                          : 'LEGITIMATE (HAM)'}
                      </span>
                      <Badge type="status" value={result.status} />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {result.classification_source === 'whitelist'
                        ? 'Administrative policy bypassed ML filter. Approved by verified sender/keyword rule.'
                        : result.prediction === 'spam'
                        ? 'This message matches known spam keywords and promotional patterns.'
                        : 'This message shows standard interpersonal or conversational features.'}
                    </p>
                  </div>
                </div>

                {/* Confidence Pill */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                    {result.classification_source === 'whitelist' ? 'Policy Confidence' : 'Confidence Score'}
                  </span>
                  <span
                    className={`text-2xl font-black font-mono tracking-tight ${
                      result.prediction === 'spam'
                        ? 'text-rose-600'
                        : result.classification_source === 'whitelist'
                        ? 'text-blue-700'
                        : 'text-emerald-600'
                    }`}
                  >
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Confidence Progress Gauge */}
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Class Probability Breakdown</span>
                  <span className="font-mono">
                    Spam: {((result.spam_probability ?? (result.prediction === 'spam' ? result.confidence : 1 - result.confidence)) * 100).toFixed(1)}% | 
                    Ham: {((result.ham_probability ?? (result.prediction === 'ham' ? result.confidence : 1 - result.confidence)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(result.spam_probability ?? (result.prediction === 'spam' ? result.confidence : 1 - result.confidence)) * 100}%`
                    }}
                    className="bg-rose-500 transition-all duration-500"
                    title="Spam Probability"
                  />
                  <div
                    style={{
                      width: `${(result.ham_probability ?? (result.prediction === 'ham' ? result.confidence : 1 - result.confidence)) * 100}%`
                    }}
                    className="bg-emerald-500 transition-all duration-500"
                    title="Ham Probability"
                  />
                </div>
              </div>

              {/* Recognized Vocabulary Tokens */}
              {result.highlighted_keywords && result.highlighted_keywords.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Recognized Vocabulary Tokens
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tokens in model TF-IDF vocabulary, ranked by Naive Bayes log-odds impact
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.highlighted_keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 font-semibold"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Result Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModalMessage(result)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>View MongoDB Document</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedModalMessage(result)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedModalMessage && (
        <MessageModal
          message={selectedModalMessage}
          onClose={() => setSelectedModalMessage(null)}
          onStatusChange={(updated) => {
            setResult(updated);
            setSelectedModalMessage(null);
          }}
        />
      )}
    </div>
  );
};

