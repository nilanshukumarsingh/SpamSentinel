import React, { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, BookmarkCheck, Trash2, Send, CheckCircle, Database } from 'lucide-react';
import { Message, PredictionType } from '../types';
import { Badge } from './Badge';
import { api } from '../services/api';

interface MessageModalProps {
  message: Message | null;
  onClose: () => void;
  onStatusChange?: (updated: Message) => void;
  onDeleted?: (id: string) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  message,
  onClose,
  onStatusChange,
  onDeleted
}) => {
  const [feedbackLabel, setFeedbackLabel] = useState<PredictionType | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'json'>('details');

  if (!message) return null;

  const handleFeedbackSubmit = async () => {
    if (!feedbackLabel) return;
    try {
      setSubmittingFeedback(true);
      await api.submitFeedback({
        message_id: message.id,
        actual_label: feedbackLabel,
        predicted_label: message.prediction,
        feedback: feedbackNotes || `Human feedback: actual label should be ${feedbackLabel}`
      });
      setFeedbackSent(true);
      if (feedbackLabel === 'ham' && onStatusChange) {
        onStatusChange({ ...message, status: 'whitelisted' });
      }
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleWhitelist = async () => {
    try {
      const updated = await api.updateMessageStatus(message.id, 'whitelisted');
      if (onStatusChange) onStatusChange(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (confirm('Permanently delete this message document from MongoDB?')) {
      try {
        await api.deleteMessage(message.id);
        if (onDeleted) onDeleted(message.id);
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <Badge type="prediction" value={message.prediction} confidence={message.confidence} />
            <Badge type="status" value={message.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Message Overview
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            MongoDB Document (BSON/JSON)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'details' ? (
            <>
              {/* Message Content Box */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Message Text
                </label>
                <div className="mt-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {message.text}
                </div>
              </div>

              {/* Sender & Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block font-medium">Sender:</span>
                  <span className="font-semibold text-slate-800 break-all">{message.sender || 'Unknown'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block font-medium">Classification:</span>
                  <span className={`font-semibold capitalize ${message.prediction === 'spam' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {message.prediction} ({(message.confidence * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block font-medium">Classification Source:</span>
                  <span className={`font-semibold capitalize ${message.classification_source === 'whitelist' ? 'text-blue-700 font-bold' : 'text-slate-800'}`}>
                    {message.classification_source === 'whitelist' ? 'Whitelist Override' : 'ML Model'}
                  </span>
                </div>
                {message.classification_source === 'whitelist' && message.model_prediction && (
                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 col-span-2 sm:col-span-3">
                    <span className="text-blue-600 block font-medium">Whitelist Policy Reason & Raw ML Output:</span>
                    <span className="font-semibold text-blue-900 block mt-0.5">
                      {message.whitelist_reason || 'Approved Sender/Keyword Rule'} — Model predicted: {message.model_prediction.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block font-medium">Origin Source:</span>
                  <span className="font-semibold text-slate-800 capitalize">{message.source}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-400 block font-medium">Recorded Date:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-medium">MongoDB _id:</span>
                  <span className="font-mono text-indigo-700 font-semibold truncate block">{message.id}</span>
                </div>
              </div>

              {/* Significant Keywords */}
              {message.highlighted_keywords && message.highlighted_keywords.length > 0 && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Recognized Vocabulary Tokens
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Tokens present in model vocabulary, ranked by Naive Bayes log-odds impact
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {message.highlighted_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Human Feedback Report Box */}
              <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Model Correction & Feedback (Human-in-the-Loop)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Did the model misclassify this message? Log a correction directly to MongoDB.
                </p>

                {feedbackSent ? (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Feedback recorded in MongoDB collection 'feedback'.
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackLabel('ham')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          feedbackLabel === 'ham'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Mark Actual as Legitimate (Ham)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackLabel('spam')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          feedbackLabel === 'spam'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Mark Actual as Spam
                      </button>
                    </div>
                    {feedbackLabel && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={feedbackNotes}
                          onChange={(e) => setFeedbackNotes(e.target.value)}
                          placeholder="Optional audit reason (e.g. false alarm on urgent keyword)"
                          className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={handleFeedbackSubmit}
                          disabled={submittingFeedback}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  MongoDB Document Structure: collection(`messages`)
                </span>
                <span className="text-[11px] font-mono text-indigo-600">BSON / JSON format</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(message, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Document
          </button>

          <div className="flex items-center gap-2">
            {message.status !== 'whitelisted' && (
              <button
                onClick={handleWhitelist}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                Whitelist Message
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

