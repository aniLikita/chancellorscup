'use client'

import { useEffect, useState } from 'react'
import { Team, Match } from '@/types/match'
import { supabase } from '@/lib/supabase'
import ClientMatchCarousel from './ClientMatchCarousel'
import ClientLeaderboard from './ClientLeaderboard'

type Props = {
    initialMatches: Match[]
    teams: Record<string, Team>
}

export default function ClientHomePage({ initialMatches, teams: initialTeams }: Props) {
    const [matches, setMatches] = useState<Match[]>(initialMatches)
    const [teams, setTeams] = useState<Record<string, Team>>(initialTeams)

    // Real-time listener for matches
    useEffect(() => {
        const matchesChannel = supabase
            .channel('public:matches:homepage')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'matches' },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        const updated = payload.new as Match
                        setMatches((prev) =>
                            prev.map((m) => (m.id === updated.id ? updated : m))
                        )
                    }
                    if (payload.eventType === 'DELETE') {
                        const deleted = payload.old as Match
                        setMatches((prev) => prev.filter((m) => m.id !== deleted.id))
                    }
                    if (payload.eventType === 'INSERT') {
                        const inserted = payload.new as Match
                        setMatches((prev) => [...prev, inserted])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(matchesChannel)
        }
    }, [])

    // Real-time listener for teams
    useEffect(() => {
        const teamsChannel = supabase
            .channel('public:teams:homepage')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'teams' },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        const updated = payload.new as Team
                        setTeams((prev) => ({
                            ...prev,
                            [updated.id]: updated
                        }))
                    }
                    if (payload.eventType === 'DELETE') {
                        const deleted = payload.old as Team
                        setTeams((prev) => {
                            const newTeams = { ...prev }
                            delete newTeams[deleted.id]
                            return newTeams
                        })
                    }
                    if (payload.eventType === 'INSERT') {
                        const inserted = payload.new as Team
                        setTeams((prev) => ({
                            ...prev,
                            [inserted.id]: inserted
                        }))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(teamsChannel)
        }
    }, [])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Matches Carousel - Left Side */}
            <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">Live Matches</h3>
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <ClientMatchCarousel initialMatches={matches} teams={teams} />
                </div>
            </div>

            {/* Leaderboard - Right Side */}
            <div className="lg:col-span-1">
                <ClientLeaderboard initialMatches={matches} teams={teams} />
            </div>
        </div>
    )
}
