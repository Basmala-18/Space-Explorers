import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

export interface SpaceshipControlsState {
  velocity: THREE.Vector3
  yaw: number
  pitch: number
  roll: number
  isMoving: boolean
  thrustLevel: number
  isBoosting: boolean
  speedKmh: number
}

export interface JoystickInput {
  x: number
  y: number
}

export function useSpaceshipControls(joystickInput?: JoystickInput, verticalInput: number = 0) {
  const keys = useRef<Set<string>>(new Set())
  const [hudState, setHudState] = useState<{
    speed: number
    thrustLevel: number
    isBoosting: boolean
  }>({
    speed: 0,
    thrustLevel: 0,
    isBoosting: false,
  })

  // Physics state refs to avoid 60fps re-renders
  const velocityRef = useRef(new THREE.Vector3())
  const yawRef = useRef(0)
  const pitchRef = useRef(0)
  const rollRef = useRef(0)
  const thrustRef = useRef(0)
  const isBoostingRef = useRef(false)
  const lastHudUpdateRef = useRef(0)

  // External joystick and vertical touch refs
  const joystickRef = useRef<JoystickInput>({ x: 0, y: 0 })
  const verticalTouchRef = useRef(0)

  if (joystickInput) {
    joystickRef.current = joystickInput
  }
  verticalTouchRef.current = verticalInput

  useEffect(() => {
    const validKeys = [
      'w', 'a', 's', 'd', 'e', 'q', 'c', 'r', 'f', 'x', 'b',
      'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
      'pageup', 'pagedown', 'shift', ' '
    ]

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (validKeys.includes(key)) {
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'pageup', 'pagedown'].includes(key)) {
          e.preventDefault()
        }
        keys.current.add(key)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keys.current.delete(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Call this inside Three.js useFrame
  const updatePhysics = useCallback((delta: number) => {
    const dt = Math.min(delta, 0.1)
    const k = keys.current
    const joy = joystickRef.current
    const touchV = verticalTouchRef.current

    // Keyboard inputs
    const keyForward = k.has('w') || k.has('arrowup')
    const keyBackward = k.has('s') || k.has('arrowdown')
    const keyLeft = k.has('a') || k.has('arrowleft')
    const keyRight = k.has('d') || k.has('arrowright')
    const keyUp = k.has(' ') || k.has('e') || k.has('pageup') || k.has('r')
    const keyDown = k.has('c') || k.has('q') || k.has('pagedown') || k.has('f')
    const keyBoost = k.has('shift')
    const keyBrake = k.has('x') || k.has('b')

    // Joystick inputs (normalized -1 to 1)
    const joyX = joy.x || 0
    const joyY = joy.y || 0
    const hasJoy = Math.hypot(joyX, joyY) > 0.05

    // Combined steering (Yaw)
    let turnInput = 0
    if (keyLeft) turnInput += 1
    if (keyRight) turnInput -= 1
    if (hasJoy) {
      turnInput -= joyX * 1.5
    }

    // Combined throttle (Forward / Backward)
    let throttleInput = 0
    if (keyForward) throttleInput += 1
    if (keyBackward) throttleInput -= 0.7
    if (keyBrake) throttleInput -= 1.3
    if (hasJoy) {
      throttleInput += joyY * 1.2
    }

    // Combined vertical throttle (Upward / Downward)
    let verticalThrottle = 0
    if (keyUp) verticalThrottle += 1
    if (keyDown) verticalThrottle -= 1
    if (touchV !== 0) verticalThrottle += touchV

    const isBoosting = keyBoost && (throttleInput > 0 || Math.abs(verticalThrottle) > 0)
    isBoostingRef.current = isBoosting

    // Enhanced 3D physics constants for snappy, responsive flight
    const TURN_RATE = 2.6 // radians per second
    const BASE_ACCEL = 24.0 // units per second^2
    const VERTICAL_ACCEL = 16.0 // units per second^2
    const BOOST_MULT = 1.95
    const BRAKE_DECEL = 38.0
    const MAX_SPEED = isBoosting ? 20.0 : 12.0
    const MAX_VERT_SPEED = isBoosting ? 12.0 : 7.0
    const MIN_SPEED_REVERSE = 4.5
    const SPACE_DAMPING = 0.985 // cosmic horizontal glide
    const VERTICAL_DAMPING = 0.94 // cosmic vertical stabilization

    // 1. Steering & Yaw
    yawRef.current += turnInput * TURN_RATE * dt

    // Dynamic bank roll based on turning and horizontal speed
    const targetRoll = turnInput * -0.5
    rollRef.current = THREE.MathUtils.lerp(rollRef.current, targetRoll, 9.0 * dt)

    // Dynamic pitch based on acceleration and vertical throttle
    const forwardPitch = THREE.MathUtils.clamp(-throttleInput * 0.08, -0.15, 0.1)
    const verticalPitch = verticalThrottle * -0.22
    const targetPitch = forwardPitch + verticalPitch
    pitchRef.current = THREE.MathUtils.lerp(pitchRef.current, targetPitch, 8.0 * dt)

    // Heading direction vector in XZ plane
    const heading = new THREE.Vector3(
      -Math.sin(yawRef.current),
      0,
      -Math.cos(yawRef.current)
    )

    // 2. Acceleration / Deceleration (Forward / Reverse)
    let accel = BASE_ACCEL
    if (isBoosting) accel *= BOOST_MULT

    if (throttleInput > 0) {
      const forwardForce = heading.clone().multiplyScalar(throttleInput * accel * dt)
      velocityRef.current.add(forwardForce)
    } else if (throttleInput < 0) {
      const brakeForce = heading.clone().multiplyScalar(throttleInput * BRAKE_DECEL * dt)
      velocityRef.current.add(brakeForce)
    }

    // 3. Upward and Downward Vertical Acceleration
    let vertAccel = VERTICAL_ACCEL
    if (isBoosting) vertAccel *= BOOST_MULT

    if (Math.abs(verticalThrottle) > 0.01) {
      velocityRef.current.y += verticalThrottle * vertAccel * dt
    }

    // 4. Directional redirection for agile flight
    const horizontalVel = new THREE.Vector2(velocityRef.current.x, velocityRef.current.z)
    const horizSpeed = horizontalVel.length()
    if (horizSpeed > 0.1 && Math.abs(turnInput) > 0.01) {
      const redirectedX = -Math.sin(yawRef.current) * horizSpeed
      const redirectedZ = -Math.cos(yawRef.current) * horizSpeed
      velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, redirectedX, 5.0 * dt)
      velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, redirectedZ, 5.0 * dt)
    }

    // 5. Cosmic damping & speed clamp
    if (Math.abs(throttleInput) < 0.01) {
      velocityRef.current.x *= Math.pow(SPACE_DAMPING, dt * 60)
      velocityRef.current.z *= Math.pow(SPACE_DAMPING, dt * 60)
    }
    if (Math.abs(verticalThrottle) < 0.01) {
      velocityRef.current.y *= Math.pow(VERTICAL_DAMPING, dt * 60)
    }

    // Clamp horizontal and vertical speeds
    const curHorizSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z)
    const maxAllowedHoriz = throttleInput < 0 ? MIN_SPEED_REVERSE : MAX_SPEED
    if (curHorizSpeed > maxAllowedHoriz) {
      const scale = maxAllowedHoriz / curHorizSpeed
      velocityRef.current.x *= scale
      velocityRef.current.z *= scale
    }

    velocityRef.current.y = THREE.MathUtils.clamp(velocityRef.current.y, -MAX_VERT_SPEED, MAX_VERT_SPEED)

    const totalSpeed = velocityRef.current.length()
    if (totalSpeed < 0.01 && Math.abs(throttleInput) < 0.01 && Math.abs(verticalThrottle) < 0.01) {
      velocityRef.current.set(0, 0, 0)
    }

    // Update thrust level for engine exhaust & flame light
    const activeDrive = Math.max(Math.abs(throttleInput), Math.abs(verticalThrottle) * 0.6)
    const targetThrust = activeDrive > 0 ? (isBoosting ? 1.0 : 0.7) : (throttleInput < 0 ? 0.3 : 0.0)
    thrustRef.current = THREE.MathUtils.lerp(thrustRef.current, targetThrust, 10.0 * dt)

    // Throttled HUD update
    const now = performance.now()
    if (now - lastHudUpdateRef.current > 90) {
      lastHudUpdateRef.current = now
      setHudState({
        speed: totalSpeed,
        thrustLevel: thrustRef.current,
        isBoosting: isBoosting,
      })
    }

    return {
      velocity: velocityRef.current,
      yaw: yawRef.current,
      pitch: pitchRef.current,
      roll: rollRef.current,
      thrust: thrustRef.current,
      speed: totalSpeed,
      isBoosting: isBoosting,
    }
  }, [])

  return {
    velocityRef,
    yawRef,
    pitchRef,
    rollRef,
    thrustRef,
    isBoostingRef,
    updatePhysics,
    hudState,
  }
}
