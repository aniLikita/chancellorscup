export type Match = {
    id: string
    home_team: string
    away_team: string
    home_score: number
    away_score: number
    status: 'upcoming' | 'live' | 'finished'
    start_time: string
    updated_at: string
}

export type Team = {
    id: string
    name: string
    short_name: string
    logo_url?: string
}
