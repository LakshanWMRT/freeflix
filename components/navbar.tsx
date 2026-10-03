"use client"

import { useEffect, useState } from "react"
import { Bell, Search } from "lucide-react"

const NAV_LINKS = ["Home", "TV Shows", "Movies", "New & Popular", "My List"]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 md:h-20 md:px-8">
        <span className="flex select-none items-baseline gap-1.5">
          <span className="text-2xl font-black tracking-tight text-red-600 md:text-3xl">FreeFlix</span>
          <span className="text-xs font-medium text-neutral-400">by Randika</span>
        </span>
        <ul className="ml-4 hidden items-center gap-5 text-sm text-neutral-200 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <li key={link}>
              <a
                href="#"
                className={`transition-colors hover:text-white ${
                  i === 0 ? "font-semibold text-white" : ""
                }`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-4 text-white">
          <button aria-label="Search" className="transition-opacity hover:opacity-70">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Notifications" className="transition-opacity hover:opacity-70">
            <Bell className="h-5 w-5" />
          </button>
          <div
            aria-hidden
            className="h-8 w-8 rounded bg-gradient-to-br from-red-500 to-orange-500"
          />
        </div>
      </nav>
    </header>
  )
}
