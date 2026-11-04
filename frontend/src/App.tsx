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
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#000000] flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-150">
      {/* Fixed Full-Width Top Navbar */}
      <Navbar />

      {/* Main Layout Area: Fixed Sidebar on Left + Scrollable Content on Right */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Constant Left Sidebar */}
        <div className="hidden md:block h-full shrink-0">
          <Sidebar />
        </div>

        {/* Scrollable Page Viewport */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 bg-slate-50 dark:bg-[#000000]">
          <div className="max-w-6xl mx-auto">
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
          </div>
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
