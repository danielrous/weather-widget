// components/weather-particles/Sunny.tsx

"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface SunnyProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

export const SunnyParticles = ({ number = 600, minDelay = 0.2, maxDelay = 1.5, minDuration = 4, maxDuration = 100, cardWidth = 320, cardHeight = 400, className }: SunnyProps) => {
  const [sunnyStyles, setSunnyStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": `${Math.floor(Math.random() * 360)}deg`,
      top: `${Math.floor(Math.random() * cardHeight)}px`,
      left: `${Math.floor(Math.random() * cardWidth)}px`,
      animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
      animationDuration: `${Math.random() * (maxDuration - minDuration) + minDuration}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setSunnyStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, cardWidth, cardHeight]);

  return (
    <>
      {sunnyStyles.map((style, idx) => (
        <span key={idx} style={style} className={cn("pointer-events-none absolute size-1.5 animate-sunny rounded-full bg-[#F5BA3C] blur-[1px]", className)}></span>
      ))}
    </>
  );
};
