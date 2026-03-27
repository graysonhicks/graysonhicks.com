'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect, useCallback } from 'react'
import * as THREE from 'three'

function GridPlane({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const smoothMouse = useRef({ x: 0, y: 0 })

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = clock.getElapsedTime()

      // Smooth lerp toward actual mouse position
      const mx = mouse.current.x
      const my = mouse.current.y
      smoothMouse.current.x += (mx - smoothMouse.current.x) * 0.05
      smoothMouse.current.y += (my - smoothMouse.current.y) * 0.05
      material.uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y)
    }
  })

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#00ffff') },
        uColor2: { value: new THREE.Color('#ff00ff') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Base wave animation
          float wave = sin(pos.x * 2.0 + uTime * 0.5) * 0.15 +
                       cos(pos.y * 2.0 + uTime * 0.3) * 0.15;

          // Mouse ripple: map mouse (-1..1) to grid UV space
          vec2 mouseUV = (uMouse * 0.5 + 0.5);
          float dist = distance(uv, mouseUV);
          float ripple = sin(dist * 14.0 - uTime * 2.0) * exp(-dist * 5.0) * 0.12;

          pos.z += wave + ripple;
          vElevation = wave + ripple;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
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

          // Brighten grid near mouse
          vec2 mouseUV = (uMouse * 0.5 + 0.5);
          float mouseDist = distance(vUv, mouseUV);
          float mouseGlow = exp(-mouseDist * 6.0) * 0.25;
          color += vec3(0.0, mouseGlow * 0.4, mouseGlow * 0.5);

          // Fade at edges
          float fadeX = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
          float fadeY = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          float fade = fadeX * fadeY;

          float alpha = (grid * 0.4 + mouseGlow * 0.15) * fade;
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
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <GridPlane mouse={mouseRef} />
        <FloatingParticles />
        <WireframeRing />
      </Canvas>
    </div>
  )
}
