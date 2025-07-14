import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="bg-gray-900 p-4 shadow">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </header>

            <main className="p-6">{children}</main>
        </div>
    )
}
