import React from "react";
import { Link } from "react-router-dom";

export const FooterDarkBrand: React.FC = () => {
  const columns = [
    {
      heading: "Platform",
      links: [
        { label: "Spam Studio", href: "/detector" },
        { label: "Telemetry Dashboard", href: "/dashboard" },
        { label: "Message Vault", href: "/history" },
        { label: "Quarantine Archive", href: "/archive" },
      ],
    },
    {
      heading: "NoSQL & ML Core",
      links: [
        { label: "PyMongo CRUD", href: "/nosql" },
        { label: "TF-IDF + Naive Bayes", href: "/analytics" },
        { label: "Whitelist Policies", href: "/whitelist" },
        { label: "Model Metrics", href: "/analytics" },
      ],
    },
    {
      heading: "Resources & Docs",
      links: [
        { label: "Interactive API Docs", href: "http://localhost:8000/docs" },
        { label: "UCI Dataset Attribution", href: "https://archive.ics.uci.edu/dataset/228/sms+spam+collection" },
        { label: "GitHub Repository", href: "https://github.com/nilanshukumarsingh/SpamSentinel" },
        { label: "System Health & Uptime", href: "http://localhost:8000/api/health" },
      ],
    },
  ];

  return (
    <section className="bg-transparent px-6 py-16 md:py-24 transition-colors duration-200">
      <footer className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-display">
              SpamSentinel AI
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              Intelligent SMS &amp; Email Spam Detection and Persistent Archival System using MongoDB &amp; PyMongo.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/nilanshukumarsingh/SpamSentinel"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition hover:bg-[#00BCD4] hover:text-black hover:border-[#00BCD4] shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.79.62-3.38-1.38-3.38-1.38-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.9 1.58 2.36 1.12 2.93.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.32 9.32 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-xs text-slate-600 dark:text-zinc-400 transition hover:text-[#00BCD4] dark:hover:text-[#00BCD4]"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-xs text-slate-600 dark:text-zinc-400 transition hover:text-[#00BCD4] dark:hover:text-[#00BCD4]"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Giant typography banner */}
        <div className="mt-14 pt-10">
          <span
            aria-hidden="true"
            className="block bg-gradient-to-b from-slate-900 via-slate-500 to-slate-200 dark:from-zinc-200 dark:via-zinc-600 dark:to-zinc-900 bg-clip-text text-5xl font-black leading-none tracking-tighter text-transparent sm:text-7xl lg:text-[8rem] select-none"
          >
            SPAMSENTINEL
          </span>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} Nilanshu Kumar Singh • SpamSentinel AI.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>All NoSQL &amp; ML systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

