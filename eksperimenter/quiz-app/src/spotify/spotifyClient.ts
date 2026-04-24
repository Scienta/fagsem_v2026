const ITUNES_API = 'https://itunes.apple.com/search'

export async function searchPreviewUrl(query: string): Promise<string | null> {
  const params = new URLSearchParams({ term: query, entity: 'song', limit: '5' })
  const response = await fetch(`${ITUNES_API}?${params}`)

  if (!response.ok) throw new Error(`iTunes search failed for: ${query}`)

  const data = await response.json()
  const results: Array<{ previewUrl?: string }> = data.results
  const trackWithPreview = results.find(t => t.previewUrl)
  return trackWithPreview?.previewUrl ?? null
}
