'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Post } from '@/lib/types/database';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { IconFileText, IconEdit, IconTrash, IconPlay, IconPause, IconEye, IconClock, IconCalendar } from '@/components/icons';

export default function PostsPage() {
    const supabase = createClient();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        let query = supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter === 'published') {
            query = query.eq('published', true);
        } else if (filter === 'draft') {
            query = query.eq('published', false);
        }

        const { data, error } = await query;

        if (error) {
            toast.error('Error al cargar posts');
            console.error(error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás segura de eliminar este post?')) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Error al eliminar');
        } else {
            toast.success('Post eliminado');
            fetchPosts();
        }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('posts')
            .update({
                published: !currentStatus,
                published_at: !currentStatus ? new Date().toISOString() : null
            })
            .eq('id', id);

        if (error) {
            toast.error('Error al actualizar');
        } else {
            toast.success(currentStatus ? 'Post despublicado' : 'Post publicado');
            fetchPosts();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text mb-2">Blog Posts</h1>
                    <p className="text-muted">Gestiona los artículos de tu blog</p>
                </div>
                <Link
                    href="/dashboard/posts/new"
                    className="bg-yellow text-text px-6 py-3 rounded-full font-bold text-sm hover:bg-[#e0b510] hover:-translate-y-0.5 transition-all"
                >
                    + Nuevo Post
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
                    Todos ({posts.length})
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

            {/* Posts list */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted">Cargando posts...</p>
                    </div>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-text/[0.06]">
                    <div className="flex justify-center mb-4 text-orange/30"><IconFileText size={64} /></div>
                    <h3 className="text-xl font-bold text-text mb-2">No hay posts todavía</h3>
                    <p className="text-muted mb-6">Crea tu primer artículo para comenzar</p>
                    <Link
                        href="/dashboard/posts/new"
                        className="inline-block bg-yellow text-text px-6 py-3 rounded-full font-bold text-sm hover:bg-[#e0b510] transition-colors"
                    >
                        Crear Post
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-white rounded-xl p-6 border border-text/[0.06] hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                {/* Thumbnail */}
                                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-cream flex items-center justify-center">
                                    {post.cover_image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <IconFileText size={28} className="text-orange/40" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${post.published
                                            ? 'bg-yellow/20 text-orange'
                                            : 'bg-text/10 text-subtle'
                                            }`}>
                                            {post.published ? 'Publicado' : 'Borrador'}
                                        </span>
                                        <span className="text-xs text-subtle">{post.category}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-text mb-1 truncate">{post.title}</h3>
                                    <p className="text-sm text-muted mb-2 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center gap-3 text-xs text-subtle">
                                        <span className="flex items-center gap-1"><IconEye size={11} /> {post.views}</span>
                                        <span className="flex items-center gap-1"><IconClock size={11} /> {post.read_time}</span>
                                        <span className="flex items-center gap-1"><IconCalendar size={11} /> {new Date(post.created_at).toLocaleDateString('es-ES')}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                    <Link
                                        href={`/dashboard/posts/${post.id}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text hover:bg-cream transition-colors whitespace-nowrap"
                                    >
                                        <IconEdit size={12} /> Editar
                                    </Link>
                                    <button
                                        onClick={() => handleTogglePublish(post.id, post.published)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange hover:bg-orange/10 transition-colors whitespace-nowrap text-left"
                                    >
                                        {post.published ? <><IconPause size={12} /> Despublicar</> : <><IconPlay size={12} /> Publicar</>}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap text-left"
                                    >
                                        <IconTrash size={12} /> Eliminar
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
