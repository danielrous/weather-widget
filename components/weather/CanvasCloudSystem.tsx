// canvas-cloud-system.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CloudGroup } from "./CloudGroup";

interface CloudSystemProps {
  numberOfClouds?: number;
  showRain?: boolean;
  width?: number;
  height?: number;
  onCloudClick?: (x: number, y: number) => void; // 👈
}

export default function CanvasCloudSystem({ numberOfClouds = 10, showRain = true, onCloudClick }: CloudSystemProps) {
  // Ref to the DOM wrapper that will contain the canvas
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Stores the current dimensions of the wrapper — used to scale the cloud system
  const [size, setSize] = useState({ width: 320, height: 400 });
  // Stores the mouse position in normalized WebGL coordinates (X: -1 to 1, Y: -1 to 1)
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());

  // Resize observer keeps the canvas in sync with the actual container size
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    // Updates state with the current wrapper dimensions
    const updateSize = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize(); // Initial size set
    // Listen for any size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    // Clean up on unmount
    return () => resizeObserver.disconnect();
  }, []);

  return (
    // Container div that wraps the canvas and listens to mouse movements
    <div
      ref={wrapperRef}
      className="absolute inset-0"
      onMouseMove={(e) => {
        // Convert mouse position to normalized device coordinates (NDC)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mouse.current.set(x, y);
      }}
    >
      {/* R3F Canvas — using orthographic projection to keep cloud layout clean and flat */}
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 100] }} style={{ width: "100%", height: "100%", background: "transparent" }}>
        {/* Soft ambient light */}
        <ambientLight intensity={0.7} />
        {/* Directional light to give slight shadow/highlight to cloud boxes */}
        <directionalLight position={[0, 0, 5]} intensity={1.5} />

        {/* The group of clouds */}
        <CloudGroup
          count={numberOfClouds}
          showRain={showRain}
          bounds={{
            width: size.width / 30, // Scale to fit cloud count to canvas size
            height: size.height / 30,
          }}
          mouse={mouse}
          onCloudClick={onCloudClick} // Pass down click handler
        />
      </Canvas>
    </div>
  );
}
