'use client'

import { Team, Match } from '@/types/match'
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
    matches: Match[]
}

export default function Leaderboard({ teams, matches}: Props) {
    const leaderboardData: LeaderboardTeam[] = Object.values(teams)
        .map((team)=> {
            const playedMatches = matches.filter(
                (m) =>
                    m.status === 'finished' &&
                    (m.home_team === team.id || m.away_team === team.id)
            )

            let won = 0,
                drawn = 0,
                lost = 0,
                goalsFor = 0,
                goalsAgainst = 0

            playedMatches.forEach((match) => {
                const isHome = match.home_team === team.id
                const myScore = isHome ? match.home_score : match.away_score
                const oppScore = isHome ? match.away_score : match.home_score

                goalsFor += myScore
                goalsAgainst += oppScore

                if (myScore > oppScore) won++
                else if (myScore === oppScore) drawn++
                else lost++
            })

            const played = won + drawn + lost
            const points = won * 3 + drawn


            return {
                team,
                played,
                won,
                drawn,
                lost,
                goalsFor,
                goalsAgainst,
                points,
            }

        })

        .sort ((a, b) => {
         if (b.points === a.points)  {
            const goalDiffA = a.goalsFor - a.goalsAgainst
            const goalDiffB = b.goalsFor - b.goalsAgainst
            return goalDiffB - goalDiffA
        }
        return b.points - a.points

        })


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