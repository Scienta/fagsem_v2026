export type Genre = 'mixed' | 'pop' | 'rock' | 'metal' | 'hiphop' | 'rnb'

export interface GenreConfig {
  label: string
  emoji: string
  theme: string
  terms: string[]
}

export const GENRES: Record<Genre, GenreConfig> = {
  mixed: {
    label: 'Blandet',
    emoji: '🎵',
    theme: '',
    terms: [
      'pop hits 2023', 'pop hits 2022', 'pop hits 2020',
      'rock hits', 'hip hop hits', 'rnb hits',
      'indie pop hits', 'dance hits', 'soul classics', 'classic rock',
    ],
  },
  pop: {
    label: 'Pop',
    emoji: '✨',
    theme: 'theme-pop',
    terms: ['pop hits 2023', 'pop hits 2022', 'pop hits 2020', 'pop hits 2015', 'pop hits 2010', 'indie pop hits', 'dance hits'],
  },
  rock: {
    label: 'Rock',
    emoji: '🎸',
    theme: 'theme-rock',
    terms: ['rock hits', 'classic rock', '80s rock hits', 'hard rock 80s', '80s arena rock'],
  },
  metal: {
    label: 'Metal',
    emoji: '🤘',
    theme: 'theme-metal',
    terms: ['heavy metal 80s', 'hair metal 80s', 'glam metal', 'thrash metal classics', '80s metal hits'],
  },
  hiphop: {
    label: 'Hip Hop',
    emoji: '🎤',
    theme: 'theme-hiphop',
    terms: ['hip hop hits'],
  },
  rnb: {
    label: 'R&B',
    emoji: '🎹',
    theme: 'theme-rnb',
    terms: ['rnb hits', 'soul classics'],
  },
}

export const GENRE_ORDER: Genre[] = ['mixed', 'pop', 'rock', 'metal', 'hiphop', 'rnb']
