'use client'

import { useState, useEffect } from 'react'
import { Match, Team } from '@/types/match'
import MatchCard from './MatchCard'

type Props = {
    matches: Match[]
    teams: Record<string, Team>
}

export default function MatchCarousel({ matches, teams }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const maxIndex = Math.max(0, matches.length - 1)

    // Auto-scroll functionality
    useEffect(() => {
        const interval = setInterval(() => {
            if (matches.length > 1) {
                setCurrentIndex((prevIndex) => 
                    prevIndex === maxIndex ? 0 : prevIndex + 1
                )
            }
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [matches.length, maxIndex])

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? maxIndex : prevIndex - 1
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === maxIndex ? 0 : prevIndex + 1
        )
    }

    if (matches.length === 0) {
        return <div className="text-center text-white p-4">No matches available</div>
    }

    return (
        <div className="relative">
            {/* Carousel container */}
            <div className="overflow-hidden min-h-[250px]">
                <div 
                    className="transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    <div className="flex h-full">
                        {matches.map((match) => (
                            <div key={match.id} className="w-full flex-shrink-0 flex items-center justify-center py-6">
                                <MatchCard match={match} teams={teams} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation buttons */}
            {matches.length > 1 && (
                <>
                    <button 
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-r-md hover:bg-black/70 transition-colors"
                        aria-label="Previous match"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-l-md hover:bg-black/70 transition-colors"
                        aria-label="Next match"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
                                index === currentIndex ? 'bg-yellow-400' : 'bg-white/50'
                            }`}
                            aria-label={`Go to match ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
