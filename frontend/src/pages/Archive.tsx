import React, { useEffect, useState } from 'react';
import {
  Archive as ArchiveIcon,
  Search,
  Trash2,
  RotateCcw,
  RefreshCw,
  Eye,
  FolderX
} from 'lucide-react';
import { api } from '../services/api';
import { Message } from '../types';
import { Badge } from '../components/Badge';
import { MessageModal } from '../components/Modal';

export const Archive: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [purging, setPurging] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const res = await api.getArchivedMessages(page, 10, search || undefined);
      setMessages(res.messages);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, [page, search]);

  const handleRestore = async (id: string) => {
    try {
      await api.restoreArchivedMessage(id);
      fetchArchived();
      setBannerNotice('Message successfully restored to active inbox.');
      setTimeout(() => setBannerNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePermanent = async (id: string) => {
    if (confirm('Permanently purge this document from MongoDB?')) {
      try {
        await api.deleteMessage(id);
        fetchArchived();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleEmptySpamFolder = async () => {
    if (confirm('Are you sure you want to Empty Spam Folder? This executes PyMongo delete_many() across all archived records!')) {
      try {
        setPurging(true);
        const res = await api.purgeAllArchived('archived');
        fetchArchived();
        setBannerNotice(`Purge complete: ${res.deleted_count} documents purged from MongoDB.`);
        setTimeout(() => setBannerNotice(null), 4000);
      } catch (e) {
        console.error(e);
      } finally {
        setPurging(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider">
            <ArchiveIcon className="w-4 h-4" />
            <span>Spam Quarantine Vault</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Spam Message Isolation Archive
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Messages quarantined as spam or manually archived to keep your primary inbox clean and secure.
          </p>
        </div>

        {/* Purge Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEmptySpamFolder}
            disabled={purging || total === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Executes PyMongo delete_many({'status': 'archived'})"
          >
            {purging ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FolderX className="w-4 h-4" />
            )}
            <span>Empty Spam Folder ({total})</span>
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-fadeIn">
          {bannerNotice}
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search archived quarantine records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Quarantined Content</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Date Quarantined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Fetching archived documents from MongoDB...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ArchiveIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Quarantine archive is currently empty.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm sm:max-w-md">
                      <p
                        onClick={() => setSelectedMessage(msg)}
                        className="text-slate-800 font-medium line-clamp-2 hover:text-indigo-600 cursor-pointer"
                      >
                        {msg.text}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {msg.sender || <span className="text-slate-400 italic">Unknown</span>}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge type="prediction" value={msg.prediction} />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {(msg.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(msg.updated_at || msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestore(msg.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Restore to Active Messages"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePermanent(msg.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Permanently Delete"
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
      </div>

      {/* Details Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={() => {
            fetchArchived();
            setSelectedMessage(null);
          }}
          onDeleted={() => {
            fetchArchived();
            setSelectedMessage(null);
          }}
        />
      )}
    </div>
  );
};
