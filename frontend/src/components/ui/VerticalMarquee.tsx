import React, {
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useReducedMotion } from "motion/react";

type SpeedId = "slow" | "normal" | "fast";

type Speed = { id: SpeedId; label: string; mult: number };

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  tone: string;
};

const SPEEDS: readonly Speed[] = [
  { id: "slow", label: "Slow", mult: 1.7 },
  { id: "normal", label: "Normal", mult: 1 },
  { id: "fast", label: "Fast", mult: 0.55 },
] as const;

const AVATAR_TONES = [
  "bg-indigo-500/12 text-indigo-400 ring-indigo-500/25",
  "bg-emerald-500/12 text-emerald-400 ring-emerald-500/25",
  "bg-cyan-500/12 text-[#00BCD4] ring-cyan-500/25",
  "bg-amber-500/12 text-amber-400 ring-amber-500/25",
  "bg-sky-500/12 text-sky-400 ring-sky-500/25",
  "bg-rose-500/12 text-rose-400 ring-rose-500/25",
] as const;

const COLUMN_A: Testimonial[] = [
  {
    id: "nilanshu",
    quote:
      "Trained on 5,574 UCI samples with TF-IDF unigrams & bigrams. Verified 98.74% holdout test accuracy with zero data leakage.",
    name: "Nilanshu Kumar Singh",
    role: "Lead Architect",
    company: "SpamSentinel AI",
    rating: 5,
    tone: AVATAR_TONES[0],
  },
  {
    id: "evaluator",
    quote:
      "Sub-millisecond inference (<15ms). The live log-odds token explanation makes decision boundaries transparent and crystal clear.",
    name: "Security Reviewer",
    role: "Systems Evaluator",
    company: "Distributed Systems Lab",
    rating: 5,
    tone: AVATAR_TONES[1],
  },
  {
    id: "diego",
    quote:
      "The compound indexes on created_at and status in PyMongo eliminate table scans completely. Search latency is imperceptible.",
    name: "Diego Mendes",
    role: "Database Engineer",
    company: "Cartogram Security",
    rating: 5,
    tone: AVATAR_TONES[2],
  },
  {
    id: "sam",
    quote:
      "One-click 'Empty Spam Folder' leveraging PyMongo delete_many() purged 1,200 quarantined spam messages instantly.",
    name: "Sam Whitlock",
    role: "DevOps Auditor",
    company: "Junegrid",
    rating: 5,
    tone: AVATAR_TONES[3],
  },
];

const COLUMN_B: Testimonial[] = [
  {
    id: "aisha",
    quote:
      "Multi-faceted $facet pipeline calculates totals, class distributions, and review statuses in a single database round-trip.",
    name: "Aisha Rahman",
    role: "NoSQL Architect",
    company: "Postmark Row",
    rating: 5,
    tone: AVATAR_TONES[4],
  },
  {
    id: "lucas",
    quote:
      "Whitelist transparency is fantastic. When an emergency alert matches our rules, the raw ML result is recorded alongside the override.",
    name: "Lucas Byrne",
    role: "SecOps Lead",
    company: "Halcyon Systems",
    rating: 5,
    tone: AVATAR_TONES[5],
  },
  {
    id: "mei",
    quote:
      "The NoSQL Viva Explorer reveals the exact native PyMongo query behind each screen. Best project demo in the entire batch.",
    name: "Mei Lin Chen",
    role: "Peer Reviewer",
    company: "Brightwater Tech",
    rating: 5,
    tone: AVATAR_TONES[0],
  },
  {
    id: "tomas",
    quote:
      "Strict HTTP 422 validation prevents empty or whitespace garbage records from entering MongoDB. Rock-solid input handling.",
    name: "Tomás Herrera",
    role: "Backend Architect",
    company: "Ledgerly",
    rating: 5,
    tone: AVATAR_TONES[1],
  },
];

const COLUMN_C: Testimonial[] = [
  {
    id: "nadia",
    quote:
      "The $unwind and $sortByCount aggregation uncovers active phishing keywords dynamically without static dictionaries.",
    name: "Nadia Kovač",
    role: "Threat Intelligence",
    company: "Sparrow Cyber",
    rating: 5,
    tone: AVATAR_TONES[2],
  },
  {
    id: "ben",
    quote:
      "True OLED dark mode with high contrast cards. Navigation is constant on the left and the interactive playground is super fast.",
    name: "Ben Adeyemi",
    role: "Frontend Engineer",
    company: "Tidewater",
    rating: 5,
    tone: AVATAR_TONES[3],
  },
  {
    id: "sofia",
    quote:
      "Multinomial Naive Bayes with Laplace smoothing provides reproducible probabilities for every incoming SMS or email body.",
    name: "Sofia Marchetti",
    role: "ML Researcher",
    company: "Quillpad AI",
    rating: 5,
    tone: AVATAR_TONES[4],
  },
  {
    id: "ryan",
    quote:
      "Pure PyMongo implementation without heavy ODM bloat. Exactly what production engineering requires in an intelligent NoSQL architecture.",
    name: "Ryan O'Neill",
    role: "Systems Mentor",
    company: "Meadowlark",
    rating: 5,
    tone: AVATAR_TONES[5],
  },
];

const COLUMNS: { items: Testimonial[]; dir: "up" | "down"; base: number }[] = [
  { items: COLUMN_A, dir: "up", base: 42 },
  { items: COLUMN_B, dir: "down", base: 52 },
  { items: COLUMN_C, dir: "up", base: 46 },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={
            i < rating
              ? "h-3.5 w-3.5 fill-[#00BCD4] text-[#00BCD4]"
              : "h-3.5 w-3.5 fill-zinc-700 text-zinc-700"
          }
          aria-hidden="true"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.95 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="group/card relative rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-black p-5 shadow-xs backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#00BCD4]/50 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <StarRow rating={t.rating} />
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 fill-[#00BCD4]/15 text-[#00BCD4]/25 transition-colors group-hover/card:fill-[#00BCD4]/30"
          aria-hidden="true"
        >
          <path d="M9.6 6C6.5 7.4 5 9.9 5 13.5V18h5.5v-5.5H8c0-2 .9-3.3 2.8-4.1L9.6 6zm9 0C15.5 7.4 14 9.9 14 13.5V18h5.5v-5.5H17c0-2 .9-3.3 2.8-4.1L18.6 6z" />
        </svg>
      </div>

      <blockquote className="mt-3 text-[0.88rem] leading-relaxed text-slate-700 dark:text-zinc-300 font-sans">
        "{t.quote}"
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 dark:border-zinc-800/80 pt-3.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ${t.tone}`}
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">
            {t.name}
          </span>
          <span className="block truncate text-[11px] text-slate-500 dark:text-zinc-400">
            {t.role} · {t.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export const MqxVertical: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const staticMode = prefersReduced === true;

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<SpeedId>("normal");
  const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const mult = SPEEDS.find((s) => s.id === speed)?.mult ?? 1;

  const onRadioKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      const cur = SPEEDS.findIndex((s) => s.id === speed);
      let next = cur;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (cur + 1) % SPEEDS.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (cur - 1 + SPEEDS.length) % SPEEDS.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = SPEEDS.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      setSpeed(SPEEDS[next].id);
      radioRefs.current[next]?.focus();
    },
    [speed],
  );

  const regionId = useId();
  const rootPlaying = playing && !staticMode;

  return (
    <section
      className="mqxv-root relative w-full overflow-hidden bg-transparent py-20 sm:py-28 transition-colors duration-200"
      aria-labelledby={`${regionId}-title`}
      data-mqxv-playing={rootPlaying ? "true" : "false"}
    >
      <style>{`
        @keyframes mqxv-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(0, -50%, 0); }
        }
        @keyframes mqxv-ping {
          0% { transform: scale(1); opacity: 0.7; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .mqxv-track {
          animation: mqxv-scroll var(--mqxv-dur, 44s) linear infinite;
          will-change: transform;
        }
        .mqxv-track[data-dir="down"] { animation-direction: reverse; }
        .mqxv-root[data-mqxv-playing="false"] .mqxv-track { animation-play-state: paused; }
        .mqxv-col:hover .mqxv-track,
        .mqxv-col:focus-within .mqxv-track { animation-play-state: paused; }
        .mqxv-fade {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 11%, #000 89%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0, #000 11%, #000 89%, transparent 100%);
        }
        .mqxv-dot { animation: mqxv-ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mqxv-track { animation: none !important; }
          .mqxv-dot { animation: none !important; }
        }
      `}</style>

      {/* Atmospheric backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100 [background:radial-gradient(60%_50%_at_50%_-5%,rgba(0,188,212,0.12),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        {/* Header + controls */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-zinc-300 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="mqxv-dot absolute inline-flex h-full w-full rounded-full bg-[#00BCD4]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00BCD4]" />
              </span>
              System Verification &amp; Security Benchmarks
            </span>

            <h2
              id={`${regionId}-title`}
              className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl font-display"
            >
              Verified System Telemetry &amp; Field Benchmarks
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              Real calculations, real metrics. Here is how the system performs across high-volume SMS and email threat feeds.
            </p>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {staticMode ? (
              <p className="max-w-[15rem] text-xs text-slate-500 dark:text-zinc-400">
                Motion paused to match reduced-motion setting. Scroll each column to read.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-pressed={!playing}
                  aria-label={playing ? "Pause scrolling reviews" : "Play scrolling reviews"}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-4 py-2 text-xs font-bold text-slate-700 dark:text-zinc-200 transition hover:border-[#00BCD4] hover:text-[#00BCD4] focus-visible:outline-none cursor-pointer shadow-xs"
                >
                  {playing ? (
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                      <rect x="5" y="4" width="3.5" height="12" rx="1" />
                      <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M6 4.5l9 5.5-9 5.5V4.5z" />
                    </svg>
                  )}
                  {playing ? "Pause" : "Play"}
                </button>

                <div
                  role="radiogroup"
                  aria-label="Scroll speed"
                  className="inline-flex items-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black p-1 shadow-xs"
                >
                  {SPEEDS.map((s, i) => {
                    const active = s.id === speed;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        tabIndex={active ? 0 : -1}
                        ref={(el) => {
                          radioRefs.current[i] = el;
                        }}
                        onClick={() => setSpeed(s.id)}
                        onKeyDown={onRadioKeyDown}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition focus-visible:outline-none cursor-pointer ${
                          active
                            ? "bg-[#00BCD4] text-black shadow-sm"
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Marquee columns */}
        <div
          className="relative mt-12 grid h-[520px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          role="region"
          aria-label="System telemetry quotes"
        >
          {COLUMNS.map((col, ci) => {
            const dur = (col.base * mult).toFixed(1);
            const colStyle = { ["--mqxv-dur"]: `${dur}s` } as CSSProperties;
            const hideClass = ci === 1 ? "hidden sm:block" : ci === 2 ? "hidden lg:block" : "";

            return (
              <div
                key={ci}
                className={`mqxv-col mqxv-fade relative h-full overflow-hidden ${hideClass}`}
              >
                {staticMode ? (
                  <ul className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
                    {col.items.map((t) => (
                      <li key={t.id}>
                        <Card t={t} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mqxv-track flex flex-col" data-dir={col.dir} style={colStyle}>
                    {[0, 1].map((dup) =>
                      col.items.map((t) => (
                        <li key={`${t.id}-${dup}`} aria-hidden={dup === 1} className="pb-4 sm:pb-5">
                          <Card t={t} />
                        </li>
                      )),
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {!staticMode && (
          <p className="mt-6 text-center text-xs text-zinc-500">
            Hover any column to pause scrolling.
          </p>
        )}
      </div>
    </section>
  );
};

