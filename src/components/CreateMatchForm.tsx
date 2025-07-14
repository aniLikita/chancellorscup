'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Team } from '@/types/match'



const CreateMatchForm = () => {
    const [teams, setTeams] = useState<Team[]>([])
    const [homeTeam, setHomeTeam] = useState('')
    const [awayTeam, setAwayTeam] = useState('')
    const [startTime, setStartTime] = useState('')
    const [status, setStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        supabase
            .from('teams')
            .select('*')
            .then(({ data }) => {
                if (data) setTeams(data)
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!homeTeam || !awayTeam || !startTime) return

        setLoading(true)

        const { error } = await supabase.from('matches').insert({
            home_team: homeTeam,
            away_team: awayTeam,
            start_time: startTime,
            home_score: 0,
            away_score: 0,
            status,
        })
        if (error) {
            console.error('Supabase Insert Error:', error)
        }


        setLoading(false)
        if (!error) {
            setHomeTeam('')
            setAwayTeam('')
            setStartTime('')
            setStatus('upcoming')

        }
        console.log('Submitting:', { homeTeam, awayTeam, startTime, status })

    }

  return (
      <form
          onSubmit={handleSubmit}
          className="border border-gray-700 rounded-xl p-6 bg-gray-900 space-y-4 mb-6"
      >
          <h2 className="text-lg font-bold text-white">Create Match</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label className="text-sm text-white">Home Team</label>
                  <select
                      value={homeTeam}
                      onChange={(e) => setHomeTeam(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded"
                  >
                      <option value="">Select...</option>
                      {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                              {team.short_name}
                          </option>
                      ))}
                  </select>
              </div>

              <div>
                  <label className="text-sm text-white">Away Team</label>
                  <select
                      value={awayTeam}
                      onChange={(e) => setAwayTeam(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded"
                  >
                      <option value="">Select...</option>
                      {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                              {team.short_name}
                          </option>
                      ))}
                  </select>
              </div>
          </div>

          <div>
              <label className="text-sm text-white">Start Time</label>
              <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded"
              />
          </div>

          <div>
              <label className="text-sm text-white">Match Status</label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'upcoming' | 'live' | 'finished')}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded"
              >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
              </select>
          </div>

          <button
              type="submit"
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
              {loading ? 'Creating...' : 'Create Match'}
          </button>
      </form>
  );
};

export default CreateMatchForm;
