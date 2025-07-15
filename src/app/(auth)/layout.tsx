'use client'

import React, { ReactNode } from 'react'


const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12"
            style={{ backgroundImage: `url('/stadium.jpg')` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70  z-0" />

            {/* Auth card wrapper */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-yellow-400">Chancellors Cup</h1>
                    <p className="text-sm text-white/70">Sign in to your account</p>
                </div>

                {/* Auth Form */}
                <div>{children}</div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-white/50">
                    &copy; {new Date().getFullYear()} Chancellors Cup. All rights reserved.
                </div>
            </div>
        </div>
    )
}

export default Layout
