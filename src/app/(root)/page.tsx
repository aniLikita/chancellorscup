import { supabase } from '@/lib/supabase'
import { Team } from '@/types/match'
import ClientMatchList from '@/components/ClientMatchList'

export const dynamic = 'force-dynamic' // make this always SSR

export default async function HomePage() {
    const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .order('start_time', { ascending: true })

    const { data: teams } = await supabase.from('teams').select('*')

    const teamMap: Record<string, Team> = {}
    teams?.forEach((team) => (teamMap[team.id] = team))

    return (
        <div className="min-h-screen bg-[#0a2351]">
            <main className="p-4 max-w-4xl mx-auto space-y-4">
                <h1 className="text-2xl font-bold text-center text-white pt-6">
                    🏆 Chancellor's Cup LiveScores
                </h1>

                <ClientMatchList initialMatches={matches || []} teams={teamMap} />
            </main>
        </div>
    )
}
