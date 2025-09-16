// components/weather-particles/Rainy.tsx

"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface RainProps {
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

export const RainParticles = ({ number = 800, minDelay = 0, maxDelay = 12, minDuration = 1, maxDuration = 40, angle = 250, cardWidth = 320, cardHeight = 400, className }: RainProps) => {
  const [rainStyles, setRainStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: `${Math.floor(cardHeight * 0.4 + Math.random() * (cardHeight * 0.5))}px`,
      left: `${Math.floor(Math.random() * cardWidth)}px`,
      animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
      animationDuration: `${Math.random() * (maxDuration - minDuration) + minDuration}s`,
    }));
    setRainStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle, cardWidth, cardHeight]);

  return (
    <>
      {rainStyles.map((style, idx) => (
        <span key={idx} style={style} className={cn("pointer-events-none absolute w-1 h-3 rotate-[var(--angle)] animate-rain rounded-full bg-[#FEFDF6]/80 shadow-[0_0_0_1px_#ffffff10]", className)}>
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 h-[40px] w-1 bg-gradient-to-t from-[#FEFDF6]/80 to-transparent" />
        </span>
      ))}
    </>
  );
};
