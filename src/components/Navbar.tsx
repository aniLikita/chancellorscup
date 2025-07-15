"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUser(user);

                const { data, error } = await supabase
                    .from("admin_users")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (data && !error) setIsAdmin(true);
            }
        };

        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/sign-in");
    };

    return (
        <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="text-2xl">🏆</span>
                    <span className="text-xl font-bold tracking-tight group-hover:text-yellow-300 transition-colors duration-300">
                        Chancellors Cup
                    </span>
                </Link>

                {/* Mobile menu button */}
                <button 
                    className="md:hidden flex items-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/" className="hover:text-yellow-300 transition-colors duration-300 px-3 py-2">
                        Home
                    </Link>

                    {user && isAdmin && (
                        <Link
                            href="/admin"
                            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            Admin
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4 pb-2 space-y-3 transition-all duration-300`}>
                <Link href="/" className="block hover:bg-indigo-800 px-3 py-2 rounded-md">
                    Home
                </Link>

                {user && isAdmin && (
                    <Link
                        href="/admin"
                        className="block hover:bg-indigo-800 px-3 py-2 rounded-md"
                    >
                        Admin
                    </Link>
                )}

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left hover:bg-indigo-800 px-3 py-2 rounded-md"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/sign-in"
                        className="block hover:bg-indigo-800 px-3 py-2 rounded-md"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
