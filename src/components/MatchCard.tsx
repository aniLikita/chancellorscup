'use client'

import Image from 'next/image'
import { Match, Team } from '@/types/match'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
    match: Match
    teams: Record<string, Team>
}

export default function MatchCard({ match, teams }: Props) {
    const home = teams[match.home_team]
    const away = teams[match.away_team]
    const cardRef = useRef(null)

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        }
    }, [])

    return (
        <div
            ref={cardRef}
            className="bg-gradient-to-br from-[#1b2e4b] via-[#101e33] to-[#0b1325] rounded-2xl p-6 sm:p-8 shadow-lg w-full max-w-xl mx-auto border border-white/10 backdrop-blur-md hover:ring-2 hover:ring-yellow-400 transition-all"
        >
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Home Team */}
                <div className="flex items-center gap-2 min-w-[100px]">
                    <Image
                        src={home?.logo_url || '/default-logo.png'}
                        alt={home?.name || 'Home'}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <span className="text-white font-semibold">
                        {home?.short_name}
                    </span>
                </div>

                {/* Score */}
                <div className="text-3xl font-extrabold text-yellow-400">
                    {match.home_score} : {match.away_score}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-2 min-w-[100px]">
                    <Image
                        src={away?.logo_url || '/default-logo.png'}
                        alt={away?.name || 'Away'}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <span className="text-white font-semibold">
                        {away?.short_name}
                    </span>
                </div>
            </div>

            {/* Status */}
            <div className="text-center mt-4">
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        match.status === 'live'
                            ? 'bg-red-500 text-white'
                            : match.status === 'finished'
                                ? 'bg-gray-500 text-white'
                                : 'bg-yellow-500 text-black'
                    }`}
                >
                    {match.status.toUpperCase()}
                </span>
            </div>
        </div>
    )
}
