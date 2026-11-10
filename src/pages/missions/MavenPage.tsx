import { useRef } from 'react'
import * as THREE from 'three'
import MissionPage from '../../components/missions/MissionPage'
import { getMissionById } from '../../data/missions'
import { getSolarPanelTexture, getGoldFoilTexture } from '../../utils/proceduralTextures'

/**
 * MAVEN Spacecraft 3D Model
 * Visually stationary hero centerpiece of the scene.
 * Showcases detailed octagonal bus core, gull-wing solar arrays,
 * High-Gain parabolic dish, and atmospheric science instruments.
 */
function MAVENModel() {
  const groupRef = useRef<THREE.Group>(null)

  const solarTex = getSolarPanelTexture()
  const goldTex = getGoldFoilTexture()

  const metalMat = { color: '#cbd5e1', metalness: 0.85, roughness: 0.2 }
  const darkMetalMat = { color: '#1e293b', metalness: 0.9, roughness: 0.25 }
  const copperMat = { color: '#b45309', metalness: 0.8, roughness: 0.3 }

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.12, -0.35, 0.05]} scale={1.05}>
      {/* === CENTRAL OCTAGONAL BUS CORE === */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 1.2, 8]} />
        <meshStandardMaterial
          map={goldTex}
          bumpMap={goldTex}
          bumpScale={0.08}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Top Deck Equipment Shelf */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 0.08, 8]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Bottom Propulsion Deck */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.08, 8]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Central Hydrazine Propellant Tank (partially visible) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial {...copperMat} />
      </mesh>

      {/* === ARTICULATED SOLAR ARRAY WINGS === */}
      {/* Left Wing (Y-Wing with gull-wing dihedral) */}
      <group position={[-0.9, 0, 0]}>
        {/* Gimbal Joint & Boom */}
        <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>

        {/* Main Inner Solar Panel */}
        <mesh position={[-1.4, 0, 0]}>
          <boxGeometry args={[1.5, 0.04, 1.1]} />
          <meshStandardMaterial
            map={solarTex}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        {/* Outer Angled Solar Panel (Gull wing angle) */}
        <group position={[-2.15, 0, 0]} rotation={[0, 0, -0.2]}>
          <mesh position={[-0.75, 0, 0]}>
            <boxGeometry args={[1.5, 0.04, 1.1]} />
            <meshStandardMaterial
              map={solarTex}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>

          {/* Magnetometer Boom on Wingtip */}
          <mesh position={[-1.8, 0, 0.4]} rotation={[0, 0.4, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
          <mesh position={[-2.4, 0, 0.6]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Right Wing */}
      <group position={[0.9, 0, 0]}>
        {/* Gimbal Joint & Boom */}
        <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>

        {/* Main Inner Solar Panel */}
        <mesh position={[1.4, 0, 0]}>
          <boxGeometry args={[1.5, 0.04, 1.1]} />
          <meshStandardMaterial
            map={solarTex}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        {/* Outer Angled Solar Panel */}
        <group position={[2.15, 0, 0]} rotation={[0, 0, 0.2]}>
          <mesh position={[0.75, 0, 0]}>
            <boxGeometry args={[1.5, 0.04, 1.1]} />
            <meshStandardMaterial
              map={solarTex}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>

          {/* Wingtip Magnetometer Boom */}
          <mesh position={[1.8, 0, 0.4]} rotation={[0, -0.4, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
          <mesh position={[2.4, 0, 0.6]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* === HIGH-GAIN ANTENNA (HGA) PARABOLIC DISH === */}
      <group position={[0, 0.85, -0.45]} rotation={[0.45, 0, 0]}>
        {/* Articulated Mast */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>
        {/* Parabolic Dish Reflector */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.75, 0.1, 0.22, 32]} />
          <meshStandardMaterial {...metalMat} color="#f8fafc" />
        </mesh>
        {/* Center Feed Horn */}
        <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.35, 12]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>
        {/* Subreflector Cap */}
        <mesh position={[0, 0, -0.42]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.08, 16]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>
      </group>

      {/* === SCIENTIFIC INSTRUMENT SUITE === */}
      {/* IUVS — Imaging Ultraviolet Spectrograph */}
      <group position={[0.4, 0.72, 0.35]}>
        <mesh>
          <boxGeometry args={[0.26, 0.2, 0.32]} />
          <meshStandardMaterial {...darkMetalMat} />
        </mesh>
        {/* Gold Baffle Tube */}
        <mesh position={[0, 0.05, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.18, 16]} />
          <meshStandardMaterial {...copperMat} />
        </mesh>
      </group>

      {/* NGIMS — Neutral Gas and Ion Mass Spectrometer */}
      <group position={[-0.4, 0.72, 0.35]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
      </group>

      {/* STATIC — SupraThermal and Thermal Ion Composition */}
      <mesh position={[0, -0.72, 0.6]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* === REACTION CONTROL SYSTEM (RCS) THRUSTERS === */}
      {/* 4 Corner Thruster Quads with Titanium Nozzles */}
      {[
        [-0.8, -0.45, -0.4],
        [0.8, -0.45, -0.4],
        [-0.8, -0.45, 0.4],
        [0.8, -0.45, 0.4],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshStandardMaterial {...darkMetalMat} />
          </mesh>
          {/* Nozzles pointing in cardinal directions */}
          <mesh position={[0, -0.1, 0]}>
            <coneGeometry args={[0.04, 0.1, 12]} />
            <meshStandardMaterial {...copperMat} />
          </mesh>
        </group>
      ))}

      {/* Spacecraft Studio Illumination */}
      <pointLight color="#38bdf8" intensity={2.0} distance={8} position={[0, 1.8, 2]} />
      <pointLight color="#fde047" intensity={1.2} distance={8} position={[0, -1.5, -2]} />
    </group>
  )
}

export default function MavenPage() {
  const mission = getMissionById('maven')!
  return <MissionPage mission={mission} model3D={<MAVENModel />} />
}
