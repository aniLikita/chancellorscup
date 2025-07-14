'use client'

import { useEffect, useState } from 'react'
import {supabase} from "@/lib/supabase";
import {Match} from "@/types/match";

const useLiveMatches = () => {
    const [matches, setMatches] = useState<Match[]>([])

    useEffect(() => {
        // Initial fetch
        const fetchMatches = async () => {
            const { data } = await supabase
                .from('matches')
                .select('*')
                .order('start_time', { ascending: true })

            if (data) setMatches(data)
        }

        fetchMatches()

        // Realtime subscription
        const channel = supabase
            .channel('public:matches')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'matches' },
                (payload) => {
                    const updatedMatch = payload.new as Match
                    setMatches((prev) =>
                        prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return matches

};

export default useLiveMatches;
