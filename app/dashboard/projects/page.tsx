'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/lib/types/database';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IconBriefcase, IconEdit, IconTrash, IconPlay, IconPause, IconEye, IconEyeOff, IconStar } from '@/components/icons';

export default function ProjectsPage() {
    const supabase = createClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const fetchProjects = async () => {
        setLoading(true);
        let query = supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter === 'published') {
            query = query.eq('published', true);
        } else if (filter === 'draft') {
            query = query.eq('published', false);
        }

        const { data, error } = await query;

        if (error) {
            toast.error('Error al cargar proyectos');
            console.error(error);
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás segura de eliminar este proyecto?')) return;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Error al eliminar');
        } else {
            toast.success('Proyecto eliminado');
            fetchProjects();
        }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('projects')
            .update({
                published: !currentStatus,
                published_at: !currentStatus ? new Date().toISOString() : null
            })
            .eq('id', id);

        if (error) {
            toast.error('Error al actualizar');
        } else {
            toast.success(currentStatus ? 'Proyecto despublicado' : 'Proyecto publicado');
            fetchProjects();
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('projects')
            .update({ featured: !currentStatus })
            .eq('id', id);

        if (error) {
            toast.error('Error al actualizar');
        } else {
            toast.success(currentStatus ? 'Removido de destacados' : 'Marcado como destacado');
            fetchProjects();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text mb-2">Proyectos</h1>
                    <p className="text-muted">Gestiona tus casos de estudio</p>
                </div>
                <Link
                    href="/dashboard/projects/new"
                    className="bg-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#e55a25] hover:-translate-y-0.5 transition-all"
                >
                    + Nuevo Proyecto
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-orange text-white'
                        : 'bg-white text-text hover:bg-cream'
                        }`}
                >
                    Todos ({projects.length})
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'published'
                        ? 'bg-orange text-white'
                        : 'bg-white text-text hover:bg-cream'
                        }`}
                >
                    Publicados
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'draft'
                        ? 'bg-orange text-white'
                        : 'bg-white text-text hover:bg-cream'
                        }`}
                >
                    Borradores
                </button>
            </div>

            {/* Projects list */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted">Cargando proyectos...</p>
                    </div>
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-text/[0.06]">
                    <div className="flex justify-center mb-4 text-orange/30"><IconBriefcase size={64} /></div>
                    <h3 className="text-xl font-bold text-text mb-2">No hay proyectos todavía</h3>
                    <p className="text-muted mb-6">Crea tu primer caso de estudio</p>
                    <Link
                        href="/dashboard/projects/new"
                        className="inline-block bg-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#e55a25] transition-colors"
                    >
                        Crear Proyecto
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-white rounded-xl border border-text/[0.06] hover:shadow-md transition-shadow overflow-hidden"
                        >
                            {/* Thumbnail banner */}
                            <div className="relative h-28 bg-gradient-to-br from-[var(--cream)] to-[var(--beige)] flex items-center justify-center overflow-hidden">
                                {project.cover_image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={project.cover_image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <IconBriefcase size={40} className="text-orange/30" />
                                )}
                                {/* Status badge overlay */}
                                <div className="absolute top-2 left-2 flex gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm ${project.published
                                        ? 'bg-yellow/80 text-[#5a3a00]'
                                        : 'bg-white/80 text-subtle'
                                        }`}>
                                        {project.published ? 'Publicado' : 'Borrador'}
                                    </span>
                                    {project.featured && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-orange/80 text-white backdrop-blur-sm">
                                            <IconStar size={10} filled /> Destacado
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-subtle font-medium">{project.category}</span>
                                </div>
                                <h3 className="text-base font-bold text-text mb-1 leading-snug">{project.title}</h3>
                                <p className="text-sm text-muted mb-3">{project.excerpt}</p>

                                {project.client && (
                                    <div className="text-xs text-subtle mb-4">
                                        Cliente: {project.client} • {project.year}
                                    </div>
                                )}

                                <div className="flex gap-2 flex-wrap mt-2 mb-4">
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-cream text-xs text-muted rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/projects/${project.id}`}
                                        className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text hover:bg-cream transition-colors"
                                    >
                                        <IconEdit size={13} /> Editar
                                    </Link>
                                    <button
                                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                                        className="px-3 py-2 rounded-lg text-xs font-medium text-yellow hover:bg-yellow/10 transition-colors"
                                        title={project.featured ? 'Remover de destacados' : 'Marcar como destacado'}
                                    >
                                        <IconStar size={15} filled={project.featured} />
                                    </button>
                                    <button
                                        onClick={() => handleTogglePublish(project.id, project.published)}
                                        className="px-3 py-2 rounded-lg text-xs font-medium text-orange hover:bg-orange/10 transition-colors"
                                        title={project.published ? 'Despublicar' : 'Publicar'}
                                    >
                                        {project.published ? <IconPause size={15} /> : <IconPlay size={15} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <IconTrash size={15} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
