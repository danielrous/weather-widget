"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Streak = {
  id: number;
  x: number;
  y: number;
};

export default function WindStreaks({ clickX, clickY }: { clickX: number; clickY: number }) {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    if (clickX === null || clickY === null) return;

    const newStreaks = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + Math.random(),
      x: clickX + Math.random() * 20 - 10,
      y: clickY + Math.random() * 20 - 10,
    }));

    setStreaks((prev) => [...prev, ...newStreaks]);

    const timeout = setTimeout(() => {
      setStreaks((prev) => prev.slice(newStreaks.length));
    }, 600);

    return () => clearTimeout(timeout);
  }, [clickX, clickY]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {streaks.map(({ id, x, y }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x, y, scaleX: 0.2, rotate: Math.random() * 20 - 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: x + 80, scaleX: 1, filter: "blur(4px)" }}
            exit={{ opacity: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute h-4 w-16 bg-white/20"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
