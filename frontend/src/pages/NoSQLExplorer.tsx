import React, { useEffect, useState } from 'react';
import {
  Database,
  Code2,
  CheckCircle,
  Copy,
  Layers,
  FileJson,
  Server,
  Zap,
  RefreshCw,
  Search,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { HealthStatus } from '../types';

interface OperationSnippet {
  title: string;
  category: 'CRUD Create' | 'CRUD Read' | 'CRUD Update' | 'CRUD Delete' | 'Aggregation Pipeline' | 'Indexing';
  code: string;
  description: string;
}

const PYMONGO_OPERATIONS: OperationSnippet[] = [
  {
    title: '1. Index Creation on Startup',
    category: 'Indexing',
    description: 'Creates descending index on timestamp, status, and prediction for fast filtering and pagination.',
    code: `# backend/app/database.py
messages_col = self.db["messages"]
messages_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_created_at")
messages_col.create_index([("prediction", pymongo.ASCENDING)], name="idx_prediction")
messages_col.create_index([("status", pymongo.ASCENDING)], name="idx_status")
messages_col.create_index([("text", pymongo.TEXT)], name="idx_text_search")
whitelist_col.create_index([("value", pymongo.ASCENDING)], unique=True)`
  },
  {
    title: '2. Create (Insert Classified Document)',
    category: 'CRUD Create',
    description: 'Inserts ML prediction result and metadata as a flexible JSON/BSON document.',
    code: `# backend/app/services/spam_detector.py
doc = {
    "text": text,
    "sender": sender,
    "prediction": "spam",      # or 'ham'
    "confidence": 0.9872,
    "status": "unreviewed",    # or 'archived', 'whitelisted'
    "source": "manual",
    "created_at": datetime.now(timezone.utc),
    "updated_at": datetime.now(timezone.utc)
}
col = db_manager.get_collection("messages")
result = col.insert_one(doc)
doc_id = result.inserted_id  # Returns BSON ObjectId`
  },
  {
    title: '3. Read (Filtered Query with Pagination)',
    category: 'CRUD Read',
    description: 'Uses find() with regex search, prediction filter, sort by date, and skip/limit pagination.',
    code: `# backend/app/routers/messages.py
query = {}
if prediction:
    query["prediction"] = prediction
if search:
    query["$or"] = [
        {"text": {"$regex": search, "$options": "i"}},
        {"sender": {"$regex": search, "$options": "i"}}
    ]

total_count = col.count_documents(query)
cursor = col.find(query).sort("created_at", -1).skip(skip).limit(limit)
messages = [format_doc(doc) for doc in cursor]`
  },
  {
    title: '4. Update (Mark Status / Whitelist)',
    category: 'CRUD Update',
    description: 'Updates message review status from flagged to whitelisted or archived using $set operator.',
    code: `# backend/app/routers/messages.py
updated = col.find_one_and_update(
    {"_id": ObjectId(message_id)},
    {"$set": {"status": "whitelisted", "updated_at": datetime.now(timezone.utc)}},
    return_document=True
)`
  },
  {
    title: '5. Delete (Single & Bulk Purge)',
    category: 'CRUD Delete',
    description: 'Permits single deletion via delete_one() or bulk purge via delete_many() (Empty Spam Folder).',
    code: `# backend/app/routers/archive.py
# Single deletion
col.delete_one({"_id": ObjectId(message_id)})

# SRS Feature: Empty Spam Folder
res = col.delete_many({"status": "archived"})
print(f"Purged {res.deleted_count} spam documents.")`
  },
  {
    title: '6. MongoDB Multi-Faceted Aggregation Pipeline',
    category: 'Aggregation Pipeline',
    description: 'Computes total count, spam/ham breakdown, and status distribution in a single database round-trip using $facet.',
    code: `# backend/app/services/analytics_service.py
summary_pipeline = [
    {
        "$facet": {
            "total": [{"$count": "count"}],
            "by_prediction": [
                {"$group": {"_id": "$prediction", "count": {"$sum": 1}}}
            ],
            "by_status": [
                {"$group": {"_id": "$status", "count": {"$sum": 1}}}
            ]
        }
    }
]
res = list(col.aggregate(summary_pipeline))[0]`
  },
  {
    title: '7. Keyword Frequency Aggregation ($unwind + $sortByCount)',
    category: 'Aggregation Pipeline',
    description: 'Unwinds array of keyword tokens from spam messages and computes top occurrences using $sortByCount.',
    code: `# backend/app/services/analytics_service.py
keywords_pipeline = [
    {"$match": {"prediction": "spam", "highlighted_keywords": {"$exists": True, "$ne": []}}},
    {"$unwind": "$highlighted_keywords"},
    {"$sortByCount": "$highlighted_keywords"},
    {"$limit": 8}
]
top_keywords = list(col.aggregate(keywords_pipeline))`
  }
];

export const NoSQLExplorer: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>High-Performance NoSQL Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            MongoDB &amp; PyMongo Operations Explorer
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Interactive guide to all NoSQL database operations, compound aggregations, and CRUD queries used in SpamSentinel AI.
          </p>
        </div>
      </div>

      {/* Live Database Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          Live MongoDB Cluster Status
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Database Name</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-mono">
              {health?.database.database_name || 'spamguard_db'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Driver</span>
            <span className="text-base font-bold text-indigo-700 mt-1 block">
              PyMongo 4.x (Python)
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Collection: `messages`</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-mono">
              {health?.database.total_messages ?? 0} docs
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-medium">Collection: `whitelist`</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-mono">
              {health?.database.whitelist_rules ?? 0} rules
            </span>
          </div>
        </div>
      </div>

      {/* Code Snippets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            PyMongo Operations Catalog for Viva Evaluation
          </h2>
          <span className="text-xs text-slate-500 font-mono">7 Key Operations</span>
        </div>

        {PYMONGO_OPERATIONS.map((op, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{op.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {op.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{op.description}</p>
              </div>
              <button
                onClick={() => handleCopy(op.code, idx)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{op.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

