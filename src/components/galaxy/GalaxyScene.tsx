import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import StarField from './StarField'
import Nebula from './Nebula'
import Spaceship from './Spaceship'
import MissionNode from './MissionNode'
import { MISSIONS } from '../../data/missions'
import { useSpaceshipControls, JoystickInput } from '../../hooks/useSpaceshipControls'
import { useMobileJoystick } from '../../hooks/useMobileJoystick'
import MiniMap from '../ui/MiniMap'
import HUD from '../ui/HUD'
import { useStore } from '../../store/useStore'

function CameraRig({
  shipPos,
  yawRef,
  speed,
}: {
  shipPos: React.MutableRefObject<THREE.Vector3>
  yawRef: React.MutableRefObject<number>
  speed: number
}) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 12, 18))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const ship = shipPos.current
    const yaw = yawRef.current

    // Third-person camera positioned smoothly BEHIND the ship in heading direction
    const distBehind = 8.5 + Math.min(speed * 0.45, 7.0) // pulls back dynamically with speed
    const heightAbove = 4.2 + Math.min(speed * 0.15, 2.5)

    const desiredX = ship.x + Math.sin(yaw) * distBehind
    const desiredY = ship.y + heightAbove
    const desiredZ = ship.z + Math.cos(yaw) * distBehind

    // Snappy, smooth lerping without lag across 3D coordinates
    const lerpSpeed = 12.0 * dt
    targetPos.current.x = THREE.MathUtils.lerp(targetPos.current.x, desiredX, lerpSpeed)
    targetPos.current.y = THREE.MathUtils.lerp(targetPos.current.y, desiredY, lerpSpeed)
    targetPos.current.z = THREE.MathUtils.lerp(targetPos.current.z, desiredZ, lerpSpeed)
    camera.position.copy(targetPos.current)

    // Look point slightly ahead of the ship in 3D
    const lookAheadDist = 4.0 + speed * 0.3
    const lookX = ship.x - Math.sin(yaw) * lookAheadDist
    const lookY = ship.y + 0.5
    const lookZ = ship.z - Math.cos(yaw) * lookAheadDist

    targetLook.current.x = THREE.MathUtils.lerp(targetLook.current.x, lookX, 14.0 * dt)
    targetLook.current.y = THREE.MathUtils.lerp(targetLook.current.y, lookY, 14.0 * dt)
    targetLook.current.z = THREE.MathUtils.lerp(targetLook.current.z, lookZ, 14.0 * dt)
    camera.lookAt(targetLook.current)
  })

  return null
}

function SceneContent({
  shipPos,
  joystickDelta,
  verticalTouch,
  onSpeedUpdate,
}: {
  shipPos: React.MutableRefObject<THREE.Vector3>
  joystickDelta: JoystickInput
  verticalTouch: number
  onSpeedUpdate: (speed: number, isBoosting: boolean) => void
}) {
  const controls = useSpaceshipControls(joystickDelta, verticalTouch)
  const currentSpeedRef = useRef(0)

  useFrame((_, delta) => {
    const physics = controls.updatePhysics(delta)
    currentSpeedRef.current = physics.speed
    onSpeedUpdate(physics.speed, physics.isBoosting)
  })

  return (
    <>
      <color attach="background" args={['#050714']} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[20, 40, 20]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#3b82f6" distance={100} />

      <StarField />
      <Nebula />

      {MISSIONS.map((m) => (
        <MissionNode key={m.id} mission={m} />
      ))}

      <Spaceship
        velocityRef={controls.velocityRef}
        yawRef={controls.yawRef}
        pitchRef={controls.pitchRef}
        rollRef={controls.rollRef}
        thrustRef={controls.thrustRef}
        isBoostingRef={controls.isBoostingRef}
        positionRef={shipPos}
      />

      <CameraRig
        shipPos={shipPos}
        yawRef={controls.yawRef}
        speed={currentSpeedRef.current}
      />
    </>
  )
}

export default function GalaxyScene() {
  const shipPos = useRef(new THREE.Vector3(0, 0, 0))
  const [playerPos2D, setPlayerPos2D] = useState<[number, number]>([0, 0])
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [isBoosting, setIsBoosting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileVerticalInput, setMobileVerticalInput] = useState(0)
  const { controlsHintDismissed, dismissControlsHint } = useStore()
  const { joystickDelta, joystickRef } = useMobileJoystick()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const interval = setInterval(() => {
      setPlayerPos2D([shipPos.current.x, shipPos.current.z])
    }, 100)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(interval)
    }
  }, [])

  const handleSpeedUpdate = (speed: number, boosting: boolean) => {
    setCurrentSpeed(speed)
    setIsBoosting(boosting)
  }

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 15, 20], fov: 55, near: 0.1, far: 800 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#050714' }}
      >
        <SceneContent
          shipPos={shipPos}
          joystickDelta={joystickDelta}
          verticalTouch={mobileVerticalInput}
          onSpeedUpdate={handleSpeedUpdate}
        />
      </Canvas>

      {/* HUD Telemetry Overlay — top left */}
      <div className="absolute top-20 left-4 flex flex-col gap-3 pointer-events-auto z-20">
        <HUD
          speed={currentSpeed}
          position={[shipPos.current.x, shipPos.current.y, shipPos.current.z]}
          controlsHintDismissed={controlsHintDismissed}
          onDismissHint={dismissControlsHint}
          isMobile={isMobile}
          isBoosting={isBoosting}
        />
      </div>

      {/* Mobile Touch Joystick Zone — bottom left */}
      {isMobile && (
        <div
          ref={joystickRef}
          id="joystick-zone"
          className="absolute bottom-16 left-6 z-30 pointer-events-auto"
          style={{ width: 140, height: 140, touchAction: 'none' }}
        />
      )}

      {/* Bottom-right cluster: altitude controls (left) + mini-map (right) side by side */}
      <div className="absolute bottom-6 right-4 pointer-events-none z-20 flex items-end gap-3">
        {/* Altitude UP / DOWN controls — accessible to desktop mouse users and mobile touch users */}
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            onTouchStart={() => setMobileVerticalInput(1)}
            onTouchEnd={() => setMobileVerticalInput(0)}
            onMouseDown={() => setMobileVerticalInput(1)}
            onMouseUp={() => setMobileVerticalInput(0)}
            onMouseLeave={() => setMobileVerticalInput(0)}
            className="w-12 h-12 rounded-2xl glass border border-blue-400/50 hover:border-blue-400 text-blue-200 hover:text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all bg-black/40 hover:bg-blue-600/20 cursor-pointer"
            title="Ascend Spacecraft (Space / E / PageUp)"
          >
            <span className="text-xs">▲</span>
            <span className="text-[9px] font-mono tracking-tighter">UP</span>
          </button>
          <button
            onTouchStart={() => setMobileVerticalInput(-1)}
            onTouchEnd={() => setMobileVerticalInput(0)}
            onMouseDown={() => setMobileVerticalInput(-1)}
            onMouseUp={() => setMobileVerticalInput(0)}
            onMouseLeave={() => setMobileVerticalInput(0)}
            className="w-12 h-12 rounded-2xl glass border border-blue-400/50 hover:border-blue-400 text-blue-200 hover:text-white font-bold flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all bg-black/40 hover:bg-blue-600/20 cursor-pointer"
            title="Descend Spacecraft (C / Q / PageDown)"
          >
            <span className="text-xs">▼</span>
            <span className="text-[9px] font-mono tracking-tighter">DOWN</span>
          </button>
        </div>

        {/* Mini-map — fully visible and unobstructed */}
        <div className="pointer-events-none">
          <MiniMap playerPos={playerPos2D} />
        </div>
      </div>
    </div>
  )
}
