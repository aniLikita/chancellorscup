'use client'

import {useEffect, useRef, useState} from 'react'
import { Team, Match } from '@/types/match'
import { supabase } from '@/lib/supabase'
import ClientMatchCarousel from './ClientMatchCarousel'
import ClientLeaderboard from './ClientLeaderboard'
import gsap from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Props = {
    initialMatches: Match[]
    teams: Record<string, Team>
}

export default function ClientHomePage({ initialMatches, teams: initialTeams }: Props) {
    const [matches, setMatches] = useState<Match[]>(initialMatches)
    const [teams, setTeams] = useState<Record<string, Team>>(initialTeams)

    const sectionRef = useRef(null);

    //Animations
    useEffect(() => {
        if (sectionRef.current) {
            gsap.fromTo(
                sectionRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        }
    }, []);

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
        <div
            ref={sectionRef}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 mt-8"
        >
            {/* Matches Carousel - Left Side */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-2xl font-bold text-yellow-400">Live Matches</h3>
                <div
                    className="bg-white/5 border border-white/10
                    rounded-xl p-6 shadow-lg backdrop-blur-sm
                    hover:ring-1 hover:ring-yellow-400 transition-all duration-300">
                    <ClientMatchCarousel initialMatches={matches} teams={teams} />
                </div>
            </div>

            {/* Leaderboard - Right Side */}
            <div className="lg:col-span-1 space-y-4">
                <h3 className="text-2xl font-bold text-yellow-400">Leaderboard</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                    <ClientLeaderboard initialMatches={matches} teams={teams} />
                </div>
            </div>
        </div>
    )
}
