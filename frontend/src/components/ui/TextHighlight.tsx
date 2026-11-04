import React, { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export type HueKey = "cyan" | "amber" | "emerald" | "sky" | "rose" | "violet" | "indigo";

interface MarkProps {
  children: ReactNode;
  hue?: HueKey;
  delay?: number;
  className?: string;
}

export const Mark: React.FC<MarkProps> = ({
  children,
  delay = 0.2,
  className = "",
}) => {
  const reduceRaw = useReducedMotion();
  const reduce = !!reduceRaw;

  return (
    <span className={`relative inline-block px-1.5 align-baseline ${className}`}>
      {/* Hand-drawn SVG swoop underline */}
      <svg
        aria-hidden="true"
        viewBox="0 0 250 20"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-1.5 left-0 w-full h-[14px] text-[#00BCD4] drop-shadow-[0_0_8px_rgba(0,188,212,0.8)] z-0"
      >
        <motion.path
          d="M 3 14 Q 70 4, 130 11 T 247 9"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  pathLength: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  opacity: { delay, duration: 0.3 },
                }
          }
        />
      </svg>
      {/* High-visibility marker glow background */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-1 h-3 rounded bg-[#00BCD4]/25 blur-[3px] -z-10"
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        style={{ transformOrigin: "left center" }}
        transition={reduce ? { duration: 0 } : { delay, duration: 0.7, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};
