import { useRef } from 'react'
import * as THREE from 'three'
import MissionPage from '../../components/missions/MissionPage'
import { getMissionById } from '../../data/missions'
import { getSolarPanelTexture, getGoldFoilTexture } from '../../utils/proceduralTextures'

/**
 * Opportunity Rover 3D Model
 * Visually stationary showcase on the Martian surface at Meridiani Planum.
 * Features Rocker-Bogie 6-wheel suspension, RAT abrasion tool, Pancam mast,
 * and the iconic field of hematite blueberries.
 */
function OpportunityModel() {
  const groupRef = useRef<THREE.Group>(null)

  const solarTex = getSolarPanelTexture()
  const goldTex = getGoldFoilTexture()

  const metalMat = { color: '#e2e8f0', metalness: 0.8, roughness: 0.25 }
  const darkMat = { color: '#1e293b', metalness: 0.9, roughness: 0.2 }
  const wheelMat = { color: '#475569', metalness: 0.85, roughness: 0.3 }
  const goldMetal = { color: '#f59e0b', metalness: 0.75, roughness: 0.25 }

  // 6 Wheel positions for Rocker-Bogie system
  const wheelPositions: [number, number, number][] = [
    [-0.95, -0.65, 0.75],  // Front Left
    [0.95, -0.65, 0.75],   // Front Right
    [-1.05, -0.65, 0.0],   // Middle Left
    [1.05, -0.65, 0.0],    // Middle Right
    [-0.95, -0.65, -0.75], // Rear Left
    [0.95, -0.65, -0.75],  // Rear Right
  ]

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0, 0.45, 0]}>
      {/* === WARM ELECTRONICS BOX (WEB) CHASSIS === */}
      {/* Insulated Chassis Body */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1.2, 0.45, 1.4]} />
        <meshStandardMaterial
          map={goldTex}
          bumpMap={goldTex}
          bumpScale={0.06}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Aerogel Insulation Top Deck */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[1.24, 0.04, 1.44]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* === CRUCIFORM SOLAR ARRAY DECK === */}
      {/* Center Solar Panel */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.4, 0.03, 1.6]} />
        <meshStandardMaterial map={solarTex} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Left Wing Solar Panel */}
      <mesh position={[-1.0, 0.12, 0.1]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.7, 0.03, 1.2]} />
        <meshStandardMaterial map={solarTex} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Right Wing Solar Panel */}
      <mesh position={[1.0, 0.12, 0.1]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.7, 0.03, 1.2]} />
        <meshStandardMaterial map={solarTex} metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Rear Batwing Solar Flap */}
      <mesh position={[0, 0.12, -1.05]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[1.1, 0.03, 0.6]} />
        <meshStandardMaterial map={solarTex} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* === ROCKER-BOGIE SUSPENSION SYSTEM === */}
      {/* Left & Right Rocker Arms */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.68, -0.25, 0]}>
          {/* Main Rocker Pivot Bar */}
          <mesh rotation={[0, 0, side * 0.1]}>
            <boxGeometry args={[0.08, 0.08, 1.5]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>
          {/* Differential Bogie Link */}
          <mesh position={[0, -0.15, -0.45]}>
            <boxGeometry args={[0.07, 0.07, 0.8]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
          {/* Suspension Pivot Joint Hub */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.14, 16]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
        </group>
      ))}

      {/* === 6 CLEATED ALUMINUM WHEELS === */}
      {wheelPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Outer Tire Drum with Cleats */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.15, 24]} />
            <meshStandardMaterial {...wheelMat} />
          </mesh>
          {/* Spiral Flexure Hub Spokes */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.16, 12]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>
          {/* Gold In-Hub DC Motor Actuator */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.19, 12]} />
            <meshStandardMaterial {...goldMetal} />
          </mesh>
        </group>
      ))}

      {/* === PANCAM MAST ASSEMBLY (PMA) === */}
      <group position={[0.22, 0.14, 0.55]}>
        {/* Triangular Mast Neck */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 1.1, 6]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>

        {/* Mast Head Pan/Tilt Gimbals */}
        <group position={[0, 1.15, 0]} rotation={[0, 0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.24, 0.12, 0.14]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>

          {/* Stereo Panoramic Cameras (Left & Right Eyes) */}
          {[-0.08, 0.08].map((x, ci) => (
            <group key={ci} position={[x, 0, 0.08]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.035, 0.08, 16]} />
                <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Camera Lens Hood */}
              <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.035, 0.03, 16]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          ))}

          {/* Mini-TES Infrared Periscope Window */}
          <mesh position={[0, -0.04, -0.07]}>
            <boxGeometry args={[0.09, 0.06, 0.04]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* === INSTRUMENT DEPLOYMENT DEVICE (ROBOTIC ARM) === */}
      <group position={[-0.35, -0.2, 0.75]} rotation={[0.1, 0.15, 0]}>
        {/* Shoulder Joint */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
        {/* Upper Bicep Arm Segment */}
        <mesh position={[0, 0.22, 0.15]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
          <meshStandardMaterial {...darkMat} />
        </mesh>
        {/* Forearm Segment */}
        <mesh position={[0, 0.32, 0.52]} rotation={[-0.6, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
        {/* Sensor Turret Head (RAT, Mössbauer, APXS) */}
        <group position={[0, 0.2, 0.72]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 16]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>
          {/* RAT Grinding Bit */}
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* === HIGH-GAIN ANTENNA DISH === */}
      <group position={[-0.32, 0.32, -0.45]} rotation={[-0.3, 0.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.05, 0.08, 24]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.04, 0.1, 12]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* Low-Gain Omni Antenna Mast */}
      <mesh position={[0.45, 0.42, -0.55]}>
        <cylinderGeometry args={[0.015, 0.015, 0.75, 8]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Hazcams (Hazard Avoidance Cameras) on Front Bumper */}
      <group position={[0, -0.3, 0.72]}>
        {[-0.2, 0.2].map((hx, hi) => (
          <mesh key={hi} position={[hx, 0, 0]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.05]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          OPPORTUNITY SIGNATURE: 42.195 KM MARATHON RECORD EMBLEM
      ======================================================== */}
      <group position={[0.48, 0.14, -0.85]} rotation={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================
          HISTORIC DISCOVERY: LAYERED OUTCROP ROCK & RAT BORE HOLE
          (Examined by robotic arm Rock Abrasion Tool)
      ======================================================== */}
      <group position={[-0.45, -0.72, 1.35]}>
        {/* Layered sedimentary Martian outcrop stone */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.7, 0.24, 0.55]} />
          <meshStandardMaterial color="#854d0e" roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Circular Grind Hole carved by diamond RAT drill bit */}
        <mesh position={[0.05, 0.245, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
          <meshStandardMaterial color="#3f1d0b" roughness={0.95} />
        </mesh>
        {/* Freshly exposed interior rock core (lighter gray-tan) */}
        <mesh position={[0.05, 0.246, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.065, 20]} />
          <meshStandardMaterial color="#a8a29e" roughness={0.7} />
        </mesh>
      </group>

      {/* ========================================================
          HISTORIC DISCOVERY: HEMATITE "BLUEBERRIES" FIELD
          (Tiny 4mm gray-blue spherules formed in ancient liquid water)
      ======================================================== */}
      <group position={[-0.2, -0.82, 1.1]}>
        {[
          [-0.35, 0.05, 0.45],
          [-0.22, 0.03, 0.38],
          [-0.15, 0.04, 0.55],
          [-0.05, 0.02, 0.48],
          [0.12, 0.03, 0.42],
          [0.25, 0.02, 0.52],
          [0.32, 0.04, 0.36],
          [-0.42, 0.02, 0.62],
          [0.08, 0.05, 0.65],
          [-0.18, 0.03, 0.72],
          [0.28, 0.03, 0.68],
          [-0.08, 0.18, 0.28], // Embedded in rock strata
          [0.18, 0.16, 0.24],
        ].map(([bx, by, bz], bi) => (
          <mesh key={bi} position={[bx, by, bz]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.75}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Sunset Mars Rim Light */}
      <pointLight color="#f59e0b" intensity={2.2} distance={8} position={[0, 2.5, 0]} />
    </group>
  )
}

export default function OpportunityPage() {
  const mission = getMissionById('opportunity')!
  return <MissionPage mission={mission} model3D={<OpportunityModel />} />
}
