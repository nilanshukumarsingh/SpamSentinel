import React from 'react';
import { ShieldAlert, ShieldCheck, BookmarkCheck, Archive } from 'lucide-react';
import { PredictionType, MessageStatus } from '../types';

interface BadgeProps {
  type: 'prediction' | 'status';
  value: PredictionType | MessageStatus;
  confidence?: number;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, confidence }) => {
  if (type === 'prediction') {
    const isSpam = value === 'spam';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
          isSpam
            ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-xs'
            : 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-xs'
        }`}
      >
        {isSpam ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
        <span>{isSpam ? 'SPAM' : 'HAM (SAFE)'}</span>
        {confidence !== undefined && (
          <span className="opacity-80 font-mono text-[11px]">
            {(confidence * 100).toFixed(1)}%
          </span>
        )}
      </span>
    );
  }

  // Status badges
  if (value === 'whitelisted') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
        <BookmarkCheck className="w-3 h-3" />
        Whitelisted
      </span>
    );
  }

  if (value === 'archived') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
        <Archive className="w-3 h-3" />
        Archived
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      Unreviewed
    </span>
  );
};

