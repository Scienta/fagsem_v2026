const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_BASE = 'https://api.spotify.com/v1'

async function fetchAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
  const credentials = btoa(`${clientId}:${clientSecret}`)

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) throw new Error('Failed to fetch Spotify access token')

  const data = await response.json()
  return data.access_token as string
}

export async function fetchPreviewUrl(trackId: string): Promise<string | null> {
  const token = await fetchAccessToken()

  const response = await fetch(`${API_BASE}/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error(`Failed to fetch track ${trackId}`)

  const data = await response.json()
  return data.preview_url as string | null
}
