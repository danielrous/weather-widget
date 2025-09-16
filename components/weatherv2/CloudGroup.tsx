import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RainParticles } from "./RainParticles";
import { RoundedBox } from "@react-three/drei";

interface CloudGroupProps {
  count: number; // Number of clouds to render
  showRain: boolean; // Whether to show rain particles or not
  bounds: { width: number; height: number }; // Visual area limits for cloud layout
  mouse?: React.RefObject<THREE.Vector2>; // Optional: current mouse position
  onCloudClick?: (x: number, y: number) => void; // Optional: callback for cloud clicks
}

export const CloudGroup = ({ count, showRain, bounds, mouse, onCloudClick }: CloudGroupProps) => {
  const cloudRefs = useRef<THREE.Mesh[]>([]); // Store references to cloud meshes
  const groupRef = useRef<THREE.Group>(null!); // Transforms or hierarchy

  // Store persistent cloud data like position, velocity, size — only initialized once
  const clouds = useRef<any[]>([]);

  // On first render: generate randomized clouds
  if (clouds.current.length === 0) {
    clouds.current = [...Array(count)].map(() => {
      const sizeFactor = Math.random();

      // Define cloud width and height based on random sizing logic
      const width = sizeFactor < 0.2 ? 1.2 : sizeFactor > 0.8 ? 5.5 : 2.5 + Math.random() * 2.0;
      const height = width * (0.25 + Math.random() * 0.3);
      const radius = Math.min(width, height) * 0.5;

      // Start each cloud from a position off-screen to the left
      const startX = Math.random() * bounds.width + (-bounds.width / 2 - width);

      // Offset to shift all clouds upward by ~20%
      const verticalOffset = bounds.height * 0.2;

      const minY = -bounds.height / 4;
      const maxY = bounds.height / 2;
      const y = Math.random() * (maxY - minY) + minY;

      return {
        width,
        height,
        radius,
        speed: 0.005 + Math.random() * 0.01, // Drift speed (left → right)
        position: new THREE.Vector3(startX, y + verticalOffset, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        targetPosition: null as null | THREE.Vector3,
      };
    });
  }

  const cloudData = clouds.current;

  // Animate each frame
  useFrame(({ camera }) => {
    cloudRefs.current.forEach((mesh, i) => {
      const data = cloudData[i];

      // Drift cloud horizontally over time
      data.position.x += data.speed;

      // Apply any velocity from interaction (click blast), with damping
      data.position.add(data.velocity);
      data.velocity.multiplyScalar(0.98); // Damping factor

      // Update the mesh’s position based on new data
      mesh.position.copy(data.position);

      // If the cloud moves off-screen to the right, wrap it back to the left
      if (data.position.x > bounds.width / 2 + data.width / 2) {
        data.position.x = -bounds.width / 2 - data.width / 2;
        data.position.y = Math.random() * bounds.height - bounds.height / 2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Render each cloud as a RoundedBox mesh */}
      {cloudData.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) cloudRefs.current[i] = el;
          }}
          position={data.position}
          onPointerDown={(e) => {
            e.stopPropagation();

            const x = e.clientX;
            const y = e.clientY;

            // Report the click to the parent for visual effect (e.g. wind streak)
            if (typeof onCloudClick === "function") {
              onCloudClick(x, y);
            }

            // Calculate 3D world coordinate of the click
            const pointerX = e.pointer.x;
            const pointerY = e.pointer.y;
            const camera = e.camera as THREE.OrthographicCamera;
            const sceneMouse = new THREE.Vector3(THREE.MathUtils.lerp(camera.left, camera.right, (pointerX + 1) / 2), THREE.MathUtils.lerp(camera.bottom, camera.top, (pointerY + 1) / 2), 0);

            // Calculate vector away from the click position
            const direction = data.position.clone().sub(sceneMouse).normalize();

            // Apply a "blast" velocity away from the click
            data.velocity.add(direction.multiplyScalar(0.1));
          }}
        >
          <RoundedBox args={[data.width, data.height, 10]} radius={data.radius} smoothness={4}>
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </RoundedBox>
        </mesh>
      ))}

      {/* Show rain particles falling from each cloud */}
      {cloudRefs.current.map((mesh, i) => {
        if (!showRain || !mesh) return null;

        return <RainParticles key={`rain-${i}`} count={12} positionRef={cloudRefs.current[i] && { current: cloudRefs.current[i].position }} spread={cloudData[i]?.width * 0.8} fallHeight={5} />;
      })}
    </group>
  );
};
