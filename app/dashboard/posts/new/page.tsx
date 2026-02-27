'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    Section, SectionType,
    makeSection, SectionCard, AddSectionPicker, buildContent,
} from '../_components/SectionBuilder';
import { PostSidebar, PostFormData, PublishStatus } from '../_components/PostSidebar';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewPostPage() {
    const router = useRouter();
    const supabase = createClient();
    const { register, handleSubmit, setValue, watch } = useForm<PostFormData>({
        defaultValues: { emoji: '📝', read_time: '5 min' },
    });

    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<Section[]>([makeSection('paragraph')]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [publishStatus, setPublishStatus] = useState<PublishStatus>('draft');
    const [scheduleDate, setScheduleDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');

    // ─── English translation state ────────────────────────────────────────────
    const [enOpen, setEnOpen] = useState(false);
    const [titleEn, setTitleEn] = useState('');
    const [excerptEn, setExcerptEn] = useState('');
    const [categoryEn, setCategoryEn] = useState('');
    const [readTimeEn, setReadTimeEn] = useState('');
    const [sectionsEn, setSectionsEn] = useState<Section[]>([makeSection('paragraph')]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const slug = watch('slug');
    const title = watch('title');

    const generateSlug = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    useEffect(() => { if (title && !metaTitle) setMetaTitle(title); }, [title, metaTitle]);

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const handleCoverFile = (file: File | null) => {
        setCoverFile(file);
        if (file) { const r = new FileReader(); r.onload = e => setCoverPreview(e.target?.result as string); r.readAsDataURL(file); }
        else setCoverPreview(null);
    };

    const addSection = (type: SectionType) => setSections(prev => [...prev, makeSection(type)]);
    const deleteSection = (id: string) => setSections(prev => prev.filter(s => s.id !== id));
    const updateSection = (upd: Section) => setSections(prev => prev.map(s => s.id === upd.id ? upd : s));
    const moveSection = useCallback((id: string, dir: -1 | 1) => {
        setSections(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    // EN section helpers
    const addSectionEn = (type: SectionType) => setSectionsEn(prev => [...prev, makeSection(type)]);
    const deleteSectionEn = (id: string) => setSectionsEn(prev => prev.filter(s => s.id !== id));
    const updateSectionEn = (upd: Section) => setSectionsEn(prev => prev.map(s => s.id === upd.id ? upd : s));
    const moveSectionEn = useCallback((id: string, dir: -1 | 1) => {
        setSectionsEn(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    const uploadCover = async (file: File, postSlug: string): Promise<string> => {
        const ext = file.name.split('.').pop();
        const path = `${postSlug}-${Date.now()}.${ext}`;
        setUploadProgress(30);
        const { error } = await supabase.storage.from('post-images').upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        setUploadProgress(80);
        const { data } = supabase.storage.from('post-images').getPublicUrl(path);
        setUploadProgress(100);
        return data.publicUrl;
    };

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = async (data: PostFormData) => {
        setLoading(true);
        try {
            if (!data.slug) { data.slug = generateSlug(data.title); setValue('slug', data.slug); }

            let cover_image: string | null = null;
            if (coverFile) {
                toast.loading('Subiendo imagen...', { id: 'upload' });
                cover_image = await uploadCover(coverFile, data.slug);
                toast.dismiss('upload');
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast.error('No estás autenticado'); router.push('/login'); return; }

            const isPublished = publishStatus === 'active';
            const publishedAt = publishStatus === 'active' ? new Date().toISOString()
                : publishStatus === 'scheduled' && scheduleDate ? new Date(scheduleDate).toISOString() : null;

            const { error } = await supabase.from('posts').insert({
                ...data, cover_image, author_id: user.id,
                content: buildContent(sections, { tags, seo: { title: metaTitle, description: metaDesc } }),
                published: isPublished, published_at: publishedAt,
                title_en: titleEn || null,
                excerpt_en: excerptEn || null,
                category_en: categoryEn || null,
                read_time_en: readTimeEn || null,
                content_en: sectionsEn.length > 0 ? buildContent(sectionsEn, {}) : null,
            });
            if (error) throw error;

            toast.success('¡Post creado!');
            router.push('/dashboard/posts');
            router.refresh();
        } catch (err: unknown) {
            toast.dismiss('upload');
            toast.error(err instanceof Error ? err.message : 'Error al crear el post');
        } finally { setLoading(false); setUploadProgress(0); }
    };

    // ─── UI ───────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-cream/30">
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-text/[0.06] px-6 py-3 flex items-center justify-between gap-4">
                    <Link href="/dashboard/posts"
                        className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1.5 flex-shrink-0">
                        ← Posts
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href="/dashboard/posts"
                            className="px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-text/[0.1] rounded-lg transition-colors">
                            Descartar
                        </Link>
                        <button type="submit" disabled={loading} onClick={() => setPublishStatus('draft')}
                            className="px-4 py-2 text-sm font-semibold text-text border border-text/[0.15] rounded-lg hover:bg-cream transition-colors disabled:opacity-50">
                            {loading ? '...' : 'Guardar borrador'}
                        </button>
                        <button type="submit" disabled={loading}
                            onClick={() => setPublishStatus(publishStatus === 'scheduled' ? 'scheduled' : 'active')}
                            className="px-4 py-2 text-sm font-bold bg-text text-white rounded-lg hover:bg-text/80 transition-colors disabled:opacity-50">
                            {loading ? 'Guardando...' : publishStatus === 'scheduled' ? 'Programar' : '↗ Publicar'}
                        </button>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* LEFT */}
                        <div className="flex-1 min-w-0 space-y-4">

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <input {...register('title', { required: true })}
                                    onChange={e => {
                                        setValue('title', e.target.value);
                                        setValue('slug', generateSlug(e.target.value));
                                        if (!metaTitle) setMetaTitle(e.target.value);
                                    }}
                                    className="w-full text-2xl font-bold text-text placeholder:text-subtle/50 outline-none bg-transparent border-none resize-none"
                                    placeholder="Título del post..." autoFocus />
                            </div>

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="text-sm font-bold text-text">Contenido</h2>
                                        <p className="text-xs text-subtle mt-0.5">{sections.length} bloque{sections.length !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {sections.map((section, index) => (
                                        <SectionCard key={section.id} section={section} index={index} total={sections.length}
                                            onMoveUp={() => moveSection(section.id, -1)} onMoveDown={() => moveSection(section.id, 1)}
                                            onDelete={() => deleteSection(section.id)} onChange={updateSection} />
                                    ))}
                                    <AddSectionPicker onAdd={addSection} />
                                </div>
                            </div>

                            {/* 🌐 English Translation */}
                            <div className="bg-white rounded-xl border border-text/[0.06] overflow-hidden">
                                <button type="button" onClick={() => setEnOpen(v => !v)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream/30 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🌐</span>
                                        <h2 className="text-sm font-bold text-text">Traducción en inglés</h2>
                                        <span className="text-xs text-subtle">(opcional)</span>
                                    </div>
                                    <span className="text-subtle text-sm">{enOpen ? '▲' : '▼'}</span>
                                </button>
                                {enOpen && (
                                    <div className="px-6 pb-6 space-y-4 border-t border-text/[0.06]">
                                        <div className="pt-4">
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Title (EN)</label>
                                            <input value={titleEn} onChange={e => setTitleEn(e.target.value)}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                placeholder="Post title in English..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Excerpt (EN)</label>
                                            <textarea value={excerptEn} onChange={e => setExcerptEn(e.target.value)} rows={2}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                                placeholder="Short description in English..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Category (EN)</label>
                                                <input value={categoryEn} onChange={e => setCategoryEn(e.target.value)}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Email Marketing" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Read time (EN)</label>
                                                <input value={readTimeEn} onChange={e => setReadTimeEn(e.target.value)}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="7 min" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-subtle">Content (EN)</h3>
                                                <span className="text-xs text-subtle">{sectionsEn.length} block{sectionsEn.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="space-y-3">
                                                {sectionsEn.map((section, index) => (
                                                    <SectionCard key={section.id} section={section} index={index} total={sectionsEn.length}
                                                        onMoveUp={() => moveSectionEn(section.id, -1)} onMoveDown={() => moveSectionEn(section.id, 1)}
                                                        onDelete={() => deleteSectionEn(section.id)} onChange={updateSectionEn} />
                                                ))}
                                                <AddSectionPicker onAdd={addSectionEn} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <PostSidebar
                            publishStatus={publishStatus} setPublishStatus={setPublishStatus}
                            scheduleDate={scheduleDate} setScheduleDate={setScheduleDate}
                            coverDisplayed={coverPreview}
                            onCoverClick={() => fileInputRef.current?.click()}
                            onCoverRemove={() => handleCoverFile(null)}
                            fileInputRef={fileInputRef}
                            onFileChange={e => handleCoverFile(e.target.files?.[0] ?? null)}
                            uploadProgress={uploadProgress}
                            register={register}
                            tags={tags} setTags={setTags}
                            metaTitle={metaTitle} setMetaTitle={setMetaTitle}
                            metaDesc={metaDesc} setMetaDesc={setMetaDesc}
                            slug={slug}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
