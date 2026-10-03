export type Movie = {
  id: string
  title: string
  poster: string
  backdrop?: string
  year: number
  rating: string
  duration: string
  genres: string[]
  description: string
  videoUrl: string
}

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
]



export const featuredMovie: Movie = {
  id: "featured-neon-horizon",
  title: "Neon Horizon",
  poster: "/movies/poster-1.png",
  year: 2026,
  rating: "TV-MA",
  duration: "2h 14m",
  genres: ["Sci-Fi", "Thriller", "Cyberpunk"],
  description:
    "In a rain-drenched megacity ruled by corporations, a rogue detective uncovers a conspiracy that blurs the line between memory and machine. Time is running out before the horizon goes dark.",
  videoUrl: SAMPLE_VIDEOS[0],
}

export const myMovies: Movie[] = [
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    poster: "/movies/poster-1.png",
    year: 2026,
    rating: "TV-MA",
    duration: "2h 14m",
    genres: ["Sci-Fi", "Thriller"],
    description:
      "A rogue detective uncovers a conspiracy that blurs the line between memory and machine in a rain-drenched megacity.",
    videoUrl: SAMPLE_VIDEOS[0],
  },
  {
    id: "stellar-drift",
    title: "Stellar Drift",
    poster: "/movies/poster-2.png",
    year: 2025,
    rating: "PG-13",
    duration: "1h 58m",
    genres: ["Adventure", "Space"],
    description:
      "A lone crew drifts toward an uncharted ringed planet, chasing the last signal from a vanished expedition.",
    videoUrl: SAMPLE_VIDEOS[1],
  },
  {
    id: "the-silent-room",
    title: "The Silent Room",
    poster: "/movies/poster-3.png",
    year: 2024,
    rating: "TV-MA",
    duration: "1h 42m",
    genres: ["Mystery", "Noir"],
    description:
      "Behind one glowing door lies a secret an entire town has spent decades trying to forget.",
    videoUrl: SAMPLE_VIDEOS[2],
  },
  {
    id: "ember-crown",
    title: "Ember Crown",
    poster: "/movies/poster-4.png",
    year: 2025,
    rating: "TV-14",
    duration: "2h 31m",
    genres: ["Fantasy", "Epic"],
    description:
      "A disgraced warrior must reclaim a throne forged in fire before the last ember of her kingdom fades.",
    videoUrl: SAMPLE_VIDEOS[3],
  },
  {
    id: "midnight-run",
    title: "Midnight Run",
    poster: "/movies/poster-5.png",
    year: 2026,
    rating: "R",
    duration: "1h 49m",
    genres: ["Crime", "Drama"],
    description:
      "One driver, one night, and a city full of people who want what's in the trunk.",
    videoUrl: SAMPLE_VIDEOS[4],
  },
  {
    id: "frozen-depths",
    title: "Frozen Depths",
    poster: "/movies/poster-6.png",
    year: 2024,
    rating: "PG-13",
    duration: "2h 03m",
    genres: ["Adventure", "Survival"],
    description:
      "Stranded beneath the aurora, an explorer races the cold to reach a signal that may not be human.",
    videoUrl: SAMPLE_VIDEOS[5],
  },
]
