import { shuffle } from '../utils/shuffle'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API = 'https://api.spotify.com/v1'
const ITUNES_API = 'https://itunes.apple.com/search'

const PLAYLIST_POOL = [
  '37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits
  '37i9dQZF1DX10zKzsJ2jva', // Global Top 50
  '37i9dQZF1DX5Ejj0EkURtP', // All Out 2010s
  '37i9dQZF1DX4o1uurG5WaT', // All Out 2000s
  '37i9dQZF1DXbTxeAdrVG2l', // All Out 90s
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

async function fetchPlaylistTracks(playlistId: string, token: string): Promise<SpotifyTrack[]> {
  const response = await fetch(
    `${SPOTIFY_API}/playlists/${playlistId}/tracks?limit=50&fields=items(track(name,artists))`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await response.json()
  return (data.items as Array<{ track: SpotifyTrack | null }>)
    .map(item => item.track)
    .filter((t): t is SpotifyTrack => t !== null)
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
  const playlistId = PLAYLIST_POOL[Math.floor(Math.random() * PLAYLIST_POOL.length)]
  const tracks = shuffle(await fetchPlaylistTracks(playlistId, token))

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
