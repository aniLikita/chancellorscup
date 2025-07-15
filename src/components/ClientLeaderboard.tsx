'use client'

import { Match, Team } from '@/types/match'
import Leaderboard from './Leaderboard'

type Props = {
    initialMatches: Match[]
    teams: Record<string, Team>
}

export default function ClientLeaderboard({ initialMatches, teams }: Props) {
    return <Leaderboard matches={initialMatches} teams={teams} />
}
