import * as THREE from 'three'

// Cache generated textures so they are created only once
const textureCache = new Map<string, THREE.CanvasTexture>()

/**
 * Procedural Photovoltaic Solar Cell Grid Texture
 */
export function getSolarPanelTexture(): THREE.CanvasTexture {
  if (textureCache.has('solar_panel')) {
    return textureCache.get('solar_panel')!
  }

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Deep space-grade silicon cell blue
  ctx.fillStyle = '#0a1936'
  ctx.fillRect(0, 0, size, size)

  // Subtle gradient on each wafer
  const cellRows = 8
  const cellCols = 4
  const cellW = size / cellCols
  const cellH = size / cellRows

  for (let r = 0; r < cellRows; r++) {
    for (let c = 0; c < cellCols; c++) {
      const x = c * cellW
      const y = r * cellH

      // Individual wafer background
      const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH)
      grad.addColorStop(0, '#0c2454')
      grad.addColorStop(0.5, '#071533')
      grad.addColorStop(1, '#0c2454')
      ctx.fillStyle = grad
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4)

      // Thin silver collector grid fingers
      ctx.strokeStyle = 'rgba(180, 210, 255, 0.25)'
      ctx.lineWidth = 1
      for (let f = 1; f < 8; f++) {
        const fy = y + (cellH / 8) * f
        ctx.beginPath()
        ctx.moveTo(x + 3, fy)
        ctx.lineTo(x + cellW - 3, fy)
        ctx.stroke()
      }

      // Main silver/gold busbars
      ctx.strokeStyle = 'rgba(230, 200, 130, 0.7)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(x + cellW * 0.33, y + 2)
      ctx.lineTo(x + cellW * 0.33, y + cellH - 2)
      ctx.moveTo(x + cellW * 0.66, y + 2)
      ctx.lineTo(x + cellW * 0.66, y + cellH - 2)
      ctx.stroke()
    }
  }

  // Border between cells
  ctx.strokeStyle = '#020612'
  ctx.lineWidth = 3
  for (let c = 0; c <= cellCols; c++) {
    ctx.beginPath()
    ctx.moveTo(c * cellW, 0)
    ctx.lineTo(c * cellW, size)
    ctx.stroke()
  }
  for (let r = 0; r <= cellRows; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * cellH)
    ctx.lineTo(size, r * cellH)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  textureCache.set('solar_panel', texture)
  return texture
}

/**
 * Procedural Wrinkled Gold MLI Thermal Foil Texture
 */
export function getGoldFoilTexture(): THREE.CanvasTexture {
  if (textureCache.has('gold_foil')) {
    return textureCache.get('gold_foil')!
  }

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Deep gold base
  ctx.fillStyle = '#b8860b'
  ctx.fillRect(0, 0, size, size)

  // Wrinkle creases using random polygonal shading
  const numFacets = 300
  for (let i = 0; i < numFacets; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const rad = 10 + Math.random() * 35

    ctx.beginPath()
    const points = 3 + Math.floor(Math.random() * 3)
    for (let p = 0; p < points; p++) {
      const angle = (p / points) * Math.PI * 2 + Math.random() * 0.5
      const px = x + Math.cos(angle) * rad
      const py = y + Math.sin(angle) * rad
      if (p === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()

    const brightness = 0.6 + Math.random() * 0.7
    ctx.fillStyle = `rgba(${Math.floor(220 * brightness)}, ${Math.floor(175 * brightness)}, ${Math.floor(35 * brightness)}, 0.45)`
    ctx.fill()
    ctx.strokeStyle = `rgba(${Math.floor(80 * brightness)}, ${Math.floor(55 * brightness)}, 5, 0.3)`
    ctx.lineWidth = 0.8
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  textureCache.set('gold_foil', texture)
  return texture
}

/**
 * Procedural Lunar Regolith Bump Texture
 */
export function getMoonSurfaceTexture(): THREE.CanvasTexture {
  if (textureCache.has('moon_surface')) {
    return textureCache.get('moon_surface')!
  }

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#686a6e'
  ctx.fillRect(0, 0, size, size)

  // Fine dust speckling
  const imgData = ctx.getImageData(0, 0, size, size)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 45
    d[i] = Math.min(255, Math.max(0, d[i] + noise))
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise))
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  // Random crater depressions
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * size
    const cy = Math.random() * size
    const r = 4 + Math.random() * 22

    // Shadow
    const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r)
    grad.addColorStop(0, '#3a3a3e')
    grad.addColorStop(0.7, '#4e5054')
    grad.addColorStop(1, '#7e8086')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  textureCache.set('moon_surface', texture)
  return texture
}

/**
 * Procedural Mars Soil & Rock Surface Texture
 */
export function getMarsSurfaceTexture(): THREE.CanvasTexture {
  if (textureCache.has('mars_surface')) {
    return textureCache.get('mars_surface')!
  }

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Red rust base
  ctx.fillStyle = '#9b3f1c'
  ctx.fillRect(0, 0, size, size)

  // Noise grain
  const imgData = ctx.getImageData(0, 0, size, size)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 50
    d[i] = Math.min(255, Math.max(0, d[i] + noise * 1.2))
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise * 0.6))
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise * 0.3))
  }
  ctx.putImageData(imgData, 0, 0)

  // Wind-blown ripples / strata
  ctx.strokeStyle = 'rgba(180, 80, 40, 0.25)'
  ctx.lineWidth = 3
  for (let y = 0; y < size; y += 12) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x < size; x += 30) {
      ctx.lineTo(x, y + Math.sin(x * 0.05) * 4)
    }
    ctx.stroke()
  }

  // Scattered pebbles
  for (let i = 0; i < 60; i++) {
    const px = Math.random() * size
    const py = Math.random() * size
    const pr = 2 + Math.random() * 5
    ctx.fillStyle = '#541f0c'
    ctx.beginPath()
    ctx.arc(px, py, pr, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  textureCache.set('mars_surface', texture)
  return texture
}

/**
 * Procedural Earth Globe Texture (continents, oceans, polar ice)
 */
export function getEarthTexture(): THREE.CanvasTexture {
  if (textureCache.has('earth_globe')) {
    return textureCache.get('earth_globe')!
  }

  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Deep ocean blue
  ctx.fillStyle = '#0a2e5c'
  ctx.fillRect(0, 0, width, height)

  // Continent landmass shapes (Americas, Eurasia, Africa, Australia)
  ctx.fillStyle = '#2d5e37' // forest / land green

  // North America
  ctx.beginPath()
  ctx.ellipse(width * 0.25, height * 0.35, width * 0.12, height * 0.16, -0.2, 0, Math.PI * 2)
  ctx.fill()

  // South America
  ctx.beginPath()
  ctx.ellipse(width * 0.32, height * 0.65, width * 0.07, height * 0.18, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Eurasia
  ctx.beginPath()
  ctx.ellipse(width * 0.65, height * 0.32, width * 0.18, height * 0.14, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Africa
  ctx.beginPath()
  ctx.ellipse(width * 0.55, height * 0.55, width * 0.09, height * 0.16, -0.1, 0, Math.PI * 2)
  ctx.fill()

  // Australia
  ctx.beginPath()
  ctx.ellipse(width * 0.82, height * 0.72, width * 0.06, height * 0.08, 0, 0, Math.PI * 2)
  ctx.fill()

  // Deserts (Sahara, Australia, Middle East)
  ctx.fillStyle = '#8f7743'
  ctx.beginPath()
  ctx.ellipse(width * 0.55, height * 0.48, width * 0.07, height * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()

  // Polar Ice Caps
  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(0, 0, width, height * 0.08)
  ctx.fillRect(0, height * 0.92, width, height * 0.08)

  // Cloud swirls
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  for (let c = 0; c < 25; c++) {
    const cx = Math.random() * width
    const cy = 40 + Math.random() * (height - 80)
    const cw = 40 + Math.random() * 120
    const ch = 10 + Math.random() * 30
    ctx.beginPath()
    ctx.ellipse(cx, cy, cw, ch, Math.random() * 0.4, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  textureCache.set('earth_globe', texture)
  return texture
}

/**
 * High-Fidelity Procedural Mars Globe Albedo Texture
 * Features authentic Martian geography: Olympus Mons, Tharsis Montes,
 * Valles Marineris, Syrtis Major, Hellas Basin, and spiral polar ice caps.
 */
export function getMarsGlobeTexture(): THREE.CanvasTexture {
  if (textureCache.has('mars_globe_hd')) {
    return textureCache.get('mars_globe_hd')!
  }

  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // 1. Natural Mars Ochre / Terracotta base gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
  baseGrad.addColorStop(0, '#782608')     // North pole transition
  baseGrad.addColorStop(0.15, '#a4471e')  // Northern lowlands
  baseGrad.addColorStop(0.5, '#c14f20')   // Equatorial deserts
  baseGrad.addColorStop(0.85, '#933e19')  // Southern cratered highlands
  baseGrad.addColorStop(1, '#631f06')     // South pole transition
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Multi-frequency planetary surface variation (dust dunes & regolith)
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data
  // Deterministic pseudo-random seed for repeatable realistic geography
  let seed = 42
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let y = 0; y < height; y++) {
    const latFactor = Math.sin((y / height) * Math.PI)
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const n1 = Math.sin(x * 0.015) * Math.cos(y * 0.02)
      const n2 = Math.sin(x * 0.04 + y * 0.03) * 0.5
      const n3 = (pseudoRandom() - 0.5) * 18
      const totalNoise = (n1 + n2) * 22 + n3

      d[idx] = Math.min(255, Math.max(0, d[idx] + totalNoise * 1.1))
      d[idx + 1] = Math.min(255, Math.max(0, d[idx + 1] + totalNoise * 0.55))
      d[idx + 2] = Math.min(255, Math.max(0, d[idx + 2] + totalNoise * 0.28))
    }
  }
  ctx.putImageData(imgData, 0, 0)

  // 3. Dark Basaltic Volcanic Plains (Syrtis Major, Acidalia, Terra Sirenum)
  // Syrtis Major (distinct triangular dark shield)
  ctx.fillStyle = '#2d140a'
  ctx.beginPath()
  ctx.moveTo(width * 0.76, height * 0.42)
  ctx.lineTo(width * 0.81, height * 0.56)
  ctx.lineTo(width * 0.72, height * 0.54)
  ctx.closePath()
  ctx.filter = 'blur(16px)'
  ctx.fill()
  ctx.filter = 'none'

  // Acidalia Planitia & Vastitas Borealis (northern dark plains)
  const darkLowlands = [
    { x: width * 0.12, y: height * 0.28, rx: width * 0.14, ry: height * 0.12 },
    { x: width * 0.45, y: height * 0.32, rx: width * 0.18, ry: height * 0.10 },
    { x: width * 0.85, y: height * 0.30, rx: width * 0.12, ry: height * 0.09 },
    // Southern dark maria
    { x: width * 0.35, y: height * 0.65, rx: width * 0.16, ry: height * 0.14 },
    { x: width * 0.62, y: height * 0.68, rx: width * 0.15, ry: height * 0.12 },
  ]
  ctx.fillStyle = 'rgba(40, 16, 7, 0.72)'
  darkLowlands.forEach(reg => {
    ctx.beginPath()
    ctx.ellipse(reg.x, reg.y, reg.rx, reg.ry, 0.1, 0, Math.PI * 2)
    ctx.filter = 'blur(28px)'
    ctx.fill()
    ctx.filter = 'none'
  })

  // 4. Hellas Planitia (Huge bright circular impact basin in southern hemisphere)
  ctx.fillStyle = '#d98b58'
  ctx.beginPath()
  ctx.ellipse(width * 0.78, height * 0.72, width * 0.07, height * 0.11, 0.2, 0, Math.PI * 2)
  ctx.filter = 'blur(12px)'
  ctx.fill()
  ctx.filter = 'none'

  // Argyre Basin
  ctx.fillStyle = '#ce814f'
  ctx.beginPath()
  ctx.ellipse(width * 0.38, height * 0.76, width * 0.05, height * 0.08, -0.1, 0, Math.PI * 2)
  ctx.filter = 'blur(10px)'
  ctx.fill()
  ctx.filter = 'none'

  // 5. Valles Marineris — The Grand Canyon of Mars (4,000 km equatorial rift system)
  ctx.strokeStyle = '#220b04'
  ctx.lineWidth = 14
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(width * 0.22, height * 0.51)
  ctx.bezierCurveTo(
    width * 0.30, height * 0.53,
    width * 0.40, height * 0.49,
    width * 0.52, height * 0.54
  )
  ctx.stroke()

  // Canyon tributary chasms (Melas, Candor, Coprates)
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(width * 0.26, height * 0.49)
  ctx.lineTo(width * 0.36, height * 0.53)
  ctx.moveTo(width * 0.34, height * 0.52)
  ctx.lineTo(width * 0.45, height * 0.56)
  ctx.stroke()

  // 6. Tharsis Volcanic Plateau & Giant Shield Volcanoes
  // Tharsis bulge background
  ctx.fillStyle = 'rgba(196, 92, 38, 0.6)'
  ctx.beginPath()
  ctx.ellipse(width * 0.25, height * 0.44, width * 0.12, height * 0.16, 0.4, 0, Math.PI * 2)
  ctx.filter = 'blur(20px)'
  ctx.fill()
  ctx.filter = 'none'

  // Olympus Mons (largest volcano in solar system: 22km high)
  const omX = width * 0.17
  const omY = height * 0.38
  const omGrad = ctx.createRadialGradient(omX, omY, 4, omX, omY, 42)
  omGrad.addColorStop(0, '#541c09')   // Central Caldera
  omGrad.addColorStop(0.2, '#963c16')
  omGrad.addColorStop(0.7, '#ba5122') // Shield flank
  omGrad.addColorStop(0.9, '#631f08') // Basal scarp
  omGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = omGrad
  ctx.beginPath()
  ctx.arc(omX, omY, 42, 0, Math.PI * 2)
  ctx.fill()
  // Summit caldera pit
  ctx.fillStyle = '#2b0c03'
  ctx.beginPath()
  ctx.arc(omX, omY, 7, 0, Math.PI * 2)
  ctx.fill()

  // Tharsis Montes Trio (Ascraeus, Pavonis, Arsia Mons)
  const tharsisVolcanoes = [
    { x: width * 0.25, y: height * 0.36, r: 24 }, // Ascraeus Mons
    { x: width * 0.23, y: height * 0.44, r: 22 }, // Pavonis Mons
    { x: width * 0.21, y: height * 0.52, r: 24 }, // Arsia Mons
  ]
  tharsisVolcanoes.forEach(v => {
    const vGrad = ctx.createRadialGradient(v.x, v.y, 2, v.x, v.y, v.r)
    vGrad.addColorStop(0, '#2d0e04')
    vGrad.addColorStop(0.3, '#8e3713')
    vGrad.addColorStop(0.85, '#ab491d')
    vGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = vGrad
    ctx.beginPath()
    ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2)
    ctx.fill()
  })

  // 7. Impact Craters across Southern Highlands
  for (let c = 0; c < 50; c++) {
    const cx = pseudoRandom() * width
    const cy = height * 0.45 + pseudoRandom() * (height * 0.42)
    const cr = 4 + pseudoRandom() * 16

    // Dark crater bowl
    ctx.fillStyle = 'rgba(38, 14, 6, 0.7)'
    ctx.beginPath()
    ctx.arc(cx, cy, cr, 0, Math.PI * 2)
    ctx.fill()
    // Bright sunlit rim
    ctx.strokeStyle = 'rgba(235, 150, 95, 0.65)'
    ctx.lineWidth = Math.max(1, cr * 0.2)
    ctx.beginPath()
    ctx.arc(cx, cy, cr, Math.PI * 0.8, Math.PI * 1.8)
    ctx.stroke()
  }

  // 8. North & South Polar Ice Caps (Water Ice & Frozen CO2 with spiral troughs)
  // North Pole
  const npGrad = ctx.createRadialGradient(width * 0.5, 0, 10, width * 0.5, 0, height * 0.14)
  npGrad.addColorStop(0, '#ffffff')
  npGrad.addColorStop(0.55, '#f1f5f9')
  npGrad.addColorStop(0.85, '#cbd5e1')
  npGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = npGrad
  ctx.fillRect(0, 0, width, height * 0.14)

  // South Pole
  const spGrad = ctx.createRadialGradient(width * 0.5, height, 10, width * 0.5, height, height * 0.12)
  spGrad.addColorStop(0, '#ffffff')
  spGrad.addColorStop(0.5, '#f8fafc')
  spGrad.addColorStop(0.85, '#cbd5e1')
  spGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = spGrad
  ctx.fillRect(0, height * 0.88, width, height * 0.12)

  const texture = new THREE.CanvasTexture(canvas)
  textureCache.set('mars_globe_hd', texture)
  return texture
}

/**
 * Dedicated Mars Elevation / Topography Bump Texture
 * Enables realistic 3D shadow relief on Olympus Mons, crater rims, and Valles Marineris
 */
export function getMarsElevationTexture(): THREE.CanvasTexture {
  if (textureCache.has('mars_elevation')) {
    return textureCache.get('mars_elevation')!
  }

  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Neutral mid-gray base (0 elevation datum)
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, width, height)

  // Olympus Mons high elevation peak (bright white = maximum elevation)
  const omX = width * 0.17
  const omY = height * 0.38
  const omGrad = ctx.createRadialGradient(omX, omY, 2, omX, omY, 24)
  omGrad.addColorStop(0, '#505050') // Caldera depression
  omGrad.addColorStop(0.18, '#ffffff') // High peak rim
  omGrad.addColorStop(0.8, '#a8a8a8') // Shield
  omGrad.addColorStop(1, '#808080')
  ctx.fillStyle = omGrad
  ctx.beginPath()
  ctx.arc(omX, omY, 24, 0, Math.PI * 2)
  ctx.fill()

  // Valles Marineris trench (dark gray = deep canyon depression)
  ctx.strokeStyle = '#282828'
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(width * 0.22, height * 0.51)
  ctx.bezierCurveTo(
    width * 0.30, height * 0.53,
    width * 0.40, height * 0.49,
    width * 0.52, height * 0.54
  )
  ctx.stroke()

  // Crater depressions with raised rims
  let seed = 101
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < 40; i++) {
    const cx = pseudoRandom() * width
    const cy = height * 0.42 + pseudoRandom() * (height * 0.48)
    const cr = 3 + pseudoRandom() * 12

    // Depressed floor
    ctx.fillStyle = '#4a4a4a'
    ctx.beginPath()
    ctx.arc(cx, cy, cr, 0, Math.PI * 2)
    ctx.fill()
    // Raised rim
    ctx.strokeStyle = '#c0c0c0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, cr + 1, 0, Math.PI * 2)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  textureCache.set('mars_elevation', texture)
  return texture
}
