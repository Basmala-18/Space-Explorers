import MissionPage from '../../components/missions/MissionPage'
import { getMissionById } from '../../data/missions'

function LunarRoverModel() {
  const aluminumMat = { color: '#e2e8f0', metalness: 0.85, roughness: 0.25 }
  const darkFrameMat = { color: '#334155', metalness: 0.9, roughness: 0.2 }
  const wireMeshMat = { color: '#94a3b8', metalness: 0.95, roughness: 0.1, wireframe: true }
  const wheelHubMat = { color: '#475569', metalness: 0.85, roughness: 0.3 }
  const seatWebbingMat = { color: '#b45309', metalness: 0.1, roughness: 0.85 } // orange-tan nylon webbing
  const ductTapeMat = { color: '#9ca3af', metalness: 0.4, roughness: 0.6 } // Apollo 17 grey duct tape
  const mapPaperMat = { color: '#fef08a', roughness: 0.9 } // laminated map photo sheets

  // 4 Wire-Mesh Wheels: FL, FR, RL, RR
  const wheels: [number, number, number][] = [
    [-0.88, -0.45, 1.1],  // Front Left
    [0.88, -0.45, 1.1],   // Front Right
    [-0.88, -0.45, -1.1], // Rear Left
    [0.88, -0.45, -1.1],  // Rear Right
  ]

  return (
    <group position={[0, -0.3, 0]} rotation={[0, 0.4, 0]}>
      {/* ========================================================
          TUBULAR ALUMINUM CHASSIS (3-SECTION FOLDING FRAME)
      ======================================================== */}
      {/* Center Longitudinal Frame Rails */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.07, 0.07, 2.7]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
      ))}

      {/* Cross Transverse Tubular Beams */}
      {[-1.0, -0.4, 0.3, 1.0].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <boxGeometry args={[1.25, 0.06, 0.06]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
      ))}

      {/* Center Hinge Folding Joint (used to fold rover inside LM descent stage quad) */}
      <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.28, 16]} />
        <meshStandardMaterial {...darkFrameMat} />
      </mesh>

      {/* Slotted Aluminum Floorboard Platform */}
      <mesh position={[0, 0.04, 0.1]}>
        <boxGeometry args={[1.15, 0.02, 1.35]} />
        <meshStandardMaterial {...aluminumMat} color="#cbd5e1" />
      </mesh>

      {/* ========================================================
          4 WIRE-MESH TITANIUM WHEELS WITH CHEVRON TREADS
      ======================================================== */}
      {wheels.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Outer Titanium Wire Mesh Drum */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
            <meshStandardMaterial {...wireMeshMat} />
          </mesh>

          {/* Solid Inner Wheel Hub Core */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.24, 16]} />
            <meshStandardMaterial {...wheelHubMat} />
          </mesh>

          {/* Quarter-Horsepower DC Electric Drive Motor Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>

          {/* Zinc-Coated Piano Wire Chevron Tread Rings */}
          {[-0.06, 0.06].map((to, ti) => (
            <mesh key={ti} position={[to, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.3, 0.015, 8, 24]} />
              <meshStandardMaterial {...aluminumMat} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ========================================================
          TWO FOLDING ASTRONAUT BUCKET SEATS & SEATBELTS
      ======================================================== */}
      {[-0.28, 0.28].map((sx, si) => (
        <group key={si} position={[sx, 0.12, 0.05]}>
          {/* Tubular Frame Outer Border */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.42, 0.04, 0.48]} />
            <meshStandardMaterial {...aluminumMat} />
          </mesh>
          {/* Seat Cushion Webbing */}
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.36, 0.02, 0.42]} />
            <meshStandardMaterial {...seatWebbingMat} />
          </mesh>
          {/* Folding Seat Back Frame */}
          <mesh position={[0, 0.42, -0.22]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.42, 0.52, 0.04]} />
            <meshStandardMaterial {...aluminumMat} />
          </mesh>
          {/* Seat Back Webbing */}
          <mesh position={[0, 0.42, -0.21]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.36, 0.46, 0.02]} />
            <meshStandardMaterial {...seatWebbingMat} />
          </mesh>
          {/* Velcro Seatbelt Strap */}
          <mesh position={[0, 0.22, 0.02]}>
            <boxGeometry args={[0.38, 0.02, 0.06]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
      ))}

      {/* ========================================================
          CENTER CONTROL CONSOLE & T-HANDLE CONTROLLER
      ======================================================== */}
      <group position={[0, 0.25, 0.15]}>
        {/* Slanted Display & Switchboard Panel */}
        <mesh rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.22, 0.28, 0.15]} />
          <meshStandardMaterial {...darkFrameMat} />
        </mesh>
        {/* Navigation Heading Gyro Meter & Odometers */}
        <mesh position={[0, 0.08, 0.08]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
        </mesh>
        {/* Center Joystick Post */}
        <mesh position={[0, 0.22, 0.04]}>
          <cylinderGeometry args={[0.016, 0.016, 0.24, 8]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
        {/* T-Shaped Hand Controller (Forward = Accelerate, Pull = Brake) */}
        <mesh position={[0, 0.34, 0.04]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.18, 12]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
      </group>

      {/* ========================================================
          FENDERS (INCLUDING APOLLO 17 IMPROVISED REPAIR!)
      ======================================================== */}
      {/* Front Left Fender */}
      <mesh position={[-0.88, 0.08, 1.15]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.34, 0.03, 0.42]} />
        <meshStandardMaterial {...darkFrameMat} />
      </mesh>
      {/* Front Right Fender */}
      <mesh position={[0.88, 0.08, 1.15]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.34, 0.03, 0.42]} />
        <meshStandardMaterial {...darkFrameMat} />
      </mesh>
      {/* Rear Left Fender */}
      <mesh position={[-0.88, 0.08, -1.15]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.34, 0.03, 0.42]} />
        <meshStandardMaterial {...darkFrameMat} />
      </mesh>

      {/* REAR RIGHT FENDER — APOLLO 17 IMPROVISED REPAIR */}
      {/* Gene Cernan broke the fiberglass fender; repaired using taped photo maps and clamps! */}
      <group position={[0.88, 0.12, -1.15]} rotation={[-0.25, 0, 0]}>
        {/* Laminated Maps Taped Together */}
        <mesh>
          <boxGeometry args={[0.38, 0.02, 0.48]} />
          <meshStandardMaterial {...mapPaperMat} />
        </mesh>
        {/* Grey NASA Duct Tape Strips */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.1, 0.005, 0.46]} />
          <meshStandardMaterial {...ductTapeMat} />
        </mesh>
        {/* Equipment Spring Clamps holding map to fender bracket */}
        {[-0.12, 0.12].map((cx, ci) => (
          <mesh key={ci} position={[cx, 0.03, 0.15]}>
            <boxGeometry args={[0.04, 0.05, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          HIGH-GAIN PARABOLIC UMBRELLA MESH DISH ANTENNA
      ======================================================== */}
      <group position={[0.55, 0.35, 0.85]} rotation={[0.4, 0.3, 0]}>
        {/* Antenna Mast Post */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.7, 8]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
        {/* Gold Mesh Umbrella Parabolic Dish */}
        <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.04, 0.12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} wireframe={true} />
        </mesh>
        {/* Antenna Sub-Reflector Feed Horn */}
        <mesh position={[0, 0.88, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <coneGeometry args={[0.05, 0.15, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
      </group>

      {/* ========================================================
          RCA COLOR TV CAMERA (BROADCAST FIRST MOON LIFTOFF)
      ======================================================== */}
      <group position={[-0.55, 0.55, 0.85]}>
        {/* Camera Mounting Mast */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
        {/* Camera Main Housing */}
        <mesh>
          <boxGeometry args={[0.18, 0.14, 0.24]} />
          <meshStandardMaterial {...darkFrameMat} />
        </mesh>
        {/* Zoom Lens & Sun Visor */}
        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.1, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      </group>

      {/* ========================================================
          REAR EQUIPMENT PALLET & LUNAR GEOLOGY TOOLS
      ======================================================== */}
      <group position={[0, 0.15, -1.2]}>
        {/* Tubular Rear Rack Shelf */}
        <mesh>
          <boxGeometry args={[1.2, 0.06, 0.7]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
        {/* Lunar Surface Sample Collection Bags */}
        {[-0.35, -0.12, 0.15, 0.38].map((tx, ti) => (
          <mesh key={ti} position={[tx, 0.15, 0]}>
            <boxGeometry args={[0.18, 0.22, 0.22]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
        ))}
        {/* Core Drill Tubes Extension Handle */}
        <mesh position={[0, 0.1, 0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
      </group>

      {/* Lime-Tint Lunar Accent Light */}
      <pointLight color="#a3e635" intensity={2.2} distance={8} position={[0, 3, 0]} />
    </group>
  )
}

export default function LunarRoverPage() {
  const mission = getMissionById('lunar-rover')!
  return <MissionPage mission={mission} model3D={<LunarRoverModel />} />
}
