export interface MusicQuestion {
  searchQuery: string
  correctArtist: string
  options: string[]
}

export const musicQuestions: MusicQuestion[] = [
  {
    searchQuery: 'Shape of You Ed Sheeran',
    correctArtist: 'Ed Sheeran',
    options: ['Ed Sheeran', 'Justin Bieber', 'Sam Smith', 'Charlie Puth'],
  },
  {
    searchQuery: 'Blinding Lights The Weeknd',
    correctArtist: 'The Weeknd',
    options: ['The Weeknd', 'Drake', 'Post Malone', 'Bruno Mars'],
  },
  {
    searchQuery: 'bad guy Billie Eilish',
    correctArtist: 'Billie Eilish',
    options: ['Billie Eilish', 'Dua Lipa', 'Ariana Grande', 'Doja Cat'],
  },
  {
    searchQuery: 'Someone Like You Adele',
    correctArtist: 'Adele',
    options: ['Adele', 'Amy Winehouse', 'Beyoncé', 'Lana Del Rey'],
  },
  {
    searchQuery: 'Uptown Funk Mark Ronson Bruno Mars',
    correctArtist: 'Mark Ronson ft. Bruno Mars',
    options: ['Mark Ronson ft. Bruno Mars', 'Pharrell Williams', 'Justin Timberlake', 'Daft Punk'],
  },
  {
    searchQuery: 'Bohemian Rhapsody Queen',
    correctArtist: 'Queen',
    options: ['Queen', 'David Bowie', 'Elton John', 'Led Zeppelin'],
  },
  {
    searchQuery: 'Mr. Brightside The Killers',
    correctArtist: 'The Killers',
    options: ['The Killers', 'Arctic Monkeys', 'Arcade Fire', 'Franz Ferdinand'],
  },
  {
    searchQuery: 'Rockstar Post Malone 21 Savage',
    correctArtist: 'Post Malone',
    options: ['Post Malone', 'Travis Scott', 'Lil Uzi Vert', 'Juice WRLD'],
  },
  {
    searchQuery: 'Umbrella Rihanna',
    correctArtist: 'Rihanna',
    options: ['Rihanna', 'Beyoncé', 'Nicki Minaj', 'Cardi B'],
  },
  {
    searchQuery: 'Hotel California Eagles',
    correctArtist: 'Eagles',
    options: ['Eagles', 'Fleetwood Mac', 'The Doors', 'Lynyrd Skynyrd'],
  },
]
