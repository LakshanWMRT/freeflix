"use client"

import { useEffect, useState } from "react"
import { X, Play } from "lucide-react"
import type { Movie } from "@/lib/movies"

type SeriesModalProps = {
  series: Movie
  onClose: () => void
  onPlay: (episode: Movie) => void
}

export function SeriesModal({ series, onClose, onPlay }: SeriesModalProps) {
  const [episodes, setEpisodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSeason, setSelectedSeason] = useState<string>("")

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Users/7d2eeff951a54399b8cab79ac7d8fc14/Items?ParentId=${series.id}&IncludeItemTypes=Episode&Recursive=true`,
          {
            headers: {
              Authorization: `MediaBrowser Token="${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}"`,
            },
          }
        )
        const data = await res.json()
        const items = data.Items || []
        setEpisodes(items)
        if (items.length > 0) {
          const seasons = Array.from(new Set(items.map((ep: any) => ep.SeasonName || "Season 1"))) as string[]
          setSelectedSeason(seasons[0])
        }
      } catch (error) {
        console.error("Failed to fetch episodes:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEpisodes()
  }, [series.id])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-sm">
      <div className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
        
        {/* Header Image */}
        <div className="relative h-48 w-full md:h-64 shrink-0">
          <img
            src={series.backdrop || series.poster}
            alt={series.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
            <h2 className="text-3xl font-bold text-white md:text-5xl">{series.title}</h2>
          </div>
        </div>

        {/* Episodes List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* Season Selector */}
          {!isLoading && episodes.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Array.from(new Set(episodes.map((ep) => ep.SeasonName || "Season 1"))).map((season: any) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedSeason === season
                      ? "bg-red-600 text-white"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center p-8">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
          ) : episodes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {episodes
                .filter((ep) => (ep.SeasonName || "Season 1") === selectedSeason)
                .map((ep, index) => {
                const epImageUrl = `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Items/${ep.Id}/Images/Primary?api_key=${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}`
                
                return (
                  <button
                    key={ep.Id}
                    onClick={() => {
                      onPlay({
                        id: ep.Id,
                        title: `${series.title} - ${ep.Name}`,
                        poster: epImageUrl,
                        year: series.year,
                        rating: series.rating,
                        duration: ep.RunTimeTicks ? `${Math.round(ep.RunTimeTicks / 600000000)}m` : "0m",
                        genres: [],
                        description: ep.Overview || "No description available.",
                        videoUrl: `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Videos/${ep.Id}/stream.mp4?Static=true&api_key=${process.env.NEXT_PUBLIC_JELLYFIN_TOKEN}`,
                        isSeries: false
                      })
                    }}
                    className="group flex flex-col md:flex-row items-start md:items-center gap-4 rounded-lg bg-neutral-800/50 p-4 transition-colors hover:bg-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-white text-left"
                  >
                    <div className="relative aspect-video w-full md:w-40 shrink-0 overflow-hidden rounded bg-neutral-900">
                      <img src={epImageUrl} alt={ep.Name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="h-8 w-8 fill-white text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-red-500 transition-colors">
                        {index + 1}. {ep.Name}
                      </h4>
                      <p className="mt-1 text-sm text-neutral-400 line-clamp-3">
                        {ep.Overview || "No description available."}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-neutral-400">No episodes found.</p>
          )}
        </div>

      </div>
    </div>
  )
}
