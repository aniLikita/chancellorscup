'use client'
// Page where admin can access

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Match, Team } from '@/types/match'
import CreateMatchForm from "@/components/CreateMatchForm";
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const AdminPage = () => {
    const [matches, setMatches] = useState<Match[]>([])
    const [teams, setTeams] = useState<Record<string, Team>>({})
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const sectionRef = useRef(null)

    const fetchMatches = async () => {
        const {data: matchesData} = await supabase
            .from('matches')
            .select('*')
            .order('start_time', {ascending: true})
            setMatches(matchesData || [])
    }

    useEffect(() => {
        if (sectionRef.current) {
            gsap.fromTo(
                sectionRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    },
                }
            )
        }
    }, [])


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
      <div ref={sectionRef}
           className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#10182b] to-[#050c19] text-white px-4 py-12 space-y-10">
          <div className="max-w-4xl mx-auto space-y-10">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Create New Match</h2>
              <CreateMatchForm />
          </div>



          <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Update Match Scores</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.map((match) => {
                      const home = teams[match.home_team]
                      const away = teams[match.away_team]

                      const handleDelete = async (id: string) => {
                          const confirm = window.confirm('Delete this match?')
                          if (!confirm) return

                          const { error } = await supabase.from('matches').delete().eq('id', id)
                          if (error) alert('Error deleting match')
                      }

                      return (
                          <form
                              key={match.id}
                              onSubmit={(e) => {
                                  e.preventDefault()
                                  updateScore(
                                      match.id,
                                      match.home_score,
                                      match.away_score,
                                      match.status
                                  )
                              }}
                              className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-md space-y-3 text-sm"
                          >
                              <div className="flex justify-between items-center">
                                  <h3 className="font-semibold text-white truncate">
                                      {home?.short_name || 'Home'} vs {away?.short_name || 'Away'}
                                  </h3>
                                  <span className="text-xs text-white/50">{match.status}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                  <div>
                                      <label className="block text-xs text-white/70 mb-1">
                                          {home?.short_name || 'Home'} Score
                                      </label>
                                      <input
                                          type="number"
                                          className="w-full bg-gray-900 text-white p-1.5 rounded border border-gray-700"
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
                                      <label className="block text-xs text-white/70 mb-1">
                                          {away?.short_name || 'Away'} Score
                                      </label>
                                      <input
                                          type="number"
                                          className="w-full bg-gray-900 text-white p-1.5 rounded border border-gray-700"
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
                                  <label className="block text-xs text-white/70 mb-1">Status</label>
                                  <select
                                      value={match.status}
                                      onChange={(e) =>
                                          setMatches((prev) =>
                                              prev.map((m) =>
                                                  m.id === match.id
                                                      ? { ...m, status: e.target.value as Match['status'] }
                                                      : m
                                              )
                                          )
                                      }
                                      className="w-full bg-gray-900 text-white p-1.5 rounded border border-gray-700"
                                  >
                                      <option value="upcoming">Upcoming</option>
                                      <option value="live">Live</option>
                                      <option value="finished">Finished</option>
                                  </select>
                              </div>

                              <div className="flex justify-between items-center pt-2">
                                  <button
                                      type="submit"
                                      disabled={loadingId === match.id}
                                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                                  >
                                      {loadingId === match.id ? 'Saving...' : 'Save'}
                                  </button>

                                  <button
                                      type="button"
                                      onClick={() => handleDelete(match.id)}
                                      className="text-red-400 hover:text-red-500 text-xs"
                                  >
                                      🗑 Delete
                                  </button>
                              </div>
                          </form>
                      )
                  })}
              </div>
          </div>

      </div>
  );
};

export default AdminPage;
