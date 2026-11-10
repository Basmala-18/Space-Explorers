import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SpaceshipProps {
  velocityRef: React.MutableRefObject<THREE.Vector3>
  yawRef: React.MutableRefObject<number>
  pitchRef: React.MutableRefObject<number>
  rollRef: React.MutableRefObject<number>
  thrustRef: React.MutableRefObject<number>
  isBoostingRef: React.MutableRefObject<boolean>
  positionRef: React.MutableRefObject<THREE.Vector3>
}

export default function Spaceship({
  velocityRef,
  yawRef,
  pitchRef,
  rollRef,
  thrustRef,
  isBoostingRef,
  positionRef,
}: SpaceshipProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const baseY = useRef(0)
  const flameL = useRef<THREE.Mesh>(null)
  const flameR = useRef<THREE.Mesh>(null)
  const lightL = useRef<THREE.PointLight>(null)
  const lightR = useRef<THREE.PointLight>(null)
  const boostLight = useRef<THREE.PointLight>(null)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, 0)
    }
  }, [])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return
    const dt = Math.min(delta, 0.1)
    const t = clock.getElapsedTime()

    // Move ship with velocity * dt
    const vel = velocityRef.current
    groupRef.current.position.x += vel.x * dt
    groupRef.current.position.z += vel.z * dt
    baseY.current += vel.y * dt

    // World boundary clamp with smooth bounce/padding
    const BOUNDS_HORIZ = 34
    const BOUNDS_VERT_MIN = -5.0
    const BOUNDS_VERT_MAX = 14.0

    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -BOUNDS_HORIZ, BOUNDS_HORIZ)
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -BOUNDS_HORIZ, BOUNDS_HORIZ)
    baseY.current = THREE.MathUtils.clamp(baseY.current, BOUNDS_VERT_MIN, BOUNDS_VERT_MAX)

    // Smooth hover float relative to actual 3D altitude
    groupRef.current.position.y = baseY.current + Math.sin(t * 1.8) * 0.08

    // Update shared position ref for camera and HUD
    positionRef.current.copy(groupRef.current.position)

    // Apply smooth yaw heading
    groupRef.current.rotation.y = yawRef.current

    // Apply banking roll and pitch to body
    if (bodyRef.current) {
      bodyRef.current.rotation.z = rollRef.current
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, pitchRef.current, 8.0 * dt)
    }

    // Dynamic engine exhaust flare
    const thrust = thrustRef.current
    const isBoosting = isBoostingRef.current
    const flicker = 1.0 + Math.sin(t * 40) * 0.15
    const exhaustLen = (0.5 + thrust * 2.2 * (isBoosting ? 1.8 : 1.0)) * flicker

    if (flameL.current && flameR.current) {
      flameL.current.scale.set(thrust * (isBoosting ? 1.4 : 1.0), exhaustLen, thrust * (isBoosting ? 1.4 : 1.0))
      flameR.current.scale.set(thrust * (isBoosting ? 1.4 : 1.0), exhaustLen, thrust * (isBoosting ? 1.4 : 1.0))
    }

    const lightIntensity = thrust * (isBoosting ? 6.0 : 3.0) * flicker
    if (lightL.current) lightL.current.intensity = lightIntensity
    if (lightR.current) lightR.current.intensity = lightIntensity
    if (boostLight.current) boostLight.current.intensity = isBoosting ? 5.0 : 0.0
  })

  // Visual Materials
  const hullMat = { color: '#e2e8f0', metalness: 0.88, roughness: 0.2 }
  const trimMat = { color: '#0f172a', metalness: 0.92, roughness: 0.18 }
  const wingMat = { color: '#0284c7', metalness: 0.75, roughness: 0.25 }
  const glassMat = { color: '#38bdf8', metalness: 0.15, roughness: 0.04, transparent: true, opacity: 0.78 }
  const nozzleMat = { color: '#334155', metalness: 0.95, roughness: 0.15 }

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* === MAIN FUSELAGE === */}
        {/* Center Hull */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.26, 1.4, 8, 20]} />
          <meshStandardMaterial {...hullMat} />
        </mesh>

        {/* Sharp Cockpit Nose Cone */}
        <mesh position={[0, 0, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 0.85, 20]} />
          <meshStandardMaterial {...hullMat} color="#94a3b8" />
        </mesh>

        {/* Cockpit Canopy Glass */}
        <mesh position={[0, 0.22, -0.32]} rotation={[-0.1, 0, 0]}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial {...glassMat} />
        </mesh>

        {/* Cockpit Interior Pilot Console */}
        <mesh position={[0, 0.12, -0.3]}>
          <boxGeometry args={[0.16, 0.08, 0.25]} />
          <meshStandardMaterial color="#0f172a" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>

        {/* Upper Spine Structure */}
        <mesh position={[0, 0.26, 0.15]}>
          <boxGeometry args={[0.1, 0.12, 1.1]} />
          <meshStandardMaterial {...trimMat} />
        </mesh>

        {/* === SWEPT DELTA WINGS === */}
        {/* Left Main Wing */}
        <mesh position={[-0.95, -0.04, 0.15]} rotation={[0.08, 0, -0.1]}>
          <boxGeometry args={[1.2, 0.04, 0.8]} />
          <meshStandardMaterial {...wingMat} />
        </mesh>
        {/* Left Wing Leading Edge Inset */}
        <mesh position={[-0.85, -0.03, -0.15]} rotation={[0.08, 0.2, -0.1]}>
          <boxGeometry args={[1.0, 0.05, 0.12]} />
          <meshStandardMaterial {...trimMat} />
        </mesh>
        {/* Left Winglet Fin */}
        <mesh position={[-1.52, 0.16, 0.2]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.06, 0.42, 0.5]} />
          <meshStandardMaterial {...wingMat} />
        </mesh>

        {/* Right Main Wing */}
        <mesh position={[0.95, -0.04, 0.15]} rotation={[-0.08, 0, 0.1]}>
          <boxGeometry args={[1.2, 0.04, 0.8]} />
          <meshStandardMaterial {...wingMat} />
        </mesh>
        {/* Right Wing Leading Edge Inset */}
        <mesh position={[0.85, -0.03, -0.15]} rotation={[-0.08, -0.2, 0.1]}>
          <boxGeometry args={[1.0, 0.05, 0.12]} />
          <meshStandardMaterial {...trimMat} />
        </mesh>
        {/* Right Winglet Fin */}
        <mesh position={[1.52, 0.16, 0.2]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.06, 0.42, 0.5]} />
          <meshStandardMaterial {...wingMat} />
        </mesh>

        {/* Vertical Stabilizer Tail Fin */}
        <mesh position={[0, 0.42, 0.45]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.05, 0.48, 0.6]} />
          <meshStandardMaterial {...wingMat} />
        </mesh>

        {/* === TWIN ION ENGINES === */}
        {/* Left Engine Nacelle */}
        <mesh position={[-0.55, -0.04, 0.65]}>
          <cylinderGeometry args={[0.13, 0.11, 0.85, 16]} />
          <meshStandardMaterial {...trimMat} />
        </mesh>
        <mesh position={[-0.55, -0.04, 1.1]}>
          <cylinderGeometry args={[0.11, 0.15, 0.14, 16]} />
          <meshStandardMaterial {...nozzleMat} />
        </mesh>

        {/* Right Engine Nacelle */}
        <mesh position={[0.55, -0.04, 0.65]}>
          <cylinderGeometry args={[0.13, 0.11, 0.85, 16]} />
          <meshStandardMaterial {...trimMat} />
        </mesh>
        <mesh position={[0.55, -0.04, 1.1]}>
          <cylinderGeometry args={[0.11, 0.15, 0.14, 16]} />
          <meshStandardMaterial {...nozzleMat} />
        </mesh>

        {/* === ENGINE EXHAUST PLASMA FLARES === */}
        {/* Left Flame Cone */}
        <mesh ref={flameL} position={[-0.55, -0.04, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 1.0, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Right Flame Cone */}
        <mesh ref={flameR} position={[0.55, -0.04, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 1.0, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Plasma Glow Lights */}
        <pointLight ref={lightL} position={[-0.55, -0.04, 1.3]} color="#38bdf8" distance={6} />
        <pointLight ref={lightR} position={[0.55, -0.04, 1.3]} color="#38bdf8" distance={6} />
        <pointLight ref={boostLight} position={[0, 0, 1.4]} color="#a855f7" distance={8} />

        {/* Wingtip Navigation Lights */}
        <mesh position={[-1.52, 0.35, 0.2]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[1.52, 0.35, 0.2]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        {/* RCS Attitude Thruster Blocks (Front & Rear) */}
        {[
          [-0.26, 0, -0.6],
          [0.26, 0, -0.6],
          [-0.26, 0, 0.6],
          [0.26, 0, 0.6],
        ].map(([rx, ry, rz], rci) => (
          <mesh key={rci} position={[rx, ry, rz]}>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial {...trimMat} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
