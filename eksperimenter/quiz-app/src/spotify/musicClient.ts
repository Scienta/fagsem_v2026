import { shuffle } from '../utils/shuffle'

const ITUNES_API = 'https://itunes.apple.com/search'

const SEARCH_TERMS = [
  'pop hits 2023',
  'pop hits 2022',
  'pop hits 2020',
  'pop hits 2015',
  'pop hits 2010',
  'rock hits',
  'hip hop hits',
  'rnb hits',
  'indie pop hits',
  'dance hits',
  'soul classics',
  'classic rock',
]

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

export async function generateQuizQuestions(count = 10): Promise<QuizQuestion[]> {
  const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)]
  const params = new URLSearchParams({ term, entity: 'song', limit: '25' })

  const response = await fetch(`${ITUNES_API}?${params}`)
  if (!response.ok) throw new Error('iTunes search failed')

  const data = await response.json()
  const tracks = shuffle(
    (data.results as ItunesTrack[]).filter(t => t.previewUrl)
  ).slice(0, count)

  const artistNames = tracks.map(t => t.artistName)

  return tracks.map((track, i) => {
    const distractors = shuffle(artistNames.filter((_, j) => j !== i)).slice(0, 3)
    return {
      correctArtist: track.artistName,
      options: shuffle([track.artistName, ...distractors]),
      previewUrl: track.previewUrl!,
      artworkUrl: track.artworkUrl100?.replace('100x100bb', '600x600bb') ?? '',
    }
  })
}
