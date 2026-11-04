import React, {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  LayoutDashboard,
  ShieldAlert,
  Inbox,
  Archive,
  UserCheck,
  BarChart3,
  Database,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { SentinelLogo } from "./SentinelLogo";

type NavItem = {
  id: string;
  label: string;
  hint: string;
  path: string;
  badge?: string | number;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    hint: "Real-time security telemetry",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "detector",
    label: "Spam Detector",
    hint: "Live ML text inference studio",
    path: "/detector",
    icon: ShieldAlert,
  },
  {
    id: "history",
    label: "Message Vault",
    hint: "Search & paginate MongoDB docs",
    path: "/history",
    icon: Inbox,
  },
  {
    id: "archive",
    label: "Spam Archive",
    hint: "Isolated quarantine & purge",
    path: "/archive",
    icon: Archive,
  },
  {
    id: "whitelist",
    label: "Whitelist Rules",
    hint: "Pre-emptive filtering policies",
    path: "/whitelist",
    icon: UserCheck,
  },
  {
    id: "analytics",
    label: "Analytics & ML",
    hint: "Confusion matrix & $facet KPIs",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    id: "nosql",
    label: "NoSQL Explorer",
    hint: "Native PyMongo query catalog",
    path: "/nosql",
    icon: Database,
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const uid = useId();
  const navId = `sideicn-nav-${uid}`;

  const [expanded, setExpanded] = useState<boolean>(true);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Find active navigation item based on route
  const currentPath = location.pathname;
  const activeItem =
    NAV_ITEMS.find((item) => item.path === currentPath) ?? NAV_ITEMS[0];

  const moveFocus = (index: number) => {
    setFocusedIndex(index);
    itemRefs.current[index]?.focus();
  };

  const onItemKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const count = NAV_ITEMS.length;
    let next = index;
    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % count;
        break;
      case "ArrowUp":
        next = (index - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  };

  const railTransition = prefersReduced
    ? { duration: 0 }
    : {
        type: "tween" as const,
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      };

  const tooltipMotion = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: -6, scale: 0.96 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -6, scale: 0.96 },
      };

  return (
    <motion.aside
      aria-label="Primary Workspace Navigation"
      initial={false}
      animate={{ width: expanded ? 240 : 72 }}
      transition={railTransition}
      className="relative flex h-full shrink-0 flex-col border-r border-slate-200 dark:border-zinc-800/90 bg-white dark:bg-[#09090b] select-none transition-colors z-20"
    >
      <style>{`
        @keyframes sideicn-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes sideicn-blip {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.35); }
        }
        .sideicn-bar { animation: sideicn-glow 2.6s ease-in-out infinite; }
        .sideicn-dot { animation: sideicn-blip 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sideicn-bar, .sideicn-dot { animation: none; }
        }
      `}</style>

      {/* Brand & Mini Logo Header */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-slate-100 dark:border-zinc-850">
        <SentinelLogo size={32} />
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="brand"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
              transition={{ duration: prefersReduced ? 0 : 0.18 }}
              className="flex flex-col min-w-0"
            >
              <span className="truncate text-sm font-black tracking-tight text-slate-900 dark:text-zinc-100">
                SpamSentinel <span className="text-[#00BCD4]">AI</span>
              </span>
              <span className="truncate text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Threat Intelligence
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Navigation Rail Items */}
      <ul role="list" className="flex flex-1 flex-col gap-1 px-2.5 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.path === activeItem.path;
          const isRevealed = revealedId === item.id && !expanded;
          const Icon = item.icon;

          return (
            <li key={item.id} className="relative">
              <button
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => navigate(item.path)}
                onKeyDown={(event) => onItemKeyDown(event, index)}
                onFocus={() => {
                  setFocusedIndex(index);
                  setRevealedId(item.id);
                }}
                onBlur={() =>
                  setRevealedId((current) => (current === item.id ? null : current))
                }
                onMouseEnter={() => setRevealedId(item.id)}
                onMouseLeave={() =>
                  setRevealedId((current) => (current === item.id ? null : current))
                }
                className={[
                  "group/item relative flex h-11 w-full items-center rounded-xl outline-none transition-colors cursor-pointer",
                  expanded ? "gap-3 px-3.5" : "justify-center px-0",
                  isActive
                    ? "bg-[#00BCD4]/15 text-[#00BCD4] font-bold dark:bg-[#00BCD4]/10 dark:text-[#00BCD4]"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100",
                  "focus-visible:ring-2 focus-visible:ring-[#00BCD4]",
                ].join(" ")}
              >
                {/* Active Indicator Bar */}
                {isActive ? (
                  <motion.span
                    layoutId={`sideicn-indicator-${uid}`}
                    layout={!prefersReduced}
                    transition={railTransition}
                    className="sideicn-bar pointer-events-none absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#00BCD4]"
                    aria-hidden="true"
                  />
                ) : null}

                <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5" />
                  {item.badge && !expanded ? (
                    <span
                      className="sideicn-dot absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#00BCD4] ring-2 ring-white dark:ring-zinc-950"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>

                {/* Inline Label (Expanded Mode) */}
                {expanded ? (
                  <motion.span
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.18 }}
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 text-xs font-semibold"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="flex h-4 min-w-[1.25rem] items-center justify-center rounded-full bg-[#00BCD4] px-1.5 text-[10px] font-bold text-black">
                        {item.badge}
                      </span>
                    ) : null}
                  </motion.span>
                ) : null}
              </button>

              {/* Hover Tooltip (Collapsed Mode) */}
              <AnimatePresence>
                {isRevealed ? (
                  <motion.span
                    role="tooltip"
                    {...tooltipMotion}
                    transition={{ duration: prefersReduced ? 0 : 0.16, ease: "easeOut" }}
                    className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 flex -translate-y-1/2 flex-col rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-left shadow-2xl"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap text-xs font-bold text-white">
                      {item.label}
                      {item.badge ? (
                        <span className="flex h-3.5 min-w-[1rem] items-center justify-center rounded-full bg-[#00BCD4] px-1 text-[9px] font-bold text-black">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="whitespace-nowrap text-[10px] text-zinc-400">
                      {item.hint}
                    </span>
                    <span
                      className="absolute right-full top-1/2 -mr-px h-2 w-2 -translate-y-1/2 rotate-45 rounded-[1px] bg-zinc-900 border-l border-b border-zinc-800"
                      aria-hidden="true"
                    />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Footer / Expand Toggle */}
      <div className="border-t border-slate-100 dark:border-zinc-800/80 p-3 space-y-2">
        {/* Landing Link */}
        <button
          type="button"
          onClick={() => navigate("/landing")}
          className={[
            "flex h-9 w-full items-center rounded-xl text-xs font-semibold text-zinc-500 hover:text-[#00BCD4] hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer",
            expanded ? "gap-2.5 px-3" : "justify-center",
          ].join(" ")}
          title="Open Landing Page"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {expanded && <span>Landing Showcase</span>}
        </button>

        {/* Expand / Collapse Button */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={navId}
          aria-label={expanded ? "Collapse sidebar rail" : "Expand sidebar rail"}
          className={[
            "flex h-9 w-full items-center rounded-xl text-xs font-semibold text-zinc-500 hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer",
            expanded ? "gap-2.5 px-3" : "justify-center",
          ].join(" ")}
        >
          <ChevronRight
            className={[
              "h-4 w-4 shrink-0 transition-transform duration-300",
              expanded ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
          {expanded && <span>Collapse Rail</span>}
        </button>
      </div>

      <span id={navId} className="sr-only">
        Workspace rail navigation, {expanded ? "expanded" : "collapsed"}
      </span>
    </motion.aside>
  );
};
