'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconFileText, IconCheckCircle, IconBriefcase, IconStar } from '@/components/icons';

export default function DashboardPage() {
    const supabase = createClient();
    const [stats, setStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        totalProjects: 0,
        publishedProjects: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [posts, projects] = await Promise.all([
                supabase.from('posts').select('id, published'),
                supabase.from('projects').select('id, published'),
            ]);

            setStats({
                totalPosts: posts.data?.length || 0,
                publishedPosts: posts.data?.filter(p => p.published).length || 0,
                totalProjects: projects.data?.length || 0,
                publishedProjects: projects.data?.filter(p => p.published).length || 0,
            });
            setLoading(false);
        };

        fetchStats();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Panel de Administración</h1>
                <p className="text-muted">Gestiona tu contenido desde aquí</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl p-6 border border-text/[0.06]"
                >
                    <div className="mb-3 text-orange"><IconFileText size={22} /></div>
                    <div className="text-2xl font-bold text-orange">{stats.totalPosts}</div>
                    <div className="text-sm text-muted">Total Posts</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-xl p-6 border border-text/[0.06]"
                >
                    <div className="mb-3 text-orange"><IconCheckCircle size={22} /></div>
                    <div className="text-2xl font-bold text-orange">{stats.publishedPosts}</div>
                    <div className="text-sm text-muted">Posts Publicados</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-xl p-6 border border-text/[0.06]"
                >
                    <div className="mb-3 text-orange"><IconBriefcase size={22} /></div>
                    <div className="text-2xl font-bold text-orange">{stats.totalProjects}</div>
                    <div className="text-sm text-muted">Total Proyectos</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-xl p-6 border border-text/[0.06]"
                >
                    <div className="mb-3 text-orange"><IconStar size={22} /></div>
                    <div className="text-2xl font-bold text-orange">{stats.publishedProjects}</div>
                    <div className="text-sm text-muted">Proyectos Publicados</div>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl p-6 border border-text/[0.06]"
                >
                    <h2 className="text-lg font-bold text-text mb-4">Acciones Rápidas</h2>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/posts/new"
                            className="block w-full bg-yellow text-text px-4 py-3 rounded-lg font-semibold text-sm hover:bg-[#e0b510] transition-colors"
                        >
                            + Nuevo Post
                        </Link>
                        <Link
                            href="/dashboard/projects/new"
                            className="block w-full bg-orange text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-[#e55a25] transition-colors"
                        >
                            + Nuevo Proyecto
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-xl p-6 border border-text/[0.06]"
                >
                    <h2 className="text-lg font-bold text-text mb-4">Enlaces Útiles</h2>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="block text-sm text-muted hover:text-orange transition-colors"
                        >
                            → Ver sitio web
                        </Link>
                        <Link
                            href="/dashboard/posts"
                            className="block text-sm text-muted hover:text-orange transition-colors"
                        >
                            → Gestionar posts
                        </Link>
                        <Link
                            href="/dashboard/projects"
                            className="block text-sm text-muted hover:text-orange transition-colors"
                        >
                            → Gestionar proyectos
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
