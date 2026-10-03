"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Movie } from "@/lib/movies"
import { MovieCard } from "@/components/movie-card"

type MovieRowProps = {
  title: string
  movies: Movie[]
  onSelect: (movie: Movie) => void
}

export function MovieRow({ title, movies, onSelect }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section className="group/row relative py-4">
      <h2 className="mb-3 px-4 text-lg font-bold text-white md:px-8 md:text-xl">{title}</h2>

      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy("left")}
          className="absolute left-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
          ))}
        </div>

        <button
          aria-label="Scroll right"
          onClick={() => scrollBy("right")}
          className="absolute right-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </section>
  )
}
