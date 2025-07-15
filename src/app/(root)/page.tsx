import { supabase } from '@/lib/supabase'
import { Team } from '@/types/match'
import Navbar from "@/components/Navbar";
import ClientHomePage from "@/components/ClientHomePage";

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
        <main className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-[#0a2351]">
            <Navbar/>

            {/* Hero Section */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800/30 to-indigo-800/30 opacity-20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#0a2351_20%,_#0a2351_80%,_transparent_80%,_transparent),radial-gradient(circle,_currentColor_20%,_transparent_20%)] bg-blue-900/10 opacity-10" style={{ backgroundSize: '5em 5em' }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                            <span className="inline-block transform hover:scale-105 transition-transform duration-300">🏆</span> Chancellors Cup
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Follow live scores and match updates for all Chancellors Cup games
                        </p>
                        <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Matches and Leaderboard Section */}
            <section className="py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Tournament Dashboard
                        </h2>

                        <ClientHomePage initialMatches={matches || []} teams={teamMap} />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 bg-black/30 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center text-blue-200 text-sm">
                        <p>© {new Date().getFullYear()} Chancellors Cup. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
