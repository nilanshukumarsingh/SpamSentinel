import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Detector } from './pages/Detector';
import { History } from './pages/History';
import { Archive } from './pages/Archive';
import { Whitelist } from './pages/Whitelist';
import { Analytics } from './pages/Analytics';
import { NoSQLExplorer } from './pages/NoSQLExplorer';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Layout */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Page View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/detector" element={<Detector />} />
              <Route path="/history" element={<History />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/whitelist" element={<Whitelist />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/nosql" element={<NoSQLExplorer />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
