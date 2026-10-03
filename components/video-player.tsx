"use client"

import { useEffect, useRef, useState } from "react"
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import type { Movie } from "@/lib/movies"

type VideoPlayerProps = {
  movie: Movie
  onClose: () => void
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v) return
    const time = (Number(e.target.value) / 100) * duration
    v.currentTime = time
    setProgress(Number(e.target.value))
  }

  const enterFullscreen = () => {
    videoRef.current?.requestFullscreen?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <video
        ref={videoRef}
        src={movie.videoUrl}
        className="h-full w-full object-contain"
        autoPlay
        onClick={togglePlay}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (v.duration) setProgress((v.currentTime / v.duration) * 100)
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6">
        <div className="pointer-events-auto">
          <p className="text-xs uppercase tracking-widest text-neutral-400">Now Playing</p>
          <h2 className="text-xl font-bold text-white md:text-2xl">{movie.title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close player"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 md:p-6">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={onSeek}
          aria-label="Seek"
          className="mb-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-red-600"
        />
        <div className="flex items-center gap-4 text-white">
          <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="transition-opacity hover:opacity-70">
            {playing ? <Pause className="h-7 w-7 fill-white" /> : <Play className="h-7 w-7 fill-white" />}
          </button>
          <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="transition-opacity hover:opacity-70">
            {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </button>
          <span className="text-sm tabular-nums text-neutral-300">
            {formatTime((progress / 100) * duration)} / {formatTime(duration)}
          </span>
          <button
            onClick={enterFullscreen}
            aria-label="Fullscreen"
            className="ml-auto transition-opacity hover:opacity-70"
          >
            <Maximize className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
