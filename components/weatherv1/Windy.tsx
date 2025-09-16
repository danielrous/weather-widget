// components/weather-particles/Windy.tsx

"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface WindProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

export const WindParticles = ({ number = 20, minDelay = 0.2, maxDelay = 1.2, minDuration = 2, maxDuration = 10, angle = 0, cardWidth = 320, cardHeight = 400, className }: WindProps) => {
  const [windStyles, setWindStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: `${Math.floor(Math.random() * cardHeight)}px`, // ✅ full card height
      left: `${Math.floor(Math.random() * cardWidth)}px`, // ✅ full card width
      animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
      animationDuration: `${Math.random() * (maxDuration - minDuration) + minDuration}s`,
    }));
    setWindStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle, cardWidth, cardHeight]);

  return (
    <>
      {windStyles.map((style, idx) => (
        <span key={idx} style={style} className={cn("pointer-events-none absolute size-0.5 rotate-[var(--angle)] animate-wind rounded-full bg-slate-300 shadow-[0_0_0_1px_#ffffff10]", className)}>
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-300 to-transparent" />
        </span>
      ))}
    </>
  );
};
