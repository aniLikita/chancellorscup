import { supabase } from '@/lib/supabase'
import MatchCard from '@/components/MatchCard'
import { Team } from '@/types/match'

import React from 'react';

const Homepage = async() => {
  const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .order('start_time', { ascending: true })

  const { data: teams } = await supabase.from('teams').select('*')

  const teamMap: Record<string, Team> = {}
  teams?.forEach((team) => {
    teamMap[team.id] = team
  })


  return (
      <main className="p-4 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center text-white">Chancellor’s Cup LiveScores</h1>

        {matches?.length ? (
            matches.map((match) => (
                <MatchCard key={match.id} match={match} teams={teamMap} />
            ))
        ) : (
            <p className="text-center text-gray-400">No matches yet</p>
        )}
      </main>
  );
};

export default Homepage;

