"use client"

import { Play, Plus, Info } from "lucide-react"
import type { Movie } from "@/lib/movies"

type HeroBannerProps = {
  movie: Movie
  onPlay: (movie: Movie) => void
}

export function HeroBanner({ movie, onPlay }: HeroBannerProps) {
  return (
    <section className="relative h-[70vh] min-h-[520px] w-full md:h-[85vh]">
      <img
        src="/movies/3.jpeg"
        alt={`${movie.title} backdrop`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 flex h-full max-w-[1600px] flex-col justify-end px-4 pb-20 md:px-8 md:pb-28">
        <div className="max-w-xl">
          <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-500">
            <span className="text-lg font-black">N</span> Featured Film
          </span>
          <h1 className="text-balance text-4xl font-black text-white drop-shadow-lg md:text-6xl">
            {movie.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
            <span className="font-semibold text-green-400">98% Match</span>
            <span>{movie.year}</span>
            <span className="rounded border border-neutral-500 px-1.5 text-xs">{movie.rating}</span>
            <span>{movie.duration}</span>
            <span>{movie.genres.join(" • ")}</span>
          </div>
          <p className="mt-4 text-pretty text-base leading-relaxed text-neutral-200 drop-shadow md:text-lg">
            {movie.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(movie)}
              className="inline-flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition-colors hover:bg-white/80"
            >
              <Play className="h-5 w-5 fill-black" /> Play
            </button>
            <button className="inline-flex items-center gap-2 rounded bg-neutral-500/40 px-6 py-2.5 font-semibold text-white backdrop-blur transition-colors hover:bg-neutral-500/60">
              <Info className="h-5 w-5" /> More Info
            </button>
            <button
              aria-label="Add to My List"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-neutral-400 text-white transition-colors hover:border-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
