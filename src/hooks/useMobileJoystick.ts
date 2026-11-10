import { useEffect, useRef, useState } from 'react'

interface JoystickDelta {
  x: number
  y: number
}

export function useMobileJoystick() {
  const joystickRef = useRef<HTMLDivElement>(null)
  const [delta, setDelta] = useState<JoystickDelta>({ x: 0, y: 0 })
  const managerRef = useRef<ReturnType<typeof import('nipplejs').create> | null>(null)

  useEffect(() => {
    if (!joystickRef.current) return

    let nipple: typeof import('nipplejs') | null = null

    import('nipplejs').then((mod) => {
      const nipple = (mod as any).default || mod
      if (!joystickRef.current) return
      const manager = nipple.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'rgba(59,130,246,0.6)',
        size: 100,
      })

      manager.on('move', (_evt: any, data: any) => {
        if (data.vector) {
          setDelta({ x: data.vector.x, y: data.vector.y })
        }
      })
      manager.on('end', () => {
        setDelta({ x: 0, y: 0 })
      })

      managerRef.current = manager
    })

    return () => {
      managerRef.current?.destroy()
    }
  }, [])

  return { joystickDelta: delta, joystickRef }
}
