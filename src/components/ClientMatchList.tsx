'use client'

import { useEffect, useState } from 'react'
import { Match, Team } from '@/types/match'
import { supabase } from '@/lib/supabase'
import MatchCard from './MatchCard'

type Props = {
    initialMatches: Match[]
    teams: Record<string, Team>
}

export default function ClientMatchList({ initialMatches, teams }: Props) {
    const [matches, setMatches] = useState<Match[]>(initialMatches)

    useEffect(() => {
        const channel = supabase
            .channel('public:matches')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'matches' },
                (payload) => {
                    const updated = payload.new as Match
                    setMatches((prev) =>
                        prev.map((m) => (m.id === updated.id ? updated : m))
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="space-y-4">
            {matches.map((match) => (
                <MatchCard key={match.id} match={match} teams={teams} />
            ))}
        </div>
    )
}
