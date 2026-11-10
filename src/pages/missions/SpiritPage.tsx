import { useRef } from 'react'
import * as THREE from 'three'
import MissionPage from '../../components/missions/MissionPage'
import { getMissionById } from '../../data/missions'
import { getSolarPanelTexture, getGoldFoilTexture } from '../../utils/proceduralTextures'

/**
 * Spirit Rover 3D Model
 * Visually stationary showcase on the Martian surface at Gusev Crater.
 * Featuring the historical jammed front-right wheel dragging a bright silica trench
 * at Home Plate, and the Columbia Hills memorial plaque.
 */
function SpiritModel() {
  const groupRef = useRef<THREE.Group>(null)

  const solarTex = getSolarPanelTexture()
  const goldTex = getGoldFoilTexture()

  const metalMat = { color: '#cbd5e1', metalness: 0.8, roughness: 0.3 }
  const darkMat = { color: '#1e293b', metalness: 0.9, roughness: 0.25 }
  const wheelMat = { color: '#475569', metalness: 0.85, roughness: 0.35 }
  const goldMetal = { color: '#d97706', metalness: 0.7, roughness: 0.3 }

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0, -0.35, 0]}>
      {/* === WARM ELECTRONICS BOX (WEB) === */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1.2, 0.45, 1.4]} />
        <meshStandardMaterial
          map={goldTex}
          bumpMap={goldTex}
          bumpScale={0.06}
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Dust-Tinged Top Deck */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[1.24, 0.04, 1.44]} />
        <meshStandardMaterial {...metalMat} color="#947158" />
      </mesh>

      {/* === DUST-ACCUMULATED SOLAR ARRAY DECK === */}
      {/* Center Solar Panel */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.4, 0.03, 1.6]} />
        <meshStandardMaterial map={solarTex} metalness={0.5} roughness={0.45} />
      </mesh>
      {/* Left Wing Solar Panel */}
      <mesh position={[-1.0, 0.12, 0.1]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.7, 0.03, 1.2]} />
        <meshStandardMaterial map={solarTex} metalness={0.5} roughness={0.45} />
      </mesh>
      {/* Right Wing Solar Panel */}
      <mesh position={[1.0, 0.12, 0.1]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.7, 0.03, 1.2]} />
        <meshStandardMaterial map={solarTex} metalness={0.5} roughness={0.45} />
      </mesh>
      {/* Rear Batwing Solar Flap */}
      <mesh position={[0, 0.12, -1.05]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[1.1, 0.03, 0.6]} />
        <meshStandardMaterial map={solarTex} metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Translucent Layer of Martian Atmospheric Red Dust Coating the Solar Cells */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[2.5, 0.005, 2.5]} />
        <meshStandardMaterial
          color="#9a3412"
          transparent
          opacity={0.32}
          roughness={1.0}
        />
      </mesh>

      {/* === ROCKER-BOGIE SUSPENSION SYSTEM === */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.68, -0.25, 0]}>
          <mesh rotation={[0, 0, side * 0.1]}>
            <boxGeometry args={[0.08, 0.08, 1.5]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>
          <mesh position={[0, -0.15, -0.45]}>
            <boxGeometry args={[0.07, 0.07, 0.8]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.14, 16]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
        </group>
      ))}

      {/* === 6 WHEELS — FRONT-RIGHT WHEEL BROKEN/JAMMED === */}
      {[
        [-0.95, -0.65, 0.75, false],  // Front Left (Healthy)
        [0.95, -0.65, 0.75, true],    // Front Right (JAMMED AT HOME PLATE!)
        [-1.05, -0.65, 0.0, false],   // Middle Left
        [1.05, -0.65, 0.0, false],    // Middle Right
        [-0.95, -0.65, -0.75, false], // Rear Left
        [0.95, -0.65, -0.75, false],  // Rear Right
      ].map(([x, y, z, isBroken], i) => (
        <group
          key={i}
          position={[x as number, y as number, z as number]}
          rotation={[0, isBroken ? 0.45 : 0, 0]} // Angled dragging wheel!
        >
          {/* Wheel Drum */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial
              {...wheelMat}
              color={isBroken ? '#78350f' : '#475569'}
            />
          </mesh>
          {/* Flexure Spokes */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.16, 12]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>
          {/* Hub Motor */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.19, 12]} />
            <meshStandardMaterial {...goldMetal} />
          </mesh>
        </group>
      ))}

      {/* === ACCIDENTAL DISCOVERY: TRENCH EXPOSING BRIGHT WHITE SILICA SOIL === */}
      {/* The broken front-right wheel gouged into the crust and revealed 90% pure silica */}
      <group position={[0.95, -0.78, 0.2]}>
        {/* Dragged Trench Excavation */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.45, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        {/* Exposed White/Cream Hydrothermal Silica Deposits */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.28, 16]} />
          <meshStandardMaterial color="#fef08a" roughness={0.85} />
        </mesh>
      </group>

      {/* === PANCAM MAST ASSEMBLY (POINTING TOWARD COLUMBIA HILLS) === */}
      <group position={[0.22, 0.14, 0.55]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 1.1, 6]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>

        <group position={[0, 1.15, 0]} rotation={[0, 0.15, 0]}>
          <mesh>
            <boxGeometry args={[0.24, 0.12, 0.14]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>

          {/* Stereo Panoramic Cameras */}
          {[-0.08, 0.08].map((x, ci) => (
            <group key={ci} position={[x, 0, 0.08]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.035, 0.08, 16]} />
                <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Robotic Arm (IDD) Sample Tool */}
      <group position={[-0.35, -0.2, 0.75]}>
        <mesh position={[0, 0.25, 0.3]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.6, 8]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
      </group>

      {/* Columbia Memorial Station Commemorative Plaque on HGA */}
      <group position={[-0.32, 0.32, -0.45]} rotation={[-0.3, 0.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.05, 0.08, 24]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
        {/* Memorial Plaque to STS-107 Columbia Crew */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.15, 0.12, 0.02]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.8} />
        </mesh>
      </group>

      {/* Spirit Mars Accent Light */}
      <pointLight color="#ef4444" intensity={2.2} distance={8} position={[0, 2.5, 0]} />
    </group>
  )
}

export default function SpiritPage() {
  const mission = getMissionById('spirit')!
  return <MissionPage mission={mission} model3D={<SpiritModel />} />
}
