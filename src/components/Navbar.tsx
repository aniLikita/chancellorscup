"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import gsap from 'gsap'

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const navRef = useRef(null)

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

    useEffect(() => {
        if (navRef.current) {
            gsap.fromTo(
                navRef.current,
                { y: -50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                }
            )
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/sign-in");
    };

    return (
        <nav
            ref={navRef}
            className="bg-gradient-to-r from-[#0e1d38]/70 to-[#192b4d]/70 backdrop-blur-md text-white px-6 py-4 sticky top-0 z-50 shadow-lg border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="text-2xl">🏆</span>
                    <span className="text-xl font-extrabold tracking-tight group-hover:text-yellow-400 transition-colors duration-300">
                        Chancellors Cup
                    </span>
                </Link>

                {/* Mobile menu button */}
                <button 
                    className="md:hidden flex items-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                                isMenuOpen
                                    ? "M6 18L18 6M6 6l12 12"
                                    : "M4 6h16M4 12h16M4 18h16"
                            }
                        />
                    </svg>
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavLink href="/">Home</NavLink>

                    {user && isAdmin && (
                        <Link
                            href="/admin"
                            className="px-4 py-2 rounded-md  hover:border-indigo-600 transition"
                        >
                            Admin
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className=" hover:border-red-500 text-white px-4 py-2 rounded-md transition-colors duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="px-4 py-2 rounded-md  hover:border-blue-500 transition"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4 pb-2 space-y-3 transition-all duration-300`}>
                <NavLink href="/">Home</NavLink>

                {user && isAdmin && (
                    <Link
                        href="/admin"
                        className="px-4 py-2 rounded-md  hover:bg-indigo-600 transition"
                    >
                        Admin
                    </Link>
                )}

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-md  hover:bg-red-500 transition"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/sign-in"
                        className="px-4 py-2 rounded-md  hover:bg-blue-500 transition"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="relative px-3 py-2 text-white hover:text-yellow-300 transition"
    >
        <span className="relative z-10">{children}</span>
        <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full group-hover:left-0" />
    </Link>
)

export default Navbar;
