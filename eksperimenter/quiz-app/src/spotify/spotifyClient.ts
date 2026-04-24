import { shuffle } from '../utils/shuffle'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API = 'https://api.spotify.com/v1'
const ITUNES_API = 'https://itunes.apple.com/search'

const SEARCH_QUERIES = [
  'pop hits 2023',
  'pop hits 2020',
  'pop hits 2015',
  'pop hits 2010',
  'rock classics',
  'hip hop hits',
  'rnb hits',
  'indie hits',
  'dance hits',
  'soul classics',
]

export interface QuizQuestion {
  correctArtist: string
  options: string[]
  previewUrl: string
  artworkUrl: string
}

async function fetchSpotifyToken(): Promise<string> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
  const credentials = btoa(`${clientId}:${clientSecret}`)

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token as string
}

interface SpotifyTrack {
  name: string
  artists: Array<{ name: string }>
}

async function searchTracks(query: string, token: string): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({ q: query, type: 'track', limit: '20' })
  const response = await fetch(`${SPOTIFY_API}/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  return (data.tracks?.items ?? []) as SpotifyTrack[]
}

async function fetchItunesPreview(
  artist: string,
  trackName: string
): Promise<{ previewUrl: string; artworkUrl: string } | null> {
  const params = new URLSearchParams({
    term: `${trackName} ${artist}`,
    entity: 'song',
    limit: '5',
  })
  const response = await fetch(`${ITUNES_API}?${params}`)
  if (!response.ok) return null

  const data = await response.json()
  const results: Array<{ previewUrl?: string; artworkUrl100?: string }> = data.results
  const hit = results.find(r => r.previewUrl)
  if (!hit?.previewUrl) return null

  return {
    previewUrl: hit.previewUrl,
    artworkUrl: hit.artworkUrl100?.replace('100x100bb', '600x600bb') ?? '',
  }
}

export async function generateQuizQuestions(count = 10): Promise<QuizQuestion[]> {
  const token = await fetchSpotifyToken()
  const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)]
  const tracks = shuffle(await searchTracks(query, token))

  const withPreviews = await Promise.all(
    tracks.slice(0, count * 2).map(async t => {
      const artist = t.artists[0]?.name
      if (!artist) return null
      const preview = await fetchItunesPreview(artist, t.name)
      return preview ? { artist, preview } : null
    })
  )

  const valid = withPreviews.filter(
    (x): x is { artist: string; preview: { previewUrl: string; artworkUrl: string } } => x !== null
  )
  const selected = valid.slice(0, count)
  const artistNames = selected.map(s => s.artist)

  return selected.map(({ artist, preview }) => ({
    correctArtist: artist,
    options: shuffle([artist, ...shuffle(artistNames.filter(a => a !== artist)).slice(0, 3)]),
    previewUrl: preview.previewUrl,
    artworkUrl: preview.artworkUrl,
  }))
}
