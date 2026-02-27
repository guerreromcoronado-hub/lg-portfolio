'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { IconChart, IconFileText, IconBriefcase } from '@/components/icons';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Sesión cerrada');
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" />
            <div className="min-h-screen bg-cream">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-text/[0.06] p-6">
                    <div className="mb-10">
                        <Link href="/dashboard" className="block">
                            <h1 className="text-xl font-bold text-orange">Laura Guerrero</h1>
                            <p className="text-xs text-muted mt-1">Dashboard</p>
                        </Link>
                    </div>

                    <nav className="space-y-2">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-text hover:bg-cream transition-colors"
                        >
                            <IconChart size={16} className="text-orange" /> Resumen
                        </Link>
                        <Link
                            href="/dashboard/posts"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-text hover:bg-cream transition-colors"
                        >
                            <IconFileText size={16} className="text-orange" /> Blog Posts
                        </Link>
                        <Link
                            href="/dashboard/projects"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-text hover:bg-cream transition-colors"
                        >
                            <IconBriefcase size={16} className="text-orange" /> Proyectos
                        </Link>
                    </nav>

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-cream rounded-lg p-4 mb-4">
                            <p className="text-xs font-semibold text-text mb-1">
                                {user?.email}
                            </p>
                            <p className="text-xs text-subtle">Administradora</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 rounded-lg text-sm font-medium text-orange hover:bg-orange/10 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="ml-64 p-8">
                    {children}
                </main>
            </div>
        </>
    );
}
