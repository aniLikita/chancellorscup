"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
        <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link href="/" className="text-xl font-bold">
                Chancellors Cup
            </Link>

            <div className="space-x-4">
                {user && isAdmin && (
                    <Link
                        href="/admin"
                        className="hover:text-blue-500 border border-white px-3 py-1 rounded"
                    >
                        Admin
                    </Link>
                )}

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="hover:text-red-400 border border-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/sign-in"
                        className="hover:text-blue-400 border border-white px-3 py-1 rounded"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
