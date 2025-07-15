'use client'
// Page where admin can access

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Match, Team } from '@/types/match'
import CreateMatchForm from "@/components/CreateMatchForm";

const AdminPage = () => {
    const [matches, setMatches] = useState<Match[]>([])
    const [teams, setTeams] = useState<Record<string, Team>>({})
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const fetchMatches = async () => {
        const {data: matchesData} = await supabase
            .from('matches')
            .select('*')
            .order('start_time', {ascending: true})
            setMatches(matchesData || [])
    }
    useEffect(() => {
        const fetchData = async () => {
            await fetchMatches()

            const { data: teamData } = await supabase.from('teams').select('*')

            const teamMap: Record<string, Team> = {}
            teamData?.forEach((team) => (teamMap[team.id] = team))
            setTeams(teamMap)
        }

        fetchData()

        //  Realtime listener
        const channel = supabase
            .channel('public:matches')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'matches' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const inserted = payload.new as Match
                        setMatches((prev) => [...prev, inserted])
                    }

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
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, []);

    const updateScore = async (
        id: string,
        home_score: number,
        away_score: number,
        status: string
    ) => {
        setLoadingId(id)

        const { error } = await supabase
            .from('matches')
            .update({ home_score, away_score, status })
            .eq('id', id)

        if (error) alert('Failed to update score')

        setLoadingId(null)
    }
  return (
      <div className="space-y-8">
          <main className="max-w-4xl mx-auto p-4 space-y-6">
              <CreateMatchForm />
              {/* Existing match list goes here */}
          </main>

          <h1 className="text-2xl font-bold">Update Match Scores</h1>

          {matches.map((match) => {
              const home = teams[match.home_team]
              const away = teams[match.away_team]

              const handleDelete = async (id: string) => {
                  const confirm = window.confirm('Are you sure you want to delete this match?')
                  if (!confirm) return

                  const { error } = await supabase.from('matches').delete().eq('id', id)

                  if (error) {
                      console.error('Delete error:', error)
                      alert('Something went wrong while deleting.')
                  }
              }

              return (

                  <form
                      key={match.id}
                      className="border border-gray-700 rounded-xl p-6 bg-gray-900 space-y-4"
                      onSubmit={(e) => {
                          e.preventDefault()
                          updateScore(match.id, match.home_score, match.away_score, match.status)
                      }}
                  >
                      <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">
                              {home?.short_name || 'Home'} vs {away?.short_name || 'Away'}
                          </h2>
                          <span className="text-sm text-gray-400">{match.status}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                              <label className="block mb-1 text-sm font-medium text-gray-300">
                                  {home?.short_name || 'Home'} Score
                              </label>
                              <input
                                  type="number"
                                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                                  value={match.home_score?.toString() || ''}
                                  onChange={(e) =>
                                      setMatches((prev) =>
                                          prev.map((m) =>
                                              m.id === match.id
                                                  ? { ...m, home_score: parseInt(e.target.value) }
                                                  : m
                                          )
                                      )
                                  }
                              />
                          </div>

                          <div>
                              <label className="block mb-1 text-sm font-medium text-gray-300">
                                  {away?.short_name || 'Away'} Score
                              </label>
                              <input
                                  type="number"
                                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                                  value={match.away_score?.toString() || ''}
                                  onChange={(e) =>
                                      setMatches((prev) =>
                                          prev.map((m) =>
                                              m.id === match.id
                                                  ? { ...m, away_score: parseInt(e.target.value) }
                                                  : m
                                          )
                                      )
                                  }
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block mb-1 text-sm text-gray-300">Match Status</label>
                          <select
                              value={match.status}
                              onChange={(e) =>
                                  setMatches((prev) =>
                                      prev.map((m) =>
                                          m.id === match.id ? { ...m, status: e.target.value as Match['status'] } : m
                                      )
                                  )
                              }
                              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                          >
                              <option value="upcoming">Upcoming</option>
                              <option value="live">Live</option>
                              <option value="finished">Finished</option>
                          </select>
                      </div>



                      <button
                          type="submit"
                          disabled={loadingId === match.id}
                          className="mt-4 inline-block px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium"
                      >
                          {loadingId === match.id ? 'Saving...' : 'Save Score'}
                      </button>

                      <button
                          onClick={() => handleDelete(match.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                      >
                          🗑 Delete
                      </button>
                  </form>

          )
          })}
      </div>
  );
};

export default AdminPage;
