'use client'
// Component in the Admin Page
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Team } from '@/types/match'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)


const CreateMatchForm = () => {
    const [teams, setTeams] = useState<Team[]>([])
    const [homeTeam, setHomeTeam] = useState('')
    const [awayTeam, setAwayTeam] = useState('')
    const [startTime, setStartTime] = useState('')
    const [status, setStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming')
    const [loading, setLoading] = useState(false)
    const formRef = useRef(null)

    useEffect(() => {
        supabase
            .from('teams')
            .select('*')
            .then(({ data }) => {
                if (data) setTeams(data)
            })
    }, [])

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        }
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
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 text-white"
      >
          {/*<h2 className="text-lg font-bold text-white">Create Match</h2>*/}

          <div className="grid sm:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm text-white/80 mb-1">Home Team</label>
                  <select
                      value={homeTeam}
                      onChange={(e) => setHomeTeam(e.target.value)}
                      className="w-full p-2 rounded bg-gray-900 border border-gray-700 focus:outline-yellow-400"
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
                  <label className="block text-sm text-white/80 mb-1">Away Team</label>
                  <select
                      value={awayTeam}
                      onChange={(e) => setAwayTeam(e.target.value)}
                      className="w-full p-2 rounded bg-gray-900 border border-gray-700 focus:outline-yellow-400"
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
              <label className="block text-sm text-white/80 mb-1">Start Time</label>
              <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
              />
          </div>

          <div>
              <label className="block text-sm text-white/80 mb-1">Match Status</label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'upcoming' | 'live' | 'finished')}
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
              </select>
          </div>

          <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 mt-2 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 disabled:opacity-50 transition"
          >
              {loading ? 'Creating...' : 'Create Match'}
          </button>
      </form>
  );
};

export default CreateMatchForm;
