'use client'

import { Match, Team } from '@/types/match'
import MatchCarousel from './MatchCarousel'

type Props = {
    initialMatches: Match[]
    teams: Record<string, Team>
}

export default function ClientMatchCarousel({ initialMatches, teams }: Props) {
    // Simply pass through the data from parent
    return <MatchCarousel matches={initialMatches} teams={teams} />
}
