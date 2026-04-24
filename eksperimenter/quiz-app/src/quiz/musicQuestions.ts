export interface MusicQuestion {
  spotifyTrackId: string
  correctArtist: string
  options: string[]
}

export const musicQuestions: MusicQuestion[] = [
  {
    spotifyTrackId: '7qiZfU4dY1lWllzX7mPBI3', // Shape of You
    correctArtist: 'Ed Sheeran',
    options: ['Ed Sheeran', 'Justin Bieber', 'Sam Smith', 'Charlie Puth'],
  },
  {
    spotifyTrackId: '0VjIjW4GlUZAMYd2vXMi3b', // Blinding Lights
    correctArtist: 'The Weeknd',
    options: ['The Weeknd', 'Drake', 'Post Malone', 'Bruno Mars'],
  },
  {
    spotifyTrackId: '2Fxmhks0live0CHinLkiSr', // bad guy
    correctArtist: 'Billie Eilish',
    options: ['Billie Eilish', 'Dua Lipa', 'Ariana Grande', 'Doja Cat'],
  },
  {
    spotifyTrackId: '1zi7xx7UVEFkmKfv06H8x0', // Someone Like You
    correctArtist: 'Adele',
    options: ['Adele', 'Amy Winehouse', 'Beyoncé', 'Lana Del Rey'],
  },
  {
    spotifyTrackId: '32OlwWuMpZ6b0aN2RZOeMS', // Uptown Funk
    correctArtist: 'Mark Ronson ft. Bruno Mars',
    options: ['Mark Ronson ft. Bruno Mars', 'Pharrell Williams', 'Justin Timberlake', 'Daft Punk'],
  },
  {
    spotifyTrackId: '3z8h0TU7ReDPLIbEnYhWZb', // Bohemian Rhapsody
    correctArtist: 'Queen',
    options: ['Queen', 'David Bowie', 'Elton John', 'Led Zeppelin'],
  },
  {
    spotifyTrackId: '3n3Ppam7vgaVa1iaRUIOKE', // Mr. Brightside
    correctArtist: 'The Killers',
    options: ['The Killers', 'Arctic Monkeys', 'Arcade Fire', 'Franz Ferdinand'],
  },
  {
    spotifyTrackId: '4cOdK2wGLETKBW3PvgPWqT', // Rockstar
    correctArtist: 'Post Malone',
    options: ['Post Malone', 'Travis Scott', 'Lil Uzi Vert', 'Juice WRLD'],
  },
  {
    spotifyTrackId: '0e7ipj03S05BNilyu5bRzt', // Umbrella
    correctArtist: 'Rihanna',
    options: ['Rihanna', 'Beyoncé', 'Nicki Minaj', 'Cardi B'],
  },
  {
    spotifyTrackId: '40riOy7x9W7GXjyGp4pjAv', // Hotel California
    correctArtist: 'Eagles',
    options: ['Eagles', 'Fleetwood Mac', 'The Doors', 'Lynyrd Skynyrd'],
  },
]
