import React, { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export type HueKey = "cyan" | "amber" | "emerald" | "sky" | "rose" | "violet";
export type StyleKey = "marker" | "underline" | "box";

export type Hue = {
  key: HueKey;
  label: string;
  dot: string;
  mark: string;
  line: string;
  stroke: string;
};

export const HUES: Record<HueKey, Hue> = {
  cyan: {
    key: "cyan",
    label: "Cyan",
    dot: "bg-cyan-400",
    mark: "bg-cyan-400/25 dark:bg-cyan-400/20",
    line: "bg-[#00BCD4] dark:bg-[#00BCD4]/90",
    stroke: "text-[#00BCD4] dark:text-[#00BCD4]",
  },
  amber: {
    key: "amber",
    label: "Amber",
    dot: "bg-amber-400",
    mark: "bg-amber-300/70 dark:bg-amber-300/30",
    line: "bg-amber-400 dark:bg-amber-400/80",
    stroke: "text-amber-500 dark:text-amber-300",
  },
  emerald: {
    key: "emerald",
    label: "Emerald",
    dot: "bg-emerald-400",
    mark: "bg-emerald-300/70 dark:bg-emerald-300/25",
    line: "bg-emerald-400 dark:bg-emerald-400/80",
    stroke: "text-emerald-500 dark:text-emerald-300",
  },
  sky: {
    key: "sky",
    label: "Sky",
    dot: "bg-sky-400",
    mark: "bg-sky-300/70 dark:bg-sky-300/25",
    line: "bg-sky-400 dark:bg-sky-400/80",
    stroke: "text-sky-500 dark:text-sky-300",
  },
  rose: {
    key: "rose",
    label: "Rose",
    dot: "bg-rose-400",
    mark: "bg-rose-300/70 dark:bg-rose-300/25",
    line: "bg-rose-400 dark:bg-rose-400/80",
    stroke: "text-rose-500 dark:text-rose-300",
  },
  violet: {
    key: "violet",
    label: "Violet",
    dot: "bg-violet-400",
    mark: "bg-violet-300/70 dark:bg-violet-300/30",
    line: "bg-violet-400 dark:bg-violet-400/80",
    stroke: "text-violet-500 dark:text-violet-300",
  },
};

interface MarkProps {
  children: ReactNode;
  hue?: HueKey;
  styleKey?: StyleKey;
  delay?: number;
  className?: string;
}

export const Mark: React.FC<MarkProps> = ({
  children,
  hue = "cyan",
  styleKey = "underline",
  delay = 0.2,
  className = "",
}) => {
  const reduceRaw = useReducedMotion();
  const reduce = !!reduceRaw;
  const currentHue = HUES[hue] || HUES.cyan;

  return (
    <span className={`relative inline-block whitespace-nowrap px-[0.12em] align-baseline ${className}`}>
      {styleKey === "box" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          className={`pointer-events-none absolute left-[-0.35em] top-[-0.2em] h-[calc(100%+0.4em)] w-[calc(100%+0.7em)] ${currentHue.stroke}`}
        >
          <motion.rect
            x="4"
            y="6"
            width="92"
            height="88"
            rx="14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    pathLength: { delay, duration: 0.8, ease: "easeInOut" },
                    opacity: { delay, duration: 0.2 },
                  }
            }
          />
        </svg>
      ) : (
        <motion.span
          aria-hidden="true"
          className={
            styleKey === "underline"
              ? `pointer-events-none absolute bottom-[0.04em] left-0 right-0 h-[0.24em] rounded-full ${currentHue.line}`
              : `pointer-events-none absolute inset-y-[0.05em] left-[-0.1em] right-[-0.1em] rounded-[0.25em] ${currentHue.mark}`
          }
          style={{ transformOrigin: "left center" }}
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { delay, duration: 0.55, ease: "circOut" }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </span>
  );
};
