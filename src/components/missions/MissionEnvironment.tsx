import * as THREE from 'three'
import {
  getMarsGlobeTexture,
  getMarsElevationTexture,
  getMarsSurfaceTexture,
  getMoonSurfaceTexture,
  getEarthTexture,
} from '../../utils/proceduralTextures'

type EnvType = 'mars-atmosphere' | 'mars-surface' | 'moon' | 'lunar-orbit'

interface Props {
  type: EnvType
}

/**
 * High-Realism Mars Upper Atmosphere Environment for MAVEN
 * Mars serves as a stationary, secondary background element, allowing
 * the MAVEN spacecraft in the foreground to remain the primary visual focus.
 * Surrounding space and planet remain completely stationary and stable.
 */
function MarsAtmosphere() {
  const marsTex = getMarsGlobeTexture()
  const marsElevTex = getMarsElevationTexture()

  return (
    <>
      <color attach="background" args={['#020205']} />
      <ambientLight intensity={0.35} color="#fed7aa" />

      {/* Solar Directional Light illuminating MAVEN and creating realistic Mars terminator */}
      <directionalLight position={[12, 10, 14]} intensity={2.2} color="#fffaf5" />
      {/* Nightside cosmic back-fill */}
      <directionalLight position={[-16, -6, -12]} intensity={0.2} color="#38bdf8" />

      {/* Secondary background Mars — completely stationary, offset behind the hero spacecraft */}
      <group position={[4.2, -0.8, -9.0]}>
        <mesh rotation={[0.42, 0.6, 0]}>
          <sphereGeometry args={[3.8, 64, 64]} />
          <meshStandardMaterial
            map={marsTex}
            bumpMap={marsElevTex}
            bumpScale={0.065}
            roughness={0.82}
            metalness={0.04}
          />
        </mesh>

        {/* Mars Atmospheric Troposphere / Dust Limb Glow */}
        <mesh>
          <sphereGeometry args={[3.88, 64, 64]} />
          <meshBasicMaterial
            color="#ea580c"
            transparent
            opacity={0.24}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Mid-Atmosphere Carbon Dioxide Haze */}
        <mesh>
          <sphereGeometry args={[3.98, 48, 48]} />
          <meshBasicMaterial
            color="#fb923c"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Upper Ionosphere / Exosphere Cyan Sheath (MAVEN science focus) */}
        <mesh>
          <sphereGeometry args={[4.15, 48, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Visually stable deep space cosmos background */}
      <mesh>
        <sphereGeometry args={[250, 24, 24]} />
        <meshBasicMaterial color="#010204" side={THREE.BackSide} />
      </mesh>
    </>
  )
}

function MarsSurface() {
  const marsSurfaceTex = getMarsSurfaceTexture()

  return (
    <>
      <color attach="background" args={['#1a0904']} />
      <ambientLight intensity={0.45} color="#fca5a5" />
      <directionalLight position={[28, 32, 16]} intensity={1.8} color="#ffedd5" castShadow />
      <hemisphereLight args={['#fb7185', '#3f1708', 0.55]} />

      {/* Textured Mars Regolith Ground with Realistic Relief */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[180, 180, 56, 56]} />
        <meshStandardMaterial
          map={marsSurfaceTex}
          bumpMap={marsSurfaceTex}
          bumpScale={0.16}
          roughness={0.94}
          metalness={0.02}
        />
      </mesh>

      {/* Primary & Secondary Martian Basalt Boulders */}
      {[
        [-3.5, -1.15, -4.5, 0.5, 0.8],
        [4.2, -1.1, -6.0, 0.7, 1.4],
        [-6.5, -1.05, -7.5, 0.9, 2.1],
        [7.0, -1.2, -3.8, 0.55, 0.4],
        [-2.0, -1.25, -9.0, 0.45, 1.7],
        [2.5, -1.2, -11.0, 0.95, 2.8],
        [-8.0, -1.0, -3.0, 0.75, 0.9],
        [9.5, -0.9, -8.0, 1.15, 1.3],
        [-1.2, -1.35, -2.8, 0.35, 0.6],
        [1.8, -1.35, -2.4, 0.3, 2.2],
        [-4.8, -1.3, -2.1, 0.28, 1.1],
        [5.2, -1.28, -2.2, 0.32, 0.9],
      ].map(([x, y, z, scale, rot], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          rotation={[rot * 0.4, rot, rot * 0.3]}
          scale={[scale, scale * 0.65, scale]}
          castShadow
        >
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#6c270e"
            roughness={0.92}
            metalness={0.04}
          />
        </mesh>
      ))}

      {/* Distant Crater Rim Mountain Ridges */}
      {[-45, 45, 0].map((x, i) => (
        <mesh
          key={i}
          position={[x, 3, i === 2 ? -65 : -52]}
          rotation={[0, i === 0 ? 0.3 : i === 1 ? -0.3 : 0, 0]}
        >
          <coneGeometry args={[42, 14, 16]} />
          <meshStandardMaterial color="#501a07" roughness={0.96} />
        </mesh>
      ))}

      {/* Subtle Dust Atmospheric Fog */}
      <fog attach="fog" args={['#431407', 22, 100]} />
    </>
  )
}

function MoonSurface() {
  const moonSurfaceTex = getMoonSurfaceTexture()
  const earthTex = getEarthTexture()

  return (
    <>
      <color attach="background" args={['#010204']} />
      {/* Stark, unfiltered direct sunlight of the lunar vacuum */}
      <ambientLight intensity={0.12} color="#94a3b8" />
      <directionalLight position={[34, 28, -12]} intensity={2.4} color="#ffffff" castShadow />
      {/* Earthshine subtle blue bounce fill */}
      <directionalLight position={[-22, 16, -42]} intensity={0.3} color="#38bdf8" />

      {/* Textured Lunar Regolith with Crater Bump Mapping */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[180, 180, 56, 56]} />
        <meshStandardMaterial
          map={moonSurfaceTex}
          bumpMap={moonSurfaceTex}
          bumpScale={0.18}
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      {/* Distinct Impact Craters with Depressed Bowls and Raised Rims */}
      {[
        [-5.0, 0, -6.5, 1.9],
        [4.5, 0, -8.5, 2.5],
        [-8.5, 0, -4.5, 1.3],
        [8.0, 0, -11.0, 3.4],
        [0.0, 0, -14.0, 2.8],
        [-3.2, 0, -10.5, 1.5],
      ].map(([x, _y, z, r], i) => (
        <group key={i} position={[x, -1.48, z]}>
          {/* Inner Crater Bowl Depression */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[r, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={1.0} />
          </mesh>
          {/* Raised Crater Rim Rampart */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r * 0.88, r * 1.18, 32]} />
            <meshStandardMaterial color="#475569" roughness={0.92} />
          </mesh>
        </group>
      ))}

      {/* Realistic Rotating Earth "Blue Marble" in Background Sky */}
      <group position={[-36, 28, -75]}>
        {/* Earth Sphere with Continents and Oceans */}
        <mesh rotation={[0.22, 1.1, 0]}>
          <sphereGeometry args={[9.8, 64, 64]} />
          <meshStandardMaterial
            map={earthTex}
            roughness={0.4}
            metalness={0.08}
          />
        </mesh>
        {/* Atmospheric Blue Limb Glow */}
        <mesh>
          <sphereGeometry args={[10.15, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.24}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Deep Space Vacuum Background */}
      <mesh>
        <sphereGeometry args={[250, 16, 16]} />
        <meshBasicMaterial color="#000003" side={THREE.BackSide} />
      </mesh>
    </>
  )
}

export default function MissionEnvironment({ type }: Props) {
  if (type === 'mars-atmosphere') return <MarsAtmosphere />
  if (type === 'mars-surface') return <MarsSurface />
  if (type === 'moon' || type === 'lunar-orbit') return <MoonSurface />
  return <MarsAtmosphere />
}
