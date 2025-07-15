'use client'

import { Team } from '@/types/match'
import Image from 'next/image'

type LeaderboardTeam = {
    team: Team
    points: number
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
}

type Props = {
    teams: Record<string, Team>
}

export default function Leaderboard({ teams }: Props) {
    // In a real application, this data would come from the database
    // For now, we'll create some mock data based on the teams we have
    const leaderboardData: LeaderboardTeam[] = Object.values(teams)
        .map(team => ({
            team,
            points: Math.floor(Math.random() * 30),
            played: Math.floor(Math.random() * 15),
            won: Math.floor(Math.random() * 10),
            drawn: Math.floor(Math.random() * 5),
            lost: Math.floor(Math.random() * 5),
            goalsFor: Math.floor(Math.random() * 30),
            goalsAgainst: Math.floor(Math.random() * 20),
        }))
        .sort((a, b) => b.points - a.points);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-white">
                    <thead className="text-xs uppercase bg-white/10">
                        <tr>
                            <th scope="col" className="px-2 py-3">#</th>
                            <th scope="col" className="px-2 py-3">Team</th>
                            <th scope="col" className="px-2 py-3 text-center">P</th>
                            <th scope="col" className="px-2 py-3 text-center">W</th>
                            <th scope="col" className="px-2 py-3 text-center">D</th>
                            <th scope="col" className="px-2 py-3 text-center">L</th>
                            <th scope="col" className="px-2 py-3 text-center">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((item, index) => (
                            <tr key={item.team.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="px-2 py-2">{index + 1}</td>
                                <td className="px-2 py-2 flex items-center gap-2">
                                    <Image
                                        src={item.team.logo_url || '/default-logo.png'}
                                        alt={item.team.name}
                                        width={20}
                                        height={20}
                                    />
                                    <span>{item.team.short_name}</span>
                                </td>
                                <td className="px-2 py-2 text-center">{item.played}</td>
                                <td className="px-2 py-2 text-center">{item.won}</td>
                                <td className="px-2 py-2 text-center">{item.drawn}</td>
                                <td className="px-2 py-2 text-center">{item.lost}</td>
                                <td className="px-2 py-2 text-center font-bold">{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}