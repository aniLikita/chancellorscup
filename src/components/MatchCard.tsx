'use client'

import Image from 'next/image'
import { Match, Team } from '@/types/match'

type Props = {
    match: Match
    teams: Record<string, Team>
}

export default function MatchCard({ match, teams }: Props) {
    const home = teams[match.home_team]
    const away = teams[match.away_team]

    return (
        <div className="bg-gray-800 p-4 rounded-2xl shadow flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center justify-center w-full sm:w-auto gap-6">
                {/* Home team */}
                <div className="flex items-center gap-2 justify-end min-w-[100px]">
                    <Image
                        src={home?.logo_url || '/default-logo.png'}
                        alt={home?.name || 'Home'}
                        width={40}
                        height={40}
                    />
                    <span className="font-medium">{home?.short_name}</span>
                </div>

                {/* Score */}
                <div className="text-3xl font-bold mx-4 text-center min-w-[80px]">
                    {match.home_score} : {match.away_score}
                </div>

                {/* Away team */}
                <div className="flex items-center gap-2 justify-start min-w-[100px]">
                    <Image
                        src={away?.logo_url || '/default-logo.png'}
                        alt={away?.name || 'Away'}
                        width={40}
                        height={40}
                    />
                    <span className="font-medium">{away?.short_name}</span>
                </div>
            </div>

            {/* Match status */}
            <span
                className={`mt-2 sm:mt-0 px-3 py-1 text-xs rounded-full ${
                    match.status === 'live'
                        ? 'bg-red-600'
                        : match.status === 'finished'
                            ? 'bg-gray-500'
                            : 'bg-yellow-500'
                }`}
            >
        {match.status.toUpperCase()}
      </span>
        </div>
    )
}
