'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#00ffff') },
        uColor2: { value: new THREE.Color('#ff00ff') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin(pos.x * 2.0 + uTime * 0.5) * 0.15 +
                       cos(pos.y * 2.0 + uTime * 0.3) * 0.15;
          pos.z += wave;
          vElevation = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Grid lines
          float gridX = smoothstep(0.95, 1.0, fract(vUv.x * 30.0)) + smoothstep(0.05, 0.0, fract(vUv.x * 30.0));
          float gridY = smoothstep(0.95, 1.0, fract(vUv.y * 30.0)) + smoothstep(0.05, 0.0, fract(vUv.y * 30.0));
          float grid = max(gridX, gridY);

          // Color gradient based on elevation
          vec3 color = mix(uColor1, uColor2, vElevation * 2.0 + 0.5);

          // Fade at edges
          float fadeX = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
          float fadeY = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          float fade = fadeX * fadeY;

          float alpha = grid * 0.4 * fade;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
    }),
    []
  )

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -3]}>
      <planeGeometry args={[20, 20, 60, 60]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  )
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02
      const posArray = pointsRef.current.geometry.attributes.position
        .array as Float32Array
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(clock.getElapsedTime() * 0.5 + i) * 0.001
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function WireframeRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={[4, 1, -5]}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshBasicMaterial color="#ff00ff" transparent opacity={0.2} />
    </mesh>
  )
}

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <GridPlane />
        <FloatingParticles />
        <WireframeRing />
      </Canvas>
    </div>
  )
}
