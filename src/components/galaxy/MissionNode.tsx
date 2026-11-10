import { useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import type { Mission } from '../../data/missions'

interface MissionNodeProps {
  mission: Mission
}

export default function MissionNode({ mission }: MissionNodeProps) {
  const navigate = useNavigate()
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = mission.position[1] + Math.sin(t * 0.8 + mission.position[0]) * 0.3
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.08
      glowRef.current.scale.setScalar(hovered ? scale * 1.3 : scale)
    }
  })

  const color = new THREE.Color(mission.color)
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    navigate(`/mission/${mission.slug}`)
  }

  return (
    <group
      ref={groupRef}
      position={mission.position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={mission.color}
          emissive={mission.color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial
          color={mission.color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshBasicMaterial
          color={mission.color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 64]} />
        <meshBasicMaterial
          color={mission.accentColor}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point light */}
      <pointLight color={mission.color} intensity={hovered ? 3 : 1.5} distance={8} />

      {/* HTML label */}
      <Html
        position={[0, 1.8, 0]}
        center
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-110' : 'opacity-70 scale-100'}`}
          style={{ width: 160, textAlign: 'center' }}
        >
          <div
            className="text-sm font-bold tracking-widest mb-1"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: mission.color,
              textShadow: `0 0 12px ${mission.color}`,
            }}
          >
            {mission.name}
          </div>
          {hovered && (
            <div
              className="text-xs text-gray-300 glass rounded-lg px-2 py-1 border border-white/10"
              style={{ fontSize: 10, lineHeight: 1.4 }}
            >
              {mission.subtitle}
              <div className="mt-1 text-yellow-400 text-xs">Click to explore →</div>
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
