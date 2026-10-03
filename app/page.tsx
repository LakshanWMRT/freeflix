"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { MovieRow } from "@/components/movie-row"
import { VideoPlayer } from "@/components/video-player"
import { SeriesModal } from "@/components/series-modal"
// Removed the static mock data import

export default function Page() {
  const [activeTab, setActiveTab] = useState("Home")
  const [activeMovie, setActiveMovie] = useState<any | null>(null)
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchJellyfinData = async () => {
      try {
        // Fetch Movie and Series types
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Users/7d2eeff951a54399b8cab79ac7d8fc14/Items?Recursive=true&IncludeItemTypes=Movie,Series`,
          {
            headers: {
              Authorization: `MediaBrowser Token="${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}"`,
            },
          }
        )
        const data = await res.json()

        const mappedMovies = data.Items.map((item: any) => {
          const isSeries = item.Type === "Series"
          const isTvShow = isSeries || /S\d{2,}E\d{2,}/i.test(item.Name)
          
          return {
            id: item.Id,
            title: item.Name,
            description: item.Overview || "No description available.",
            year: item.ProductionYear || 2026,
            genres: item.Genres || [], 
            rating: item.OfficialRating || "NR",
            duration: item.RunTimeTicks ? `${Math.round(item.RunTimeTicks / 600000000)}m` : "0m",
            type: isTvShow ? "TV Show" : "Movie",
            isSeries: isSeries,
          
          // EXACT PROPERTY MATCH: Replaced 'thumbnail' with 'poster'
          poster: `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Items/${item.Id}/Images/Primary?api_key=${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}`,
          
          backdrop: `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Items/${item.Id}/Images/Backdrop?api_key=${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}`,
          videoUrl: `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Videos/${item.Id}/stream.mp4?Static=true&api_key=${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}`,
        }})
        
        setMovies(mappedMovies)
      } catch (error) {
        console.error("Failed to fetch library from Jellyfin:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJellyfinData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  const featuredMovie = movies.length > 0 ? movies[0] : null

  // Filter movies based on the active tab
  const displayedItems = movies.filter((movie) => {
    if (activeTab === "TV Shows") return movie.type === "TV Show"
    if (activeTab === "Movies") return movie.type === "Movie"
    return true // Home, New & Popular, etc show all for now
  })

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {featuredMovie && <HeroBanner movie={featuredMovie} onPlay={setActiveMovie} />}

      <div className="relative z-10 -mt-16 space-y-2 pb-16 md:-mt-24">
        {displayedItems.length > 0 ? (
          <>
            <MovieRow title={activeTab === "Home" ? "My Media" : activeTab} movies={displayedItems} onSelect={setActiveMovie} />
            {activeTab === "Home" && (
               <MovieRow title="Recently Added" movies={[...displayedItems].reverse()} onSelect={setActiveMovie} />
            )}
          </>
        ) : (
          <div className="px-12 py-8 text-gray-400">No {activeTab} found in Jellyfin library.</div>
        )}
      </div>

      {activeMovie && !activeMovie.isSeries && (
        <VideoPlayer movie={activeMovie} onClose={() => setActiveMovie(null)} />
      )}
      
      {activeMovie && activeMovie.isSeries && (
        <SeriesModal 
          series={activeMovie} 
          onClose={() => setActiveMovie(null)} 
          onPlay={(episode) => setActiveMovie(episode)} 
        />
      )}
    </main>
  )
}