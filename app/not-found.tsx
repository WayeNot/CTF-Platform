'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div>
            <div className="lg:hidden fixed inset-0 bg-black z-50 flex items-center justify-center">
                <h2 className="text-white text-xl text-center">
                    The mobile version is coming soon.
                </h2>
            </div>

            <div className="hidden lg:block">
                <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white text-gray-900">
                    <h1 className="text-6xl font-bold mb-4">404</h1>
                    <p className="text-xl mb-6">Vous vous êtes trompé de page !.</p>
                    <Link className="text-blue-500 hover:underline" href="/">Revenir à l'accueil →</Link>
                </div>
            </div>
        </div>
    )
}