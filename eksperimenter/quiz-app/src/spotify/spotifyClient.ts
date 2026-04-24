const ITUNES_API = 'https://itunes.apple.com/search'

export interface TrackPreview {
  previewUrl: string
  artworkUrl: string
}

export async function searchTrack(query: string): Promise<TrackPreview | null> {
  const params = new URLSearchParams({ term: query, entity: 'song', limit: '5' })
  const response = await fetch(`${ITUNES_API}?${params}`)

  if (!response.ok) throw new Error(`iTunes search failed for: ${query}`)

  const data = await response.json()
  const results: Array<{ previewUrl?: string; artworkUrl100?: string }> = data.results
  const track = results.find(t => t.previewUrl)
  if (!track?.previewUrl) return null

  return {
    previewUrl: track.previewUrl,
    artworkUrl: track.artworkUrl100?.replace('100x100bb', '600x600bb') ?? '',
  }
}
