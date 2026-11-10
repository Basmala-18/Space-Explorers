/// <reference types="vite/client" />

declare module 'nipplejs' {
  interface JoystickOutputData {
    vector?: {
      x: number
      y: number
    }
    angle?: {
      radian: number
      degree: number
    }
    direction?: {
      x: string
      y: string
      angle: string
    }
    distance?: number
    position?: {
      x: number
      y: number
    }
    pressure?: number
  }

  interface JoystickManager {
    on(event: string, cb: (evt: any, data: JoystickOutputData) => void): void
    off(event: string, cb?: Function): void
    destroy(): void
  }

  interface JoystickOptions {
    zone: HTMLElement
    color?: string
    size?: number
    threshold?: number
    fadeTime?: number
    multitouch?: boolean
    maxNumberOfNipples?: number
    dataOnly?: boolean
    position?: {
      top?: string
      left?: string
      right?: string
      bottom?: string
    }
    mode?: 'dynamic' | 'semi' | 'static'
    restJoystick?: boolean
    restOpacity?: number
    lockX?: boolean
    lockY?: boolean
    catchDistance?: number
  }

  function create(options: JoystickOptions): JoystickManager
}
