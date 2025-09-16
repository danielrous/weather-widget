"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { RainParticles } from "./Rainy";

interface CloudyProps {
  number?: number;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
  raininess?: number; // ← NEW: value between 0 and 1
}

type Cloud = {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export const CloudyParticles = ({
  number = 20,
  cardWidth = 320,
  cardHeight = 400,
  className,
  raininess = 0, // ← NEW default
}: CloudyProps) => {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const newClouds: Cloud[] = [...Array(number)].map((_, i) => ({
      id: i,
      top: Math.floor(Math.random() * (cardHeight * 0.3)),
      left: Math.floor(Math.random() * cardWidth),
      width: Math.random() * 150 + 50,
      height: Math.random() * 50 + 30,
      opacity: Math.random() * 0.4 + 0.3,
      x: 0,
      y: 0,
      vx: Math.random() * 0.5 + 0.2,
      vy: 0,
    }));
    setClouds(newClouds);
  }, [number, cardWidth, cardHeight]);

  useEffect(() => {
    const animate = () => {
      setClouds((prev) =>
        prev.map((cloud) => {
          const nextX = cloud.x + cloud.vx;
          const nextY = cloud.y + cloud.vy;

          const isOffRight = cloud.left + nextX > cardWidth + 100;
          const isOffLeft = cloud.left + nextX < -200;
          const isOffBottom = cloud.top + nextY > cardHeight + 100;
          const isOffTop = cloud.top + nextY < -200;

          if (isOffRight || isOffLeft || isOffBottom || isOffTop) {
            const newLeft = -200;
            const newTop = Math.floor(Math.random() * (cardHeight * 0.3));
            const newWidth = Math.random() * 150 + 50;
            const newHeight = Math.random() * 50 + 30;
            const newOpacity = Math.random() * 0.4 + 0.3;
            const newVx = Math.random() * 0.5 + 0.2;
            const newVy = 0;

            return {
              ...cloud,
              left: newLeft, // ✅ place offscreen left
              top: newTop,
              width: newWidth,
              height: newHeight,
              opacity: newOpacity,
              x: 0, // ✅ reset movement
              y: 0,
              vx: newVx,
              vy: newVy,
            };
          }

          return {
            ...cloud,
            x: nextX,
            y: nextY,
          };
        })
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [cardWidth, cardHeight]);

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - bounds.left;
    const hoverY = e.clientY - bounds.top;

    setClouds((prev) =>
      prev.map((cloud) => {
        const dx = cloud.left + cloud.x - hoverX;
        const dy = cloud.top + cloud.y - hoverY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          const angle = Math.atan2(dy, dx);
          const pushMagnitude = 0.05;
          return {
            ...cloud,
            vx: cloud.vx + Math.cos(angle) * pushMagnitude,
            vy: cloud.vy + Math.sin(angle) * pushMagnitude,
          };
        }
        return cloud;
      })
    );
  };

  return (
    <div className="absolute inset-0 z-10" onMouseMove={handleHover}>
      {clouds.map((cloud) => {
        const transform = `translate(${cloud.x}px, ${cloud.y}px)`;

        const rainCount = Math.floor((cloud.width / 10) * raininess);

        return (
          <div
            key={cloud.id}
            className={cn("absolute", className)}
            style={{
              top: cloud.top,
              left: cloud.left,
              width: cloud.width,
              height: cloud.height,
              backgroundColor: "rgba(254, 253, 246, 0.8)",
              borderRadius: "9999px",
              opacity: cloud.opacity,
              transform,
              transition: "transform 0.1s linear",
              pointerEvents: "none",
            }}
          >
            {/* Cloud-local rain */}
            {raininess > 0 && (
              <RainParticles
                number={rainCount}
                angle={0}
                minDelay={0}
                maxDelay={2}
                minDuration={1}
                maxDuration={3}
                cardWidth={cloud.width}
                cardHeight={cardHeight - (cloud.top + cloud.height)} // remaining space below
                className="absolute left-0 top-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
