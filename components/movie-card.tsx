"use client"

import { Play } from "lucide-react"
import type { Movie } from "@/lib/movies"

type MovieCardProps = {
  movie: Movie
  onSelect: (movie: Movie) => void
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <button
      onClick={() => onSelect(movie)}
      className="group relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-md bg-neutral-900 outline-none transition-transform duration-300 hover:z-10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white sm:w-44 md:w-48"
      aria-label={`Play ${movie.title}`}
    >
      <img
        src={movie.poster || "/placeholder.svg"}
        alt={`${movie.title} poster`}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
          <Play className="h-5 w-5 fill-black text-black" />
        </div>
        <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
        <p className="text-xs text-neutral-300">
          {movie.year} • {movie.duration}
        </p>
      </div>
    </button>
  )
}
