import MissionPage from '../../components/missions/MissionPage'
import { getMissionById } from '../../data/missions'
import { getGoldFoilTexture } from '../../utils/proceduralTextures'

function Apollo11Model() {
  const goldTex = getGoldFoilTexture()

  const aluminumMat = { color: '#cbd5e1', metalness: 0.85, roughness: 0.25 }
  const darkNickelMat = { color: '#0f172a', metalness: 0.9, roughness: 0.2 }
  const titaniumMat = { color: '#64748b', metalness: 0.9, roughness: 0.2 }
  const windowGlassMat = { color: '#0369a1', metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.8 }

  return (
    <group position={[0, -0.4, 0]} rotation={[0, 0.45, 0]}>
      {/* ========================================================
          DESCENT STAGE (OCTAGONAL BASE WITH GOLD FOIL)
      ======================================================== */}
      {/* Main Octagonal Chassis Body */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.35, 1.45, 0.75, 8]} />
        <meshStandardMaterial
          map={goldTex}
          bumpMap={goldTex}
          bumpScale={0.09}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      {/* Black Nickel Thermal Panels on selected quadrants */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.36, 1.46, 0.72, 4]} />
        <meshStandardMaterial {...darkNickelMat} />
      </mesh>

      {/* Lunar Module Descent Engine (LMDE) Bell */}
      <group position={[0, -0.55, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.55, 0.65, 32]} />
          <meshStandardMaterial {...titaniumMat} />
        </mesh>
        {/* Engine Throat Glow */}
        <pointLight color="#f97316" intensity={1.5} distance={2.5} position={[0, -0.2, 0]} />
      </group>

      {/* ========================================================
          4 OUTRIGGER LANDING GEAR ASSEMBLIES
      ======================================================== */}
      {[
        [0, 1, 0],         // Forward Leg (+Z, has the Ladder!)
        [1, 0, Math.PI / 2], // Starboard (+X)
        [0, -1, Math.PI],    // Aft (-Z)
        [-1, 0, -Math.PI / 2],// Port (-X)
      ].map(([dx, dz, rotY], i) => {
        const hasLadder = i === 0
        return (
          <group key={i} rotation={[0, rotY, 0]}>
            {/* Outrigger Truss Joint from Octagon */}
            <mesh position={[0, -0.1, 1.35]}>
              <boxGeometry args={[0.4, 0.15, 0.35]} />
              <meshStandardMaterial {...aluminumMat} />
            </mesh>

            {/* Primary Hydraulic Landing Strut */}
            <mesh position={[0, -0.7, 1.95]} rotation={[-0.62, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 1.65, 12]} />
              <meshStandardMaterial
                map={goldTex}
                bumpMap={goldTex}
                bumpScale={0.05}
                metalness={0.7}
              />
            </mesh>

            {/* Secondary A-Frame Inverted V-Struts */}
            <mesh position={[-0.22, -0.5, 1.6]} rotation={[-0.45, 0.2, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
              <meshStandardMaterial {...aluminumMat} />
            </mesh>
            <mesh position={[0.22, -0.5, 1.6]} rotation={[-0.45, -0.2, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
              <meshStandardMaterial {...aluminumMat} />
            </mesh>

            {/* Inverted Dish Footpad */}
            <mesh position={[0, -1.25, 2.45]}>
              <cylinderGeometry args={[0.34, 0.38, 0.06, 24]} />
              <meshStandardMaterial {...aluminumMat} color="#94a3b8" />
            </mesh>

            {/* 5-Foot Lunar Surface Contact Sensing Probe */}
            <mesh position={[0, -1.5, 2.45]}>
              <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
              <meshStandardMaterial {...titaniumMat} />
            </mesh>

            {/* FORWARD LADDER FOR NEIL ARMSTRONG & BUZZ ALDRIN */}
            {hasLadder && (
              <group position={[0, -0.7, 1.92]} rotation={[-0.62, 0, 0]}>
                {/* Ladder Rails */}
                {[-0.14, 0.14].map((rx, ri) => (
                  <mesh key={ri} position={[rx, 0, 0.07]}>
                    <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} />
                    <meshStandardMaterial {...aluminumMat} />
                  </mesh>
                ))}
                {/* 9 Ladder Rungs */}
                {Array.from({ length: 9 }).map((_, rungI) => (
                  <mesh key={rungI} position={[0, -0.65 + rungI * 0.16, 0.07]}>
                    <boxGeometry args={[0.28, 0.012, 0.012]} />
                    <meshStandardMaterial {...aluminumMat} />
                  </mesh>
                ))}
                {/* HISTORIC APOLLO 11 COMMEMORATIVE LUNAR PLAQUE */}
                {/* "Here men from the planet Earth first set foot upon the Moon..." */}
                <group position={[0, -0.05, 0.08]}>
                  <mesh>
                    <boxGeometry args={[0.22, 0.16, 0.006]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.15} />
                  </mesh>
                  <mesh position={[0, 0, 0.004]}>
                    <boxGeometry args={[0.2, 0.14, 0.002]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.6} />
                  </mesh>
                </group>
                {/* Egress Porch Platform at Top of Ladder */}
                <mesh position={[0, 0.85, 0.05]}>
                  <boxGeometry args={[0.35, 0.03, 0.3]} />
                  <meshStandardMaterial {...darkNickelMat} />
                </mesh>
                {/* Porch Safety Handrails */}
                {[-0.17, 0.17].map((hx, hi) => (
                  <mesh key={hi} position={[hx, 0.98, 0.12]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
                    <meshStandardMaterial {...aluminumMat} />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        )
      })}

      {/* ========================================================
          MESA BAY & HISTORIC APOLLO 11 TV BROADCAST CAMERA
          (Deployed by Neil Armstrong pulling lanyard on descent)
      ======================================================== */}
      <group position={[-0.95, -0.22, 1.05]} rotation={[0.2, -0.4, 0]}>
        {/* Deployed MESA hinged tray pallet */}
        <mesh>
          <boxGeometry args={[0.55, 0.04, 0.45]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
        {/* Gold thermal blanket wrap */}
        <mesh position={[0, -0.025, 0]}>
          <boxGeometry args={[0.53, 0.02, 0.43]} />
          <meshStandardMaterial
            map={goldTex}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        {/* Westinghouse Black & White Lunar Surface TV Camera */}
        <group position={[0.08, 0.12, 0.06]} rotation={[0.1, 0.65, 0]}>
          <mesh>
            <boxGeometry args={[0.13, 0.1, 0.18]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Camera wide-angle lens pointed at the ladder for first steps */}
          <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 0.06, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          ASCENT STAGE (CREW CABIN & COCKPIT)
      ======================================================== */}
      <group position={[0, 0.72, 0]}>
        {/* Main Pressurized Midsection / Cabin */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.15, 0.88, 8]} />
          <meshStandardMaterial {...aluminumMat} color="#e2e8f0" />
        </mesh>

        {/* Front Cockpit Face with triangular observation windows */}
        <group position={[0, 0.05, 0.95]}>
          {/* Flat Face Structure */}
          <mesh>
            <boxGeometry args={[1.2, 0.75, 0.35]} />
            <meshStandardMaterial {...aluminumMat} />
          </mesh>

          {/* Commander Neil Armstrong Window (Triangular Left) */}
          <mesh position={[-0.32, 0.12, 0.19]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.24, 0.18, 0.02]} />
            <meshStandardMaterial {...windowGlassMat} />
          </mesh>

          {/* LMP Buzz Aldrin Window (Triangular Right) */}
          <mesh position={[0.32, 0.12, 0.19]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.24, 0.18, 0.02]} />
            <meshStandardMaterial {...windowGlassMat} />
          </mesh>

          {/* Overhead Rendezvous Docking Window */}
          <mesh position={[0, 0.39, 0.05]}>
            <boxGeometry args={[0.2, 0.02, 0.2]} />
            <meshStandardMaterial {...windowGlassMat} />
          </mesh>

          {/* Forward EVA Egress Hatch Door */}
          <mesh position={[0, -0.15, 0.19]}>
            <boxGeometry args={[0.42, 0.42, 0.02]} />
            <meshStandardMaterial {...darkNickelMat} />
          </mesh>
        </group>

        {/* Overhead Docking Tunnel & Droque Cone */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.18, 24]} />
          <meshStandardMaterial {...darkNickelMat} />
        </mesh>

        {/* 4 RCS Reaction Control Thruster Quads with Plume Deflector Shields */}
        {[
          [0.95, 0.05, 0.7],
          [-0.95, 0.05, 0.7],
          [0.95, 0.05, -0.7],
          [-0.95, 0.05, -0.7],
        ].map(([rx, ry, rz], rcsI) => (
          <group key={rcsI} position={[rx, ry, rz]}>
            <mesh>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshStandardMaterial {...darkNickelMat} />
            </mesh>
            {/* 4 Thruster Bell Nozzles */}
            {[
              [0, 0.12, 0, 0, 0, 0],
              [0, -0.12, 0, Math.PI, 0, 0],
              [0.12, 0, 0, 0, 0, -Math.PI / 2],
              [-0.12, 0, 0, 0, 0, Math.PI / 2],
            ].map(([nx, ny, nz, nrx, nry, nrz], ni) => (
              <mesh key={ni} position={[nx, ny, nz]} rotation={[nrx, nry, nrz]}>
                <coneGeometry args={[0.035, 0.09, 8]} />
                <meshStandardMaterial {...titaniumMat} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Steerable S-Band High Gain Mesh Antenna */}
        <group position={[-0.6, 0.65, -0.5]} rotation={[0.4, 0.6, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.06, 0.1, 24]} />
            <meshStandardMaterial {...aluminumMat} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <coneGeometry args={[0.04, 0.18, 12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>

        {/* Rendezvous Radar Dish */}
        <mesh position={[0.6, 0.68, 0.2]} rotation={[-0.4, -0.5, 0]}>
          <cylinderGeometry args={[0.22, 0.04, 0.08, 16]} />
          <meshStandardMaterial {...aluminumMat} />
        </mesh>
      </group>

      {/* ========================================================
          PLANTED AMERICAN FLAG ON SEA OF TRANQUILITY
      ======================================================== */}
      <group position={[2.2, -1.25, 1.2]} rotation={[0, -0.3, 0]}>
        {/* Flagpole Mast into Lunar Dust */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 1.8, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
        {/* Gold Finial Ball at Top */}
        <mesh position={[0, 1.82, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
        {/* Horizontal Extension Bar (prevented flag from drooping in vacuum) */}
        <mesh position={[0.42, 1.78, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.85, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>
        {/* American Flag Fabric with Nylon Weave Texture */}
        <mesh position={[0.42, 1.48, 0.01]}>
          <boxGeometry args={[0.82, 0.55, 0.004]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.8} />
        </mesh>
        {/* 6 White Stripes */}
        {[-0.2, -0.12, -0.04, 0.04, 0.12, 0.2].map((sy, si) => (
          <mesh key={si} position={[0.42, 1.48 + sy, 0.013]}>
            <boxGeometry args={[0.82, 0.038, 0.002]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
        ))}
        {/* Blue Canton Union */}
        <mesh position={[0.22, 1.62, 0.014]}>
          <boxGeometry args={[0.42, 0.27, 0.002]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
        </mesh>
      </group>

      {/* Apollo Lunar Surface Experiments Package (PSEP Seismometer & LRRR) */}
      <group position={[-2.4, -1.35, 1.8]}>
        {/* Laser Ranging Retroreflector (LRRR - still used today!) */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.35, 0.2, 0.35]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Corner Cube Prisms */}
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.28]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.5} roughness={0.05} />
        </mesh>
      </group>

      {/* Lunar Sun High-Contrast Rim Light */}
      <pointLight color="#ffffff" intensity={2.5} distance={10} position={[3, 5, 3]} />
    </group>
  )
}

export default function Apollo11Page() {
  const mission = getMissionById('apollo11')!
  return <MissionPage mission={mission} model3D={<Apollo11Model />} />
}
