import React from "react";

const cx = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

export interface ShimmerButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#00BCD4",
      shimmerSize = "0.08em",
      shimmerDuration = "3s",
      borderRadius = "14px",
      background = "rgba(9, 9, 11, 1)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <>
        <button
          ref={ref}
          style={
            {
              "--spread": "90deg",
              "--shimmer-color": shimmerColor,
              "--radius": borderRadius,
              "--speed": shimmerDuration,
              "--cut": shimmerSize,
              "--bg": background,
            } as React.CSSProperties
          }
          className={cx(
            "group relative z-0 flex transform-gpu cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white transition-transform duration-300 ease-in-out [background:var(--bg)] [border-radius:var(--radius)] active:translate-y-px",
            className,
          )}
          {...props}
        >
          {/* spark container */}
          <div className="si-shimmer-container absolute inset-0 -z-30 overflow-visible blur-[2px]">
            {/* spark */}
            <div className="si-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none">
              {/* spark gradient */}
              <div
                className="si-shimmer-spin absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]"
                style={{ translate: "0 0" }}
              />
            </div>
          </div>

          {children}

          {/* inner highlight */}
          <div className="absolute inset-0 size-full transform-gpu rounded-2xl shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />

          {/* backdrop */}
          <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
        </button>
        <style>{`
          .si-shimmer-container { container-type: size; }
          .si-shimmer-slide { animation: si-shimmer-slide var(--speed) ease-in-out infinite alternate; }
          .si-shimmer-spin { animation: si-shimmer-spin calc(var(--speed) * 2) infinite linear; }
          @keyframes si-shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
          @keyframes si-shimmer-spin {
            0% { transform: translateZ(0) rotate(0); }
            15%, 35% { transform: translateZ(0) rotate(90deg); }
            65%, 85% { transform: translateZ(0) rotate(270deg); }
            100% { transform: translateZ(0) rotate(360deg); }
          }
        `}</style>
      </>
    );
  },
);
ShimmerButton.displayName = "ShimmerButton";
