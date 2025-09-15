import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RainParticlesProps {
  count: number;
  positionRef: React.RefObject<THREE.Vector3>;
  spread?: number;
  fallHeight?: number;
}

export const RainParticles = ({ count, positionRef, spread = 1.5, fallHeight = 2.5 }: RainParticlesProps) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const positions = useRef(new Float32Array(count * 3));
  const speeds = useRef(new Float32Array(count));
  const lastOrigin = useRef(new THREE.Vector3());
  const initialOrigin = useRef(new THREE.Vector3());
  const lastCloudPosition = useRef(new THREE.Vector3());

  // Only run once (don't re-run when props change)
  useEffect(() => {
    const origin = lastOrigin.current;

    for (let i = 0; i < count; i++) {
      positions.current[i * 3 + 0] = origin.x + (Math.random() - 0.5) * spread;
      positions.current[i * 3 + 1] = origin.y;
      positions.current[i * 3 + 2] = origin.z + 0.1;

      speeds.current[i] = 0.02 + Math.random() * 0.03;
    }
  }, [count, spread]);

  useEffect(() => {
    const origin = positionRef.current ?? new THREE.Vector3();
    initialOrigin.current.copy(origin);
    lastCloudPosition.current.copy(origin);

    for (let i = 0; i < count; i++) {
      positions.current[i * 3 + 0] = origin.x + (Math.random() - 0.5) * spread;
      positions.current[i * 3 + 1] = origin.y;
      positions.current[i * 3 + 2] = origin.z;

      speeds.current[i] = 0.02 + Math.random() * 0.03;
    }

    if (geometryRef.current) {
      geometryRef.current.setAttribute("position", new THREE.BufferAttribute(positions.current, 3).setUsage(THREE.DynamicDrawUsage));
    }
  }, []);

  useFrame(() => {
    const current = positionRef.current;
    if (!current) return;

    const dx = current.x - lastCloudPosition.current.x;
    const dy = current.y - lastCloudPosition.current.y;

    for (let i = 0; i < count; i++) {
      positions.current[i * 3 + 0] += dx; // follow cloud horizontally
      positions.current[i * 3 + 1] -= speeds.current[i]; // fall downward

      // reset if below fall height
      if (positions.current[i * 3 + 1] < initialOrigin.current.y - fallHeight) {
        positions.current[i * 3 + 1] = current.y;
        positions.current[i * 3 + 0] = current.x + (Math.random() - 0.5) * spread;
      }
    }

    lastCloudPosition.current.copy(current);

    if (geometryRef.current) {
      geometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <pointsMaterial color="#CBD5E1" size={3} sizeAttenuation={false} transparent opacity={0.6} depthWrite={false} />
    </points>
  );
};
