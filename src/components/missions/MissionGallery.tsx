import { useState, useEffect } from 'react'
import type { MissionPhoto } from '../../data/missions'
import { fetchNasaMissionPhotos } from '../../services/nasaApiService'

interface MissionGalleryProps {
  missionId: string
  missionName: string
  color: string
  fallbackPhotos?: MissionPhoto[]
}

const NASA_QUERY_MAP: Record<string, string> = {
  maven: 'MAVEN Mars atmosphere',
  opportunity: 'Mars Exploration Rover Opportunity',
  apollo11: 'Apollo 11 lunar module Neil Armstrong',
  spirit: 'Mars Exploration Rover Spirit Gusev',
  'lunar-rover': 'Apollo Lunar Roving Vehicle Moon',
}

export default function MissionGallery({
  missionId,
  missionName,
  color,
  fallbackPhotos = [],
}: MissionGalleryProps) {
  const [photos, setPhotos] = useState<MissionPhoto[]>(fallbackPhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<MissionPhoto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLiveApi, setIsLiveApi] = useState(false)

  useEffect(() => {
    let isMounted = true
    const query = NASA_QUERY_MAP[missionId] || `${missionName} NASA`

    async function loadApiPhotos() {
      setIsLoading(true)
      try {
        const liveItems = await fetchNasaMissionPhotos(missionId, query, 8)
        if (isMounted && liveItems && liveItems.length > 0) {
          setPhotos(liveItems)
          setIsLiveApi(true)
        } else if (isMounted && fallbackPhotos.length > 0) {
          setPhotos(fallbackPhotos)
          setIsLiveApi(false)
        }
      } catch (_e) {
        if (isMounted && fallbackPhotos.length > 0) {
          setPhotos(fallbackPhotos)
          setIsLiveApi(false)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadApiPhotos()

    return () => {
      isMounted = false
    }
  }, [missionId, missionName])

  if (photos.length === 0 && !isLoading) return null

  return (
    <div className="w-full glass border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📷</span>
          <div>
            <h3
              className="text-sm font-bold tracking-widest text-white uppercase"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              NASA Photographic Archive // {missionName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400 font-mono">
                {photos.length} HISTORICAL ARCHIVAL PHOTOGRAPHS
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  isLiveApi
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isLiveApi ? '● LIVE NASA API' : '● VERIFIED NASA ARCHIVE'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 font-mono hidden sm:block">
          SOURCE: NASA Image &amp; Video Library
        </div>
      </div>

      {/* Grid of Photo Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative rounded-xl overflow-hidden glass border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg flex flex-col bg-slate-950/60"
          >
            {/* Image Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'p-4')
                    target.parentElement.innerHTML = `<div class="text-center text-xs text-gray-400"><div class="text-2xl mb-1">🛰️</div>${photo.title}</div>`
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

              {photo.date && (
                <span
                  className="absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full glass border border-white/15 text-gray-200"
                >
                  {photo.date}
                </span>
              )}
            </div>

            {/* Caption Header */}
            <div className="p-3 flex-1 flex flex-col justify-between bg-slate-900/40">
              <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-yellow-400 transition-colors">
                {photo.title}
              </h4>
              <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                {photo.caption}
              </p>
              {photo.credit && (
                <div className="text-[9px] text-gray-500 font-mono mt-2 truncate">
                  {photo.credit}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeInUp"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full glass border border-white/20 rounded-2xl overflow-hidden shadow-2xl bg-slate-950/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <h3
                  className="font-bold text-white text-sm sm:text-base tracking-wide"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {selectedPhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-lg glass border border-white/15 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            {/* Modal Caption */}
            <div className="p-4 sm:p-5 bg-slate-900/60 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-400 mb-2">
                {selectedPhoto.date && (
                  <div>
                    NASA ARCHIVAL DATE: <span className="text-white font-bold">{selectedPhoto.date}</span>
                  </div>
                )}
                {selectedPhoto.nasaId && (
                  <div>
                    NASA ID: <span className="text-blue-300 font-bold">{selectedPhoto.nasaId}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {selectedPhoto.caption}
              </p>
              <div className="mt-3 text-[10px] text-gray-500 font-mono">
                CREDIT: {selectedPhoto.credit || 'NASA / Jet Propulsion Laboratory / Goddard Space Flight Center'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
