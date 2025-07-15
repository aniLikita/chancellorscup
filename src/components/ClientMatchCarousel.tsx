'use client'

import { Match, Team } from '@/types/match'
import MatchCarousel from './MatchCarousel'

type Props = {
    initialMatches: Match[]
    teams: Record<string, Team>
}

export default function ClientMatchCarousel({ initialMatches, teams }: Props) {
    return (
        <div className="relative overflow-hidden">
            <MatchCarousel matches={initialMatches} teams={teams} />
        </div>
    )
}
