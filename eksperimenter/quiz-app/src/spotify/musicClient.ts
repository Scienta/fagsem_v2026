import { shuffle } from '../utils/shuffle'

const ITUNES_API = 'https://itunes.apple.com/search'

export interface QuizQuestion {
  correctArtist: string
  options: string[]
  previewUrl: string
  artworkUrl: string
}

interface ItunesTrack {
  artistName: string
  previewUrl?: string
  artworkUrl100?: string
}

export async function generateQuizQuestions(terms: string[], count = 10): Promise<QuizQuestion[]> {
  const term = terms[Math.floor(Math.random() * terms.length)]
  const params = new URLSearchParams({ term, entity: 'song', limit: '25' })

  const response = await fetch(`${ITUNES_API}?${params}`)
  if (!response.ok) throw new Error('iTunes search failed')

  const data = await response.json()
  const tracks = shuffle(
    (data.results as ItunesTrack[]).filter(t => t.previewUrl)
  ).slice(0, count)

  const uniqueArtists = [...new Set(tracks.map(t => t.artistName))]

  return tracks.map((track) => {
    const distractors = shuffle(uniqueArtists.filter(name => name !== track.artistName)).slice(0, 3)
    return {
      correctArtist: track.artistName,
      options: shuffle([track.artistName, ...distractors]),
      previewUrl: track.previewUrl!,
      artworkUrl: track.artworkUrl100?.replace('100x100bb', '600x600bb') ?? '',
    }
  })
}
