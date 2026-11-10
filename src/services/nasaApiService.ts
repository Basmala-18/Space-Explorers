import type { MissionPhoto } from '../data/missions'

const cache = new Map<string, MissionPhoto[]>()

/**
 * Searches the official NASA Image and Video Library API (images-api.nasa.gov)
 * This public NASA API requires no API key and returns authentic historical imagery with NASA center citations.
 */
export async function fetchNasaMissionPhotos(
  missionId: string,
  queryKeyword: string,
  limit: number = 6
): Promise<MissionPhoto[]> {
  const cacheKey = `${missionId}_${queryKeyword}`
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }

  const endpoint = `https://images-api.nasa.gov/search?q=${encodeURIComponent(queryKeyword)}&media_type=image`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(endpoint, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`NASA API returned status ${response.status}`)
    }

    const data = await response.json()
    const items = data?.collection?.items || []

    const photos: MissionPhoto[] = items
      .filter((item: any) => item.links?.[0]?.href && item.data?.[0]?.title)
      .slice(0, limit)
      .map((item: any) => {
        const d = item.data[0]
        const rawDate = d.date_created ? d.date_created.slice(0, 10) : undefined
        const center = d.center ? `NASA / ${d.center}` : 'NASA'

        return {
          url: item.links[0].href,
          title: d.title,
          caption: d.description || d.title,
          date: rawDate,
          credit: center,
          nasaId: d.nasa_id,
        }
      })

    if (photos.length > 0) {
      cache.set(cacheKey, photos)
      return photos
    }
    return []
  } catch (err) {
    console.warn(`NASA API query for ${queryKeyword} failed or timed out:`, err)
    return []
  }
}
