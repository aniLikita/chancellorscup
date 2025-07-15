'use client'

import { useEffect, useRef, useState } from 'react'
import { Match, Team } from '@/types/match'
import MatchCard from './MatchCard'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
    matches: Match[]
    teams: Record<string, Team>
}

export default function MatchCarousel({ matches, teams }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)

    const maxIndex = Math.max(0, matches.length - 1)

    useEffect(() => {
        const interval = setInterval(() => {
            if (matches.length > 1) {
                setCurrentIndex((prevIndex) =>
                    prevIndex === maxIndex ? 0 : prevIndex + 1
                )
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [matches.length, maxIndex])

    useEffect(() => {
        if (!carouselRef.current) return

        gsap.fromTo(
            carouselRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: carouselRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        )
    }, [])

    if (matches.length === 0) {
        return <div className="text-center text-white p-4">No matches available</div>
    }

    return (
        <div className="relative" ref={carouselRef}>
            {/* Slide Container */}
            <div className="overflow-hidden min-h-[250px]">
                <div
                    className="transition-transform duration-700 ease-in-out flex"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            className="w-full flex-shrink-0 flex items-center justify-center py-6 px-2"
                        >
                            <MatchCard match={match} teams={teams} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Nav Buttons */}
            {matches.length > 1 && (
                <>
                    <button
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === 0 ? maxIndex : currentIndex - 1
                            )
                        }
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-r-md hover:bg-black/70"
                        aria-label="Previous match"
                    >
                        ←
                    </button>
                    <button
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === maxIndex ? 0 : currentIndex + 1
                            )
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-l-md hover:bg-black/70"
                        aria-label="Next match"
                    >
                        →
                    </button>
                </>
            )}

            {/* Indicators */}
            {matches.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    {matches.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                index === currentIndex
                                    ? 'bg-yellow-400'
                                    : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
