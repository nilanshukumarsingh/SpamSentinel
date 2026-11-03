import React, { useEffect, useState } from 'react';
import {
  Inbox,
  Search,
  Trash2,
  BookmarkCheck,
  Archive,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { Message, MessageStatus } from '../types';
import { Badge } from '../components/Badge';
import { MessageModal } from '../components/Modal';

export const History: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [predictionFilter, setPredictionFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages({
        page,
        limit,
        prediction: predictionFilter || undefined,
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
        sort_order: -1
      });
      setMessages(res.messages);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, limit, predictionFilter, statusFilter, debouncedSearch]);

  const handleStatusUpdate = async (id: string, newStatus: MessageStatus) => {
    try {
      await api.updateMessageStatus(id, newStatus);
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this record permanently from MongoDB?')) {
      try {
        await api.deleteMessage(id);
        fetchMessages();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
            <Inbox className="w-4 h-4" />
            <span>MongoDB Message Store</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Classification Archive & Log History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete persistent repository of all evaluated communications in collection: <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-xs font-mono">messages</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMessages}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by text content or sender..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Classification Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0">Prediction:</span>
            <select
              value={predictionFilter}
              onChange={(e) => {
                setPredictionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Predictions (Spam + Ham)</option>
              <option value="spam">Spam Only</option>
              <option value="ham">Ham (Safe) Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0">Review Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Review Statuses</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="whitelisted">Whitelisted</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Quick Preset:</span>
          <button
            onClick={() => {
              setPredictionFilter('');
              setStatusFilter('');
              setSearch('');
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              !predictionFilter && !statusFilter ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Messages ({total})
          </button>
          <button
            onClick={() => {
              setPredictionFilter('spam');
              setStatusFilter('');
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              predictionFilter === 'spam' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Spam Only
          </button>
          <button
            onClick={() => {
              setPredictionFilter('ham');
              setStatusFilter('');
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              predictionFilter === 'ham' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Legitimate Ham
          </button>
          <button
            onClick={() => {
              setStatusFilter('whitelisted');
              setPredictionFilter('');
              setPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'whitelisted' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Whitelisted
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Message Snippet</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Prediction</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Querying MongoDB collection...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No documents matched your query criteria.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Message Preview */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <p
                        onClick={() => setSelectedMessage(msg)}
                        className="text-slate-800 font-medium line-clamp-2 hover:text-indigo-600 cursor-pointer"
                        title={msg.text}
                      >
                        {msg.text}
                      </p>
                      {msg.highlighted_keywords && msg.highlighted_keywords.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {msg.highlighted_keywords.slice(0, 3).map((kw, idx) => (
                            <span key={idx} className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {msg.sender || <span className="text-slate-400 italic">Unknown</span>}
                    </td>

                    {/* Prediction Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge type="prediction" value={msg.prediction} />
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-700">
                      {(msg.confidence * 100).toFixed(1)}%
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge type="status" value={msg.status} />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="View Details & BSON"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {msg.status !== 'whitelisted' && (
                          <button
                            onClick={() => handleStatusUpdate(msg.id, 'whitelisted')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Whitelist this Message"
                          >
                            <BookmarkCheck className="w-4 h-4" />
                          </button>
                        )}
                        {msg.status !== 'archived' && (
                          <button
                            onClick={() => handleStatusUpdate(msg.id, 'archived')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Move to Spam Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete from MongoDB"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold">{messages.length}</span> of{' '}
            <span className="font-semibold">{total}</span> documents
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={() => {
            fetchMessages();
            setSelectedMessage(null);
          }}
          onDeleted={() => {
            fetchMessages();
            setSelectedMessage(null);
          }}
        />
      )}
    </div>
  );
};
