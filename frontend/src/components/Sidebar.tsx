import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Inbox,
  Archive,
  UserCheck,
  BarChart3,
  Database,
  GraduationCap
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Spam Detector', path: '/detector', icon: ShieldCheck },
  { name: 'Message History', path: '/history', icon: Inbox },
  { name: 'Spam Archive', path: '/archive', icon: Archive },
  { name: 'Whitelist Rules', path: '/whitelist', icon: UserCheck },
  { name: 'Analytics & ML', path: '/analytics', icon: BarChart3 },
  { name: 'NoSQL Operations', path: '/nosql', icon: Database },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Navigation Menu
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Academic Project Viva Card */}
      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-indigo-300">
          <GraduationCap className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">CSE-494 Project</span>
        </div>
        <h4 className="text-xs font-semibold text-slate-200">Intelligent NoSQL DBs</h4>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Powered by PyMongo Driver with MongoDB CRUD & Aggregation Pipelines.
        </p>
        <div className="mt-3 pt-2 border-t border-indigo-900/60 flex items-center justify-between text-[10px] text-indigo-300">
          <span>Spring 2025</span>
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">v2.0</span>
        </div>
      </div>
    </aside>
  );
};

