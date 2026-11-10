import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function NebulaSphere({
  position,
  color,
  radius,
  opacity,
  rotSpeed,
}: {
  position: [number, number, number]
  color: string
  radius: number
  opacity: number
  rotSpeed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * rotSpeed * 0.3
      meshRef.current.rotation.y = clock.getElapsedTime() * rotSpeed
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Nebula() {
  return (
    <group>
      <NebulaSphere position={[-30, 10, -60]} color="#6b21a8" radius={40} opacity={0.08} rotSpeed={0.003} />
      <NebulaSphere position={[40, -15, -50]} color="#1d4ed8" radius={35} opacity={0.07} rotSpeed={-0.002} />
      <NebulaSphere position={[0, 20, -80]} color="#0d9488" radius={50} opacity={0.05} rotSpeed={0.001} />
      <NebulaSphere position={[-50, -20, -40]} color="#7c3aed" radius={30} opacity={0.06} rotSpeed={0.004} />
      <NebulaSphere position={[60, 5, -70]} color="#1e40af" radius={45} opacity={0.04} rotSpeed={-0.003} />
    </group>
  )
}
