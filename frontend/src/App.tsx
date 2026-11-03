import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Detector } from './pages/Detector';
import { History } from './pages/History';
import { Archive } from './pages/Archive';
import { Whitelist } from './pages/Whitelist';
import { Analytics } from './pages/Analytics';
import { NoSQLExplorer } from './pages/NoSQLExplorer';

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/landing' || location.pathname === '/';

  if (isLanding) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/detector" element={<Detector />} />
            <Route path="/history" element={<History />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/whitelist" element={<Whitelist />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/nosql" element={<NoSQLExplorer />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
