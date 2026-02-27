'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    ProjectSection, ProjectSectionType,
    makeProjSection, ProjectSectionCard, AddProjectSectionPicker,
    buildProjectContent, buildMetrics, buildTools,
} from '../_components/ProjectSectionBuilder';
import { ProjectSidebar, ProjectMeta } from '../_components/ProjectSidebar';
import { MetricsEditor, ToolsEditor, MetricsForm, ToolsForm } from '../_components/MetricsToolsEditors';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewProjectPage() {
    const router = useRouter();
    const supabase = createClient();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sections, setSections] = useState<ProjectSection[]>([makeProjSection('paragraph')]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [projectTags, setProjectTags] = useState<string[]>([]);
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── English translation state ────────────────────────────────────────────
    const [enOpen, setEnOpen] = useState(false);
    const [titleEn, setTitleEn] = useState('');
    const [excerptEn, setExcerptEn] = useState('');
    const [categoryEn, setCategoryEn] = useState('');
    const [clientEn, setClientEn] = useState('');
    const [servicesEn, setServicesEn] = useState('');
    const [durationEn, setDurationEn] = useState('');
    const [heroDescriptionEn, setHeroDescriptionEn] = useState('');
    const [sectionsEnProj, setSectionsEnProj] = useState<ProjectSection[]>([makeProjSection('paragraph')]);

    const { register: regMeta, handleSubmit, setValue, watch } = useForm<ProjectMeta>({
        defaultValues: {
            title: '', slug: '', excerpt: '', category: '', emoji: '🎨',
            client: '', services: '', duration: '', year: new Date().getFullYear().toString(),
            heroDescription: '',
        },
    });

    const slug = watch('slug');
    const title = watch('title');

    useEffect(() => { if (title && !metaTitle) setMetaTitle(title); }, [title, metaTitle]);

    const metricsForm = useForm<MetricsForm>({
        defaultValues: { rows: [{ label: 'Conversiones', value: '' }, { label: 'Engagement', value: '' }, { label: 'ROI', value: '' }] },
    });
    const toolsForm = useForm<ToolsForm>({ defaultValues: { rows: [{ tool: '' }] } });

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const generateSlug = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const addSection = (type: ProjectSectionType) => setSections(prev => [...prev, makeProjSection(type)]);
    const deleteSection = (sId: string) => setSections(prev => prev.filter(s => s.id !== sId));
    const updateSection = (updated: ProjectSection) => setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
    const moveSection = useCallback((sId: string, dir: -1 | 1) => {
        setSections(prev => {
            const idx = prev.findIndex(s => s.id === sId);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    // EN section helpers
    const addSectionEn = (type: ProjectSectionType) => setSectionsEnProj(prev => [...prev, makeProjSection(type)]);
    const deleteSectionEn = (sId: string) => setSectionsEnProj(prev => prev.filter(s => s.id !== sId));
    const updateSectionEn = (upd: ProjectSection) => setSectionsEnProj(prev => prev.map(s => s.id === upd.id ? upd : s));
    const moveSectionEn = useCallback((sId: string, dir: -1 | 1) => {
        setSectionsEnProj(prev => {
            const idx = prev.findIndex(s => s.id === sId);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    const handleCoverFile = (file: File | null) => {
        setCoverFile(file);
        if (file) { const r = new FileReader(); r.onload = e => setCoverPreview(e.target?.result as string); r.readAsDataURL(file); }
        else setCoverPreview(null);
    };

    const uploadCover = async (file: File, slug: string): Promise<string> => {
        const ext = file.name.split('.').pop();
        const path = `projects/${slug}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('post-images').upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        const { data } = supabase.storage.from('post-images').getPublicUrl(path);
        return data.publicUrl;
    };

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = async (metaData: ProjectMeta) => {
        try {
            setIsSubmitting(true);
            if (!metaData.slug) { metaData.slug = generateSlug(metaData.title); setValue('slug', metaData.slug); }

            let cover_image: string | null = null;
            if (coverFile) {
                toast.loading('Subiendo imagen...', { id: 'upload' });
                cover_image = await uploadCover(coverFile, metaData.slug);
                toast.dismiss('upload');
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast.error('No estás autenticado'); router.push('/login'); return; }

            const { error } = await supabase.from('projects').insert({
                title: metaData.title, slug: metaData.slug, excerpt: metaData.excerpt,
                category: metaData.category, emoji: metaData.emoji,
                client: metaData.client, services: metaData.services,
                duration: metaData.duration, year: metaData.year,
                tags: projectTags, cover_image,
                content: buildProjectContent(metaData.heroDescription, sections, { title: metaTitle, description: metaDesc }),
                metrics: buildMetrics(metricsForm.getValues('rows')),
                tools: buildTools(toolsForm.getValues('rows')),
                published, featured, author_id: user.id,
                published_at: published ? new Date().toISOString() : null,
                title_en: titleEn || null,
                excerpt_en: excerptEn || null,
                category_en: categoryEn || null,
                client_en: clientEn || null,
                services_en: servicesEn || null,
                duration_en: durationEn || null,
                content_en: sectionsEnProj.length > 0 ? buildProjectContent(heroDescriptionEn, sectionsEnProj, { title: '', description: '' }) : null,
            });
            if (error) throw error;

            toast.success('¡Proyecto creado!');
            router.push('/dashboard/projects');
            router.refresh();
        } catch (err: unknown) {
            toast.dismiss('upload');
            toast.error(err instanceof Error ? err.message : 'Error al crear el proyecto');
        } finally { setIsSubmitting(false); }
    };

    // ─── UI ───────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-cream/30">
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-text/[0.06] px-6 py-3 flex items-center justify-between gap-4">
                    <Link href="/dashboard/projects"
                        className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1.5 flex-shrink-0">
                        ← Proyectos
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href="/dashboard/projects"
                            className="px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-text/[0.1] rounded-lg transition-colors">
                            Descartar
                        </Link>
                        <button type="submit" disabled={isSubmitting}
                            onClick={() => setPublished(false)}
                            className="px-4 py-2 text-sm font-semibold text-text border border-text/[0.15] rounded-lg hover:bg-cream transition-colors disabled:opacity-50">
                            {isSubmitting ? '...' : 'Guardar borrador'}
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            onClick={() => setPublished(true)}
                            className="px-4 py-2 text-sm font-bold bg-text text-white rounded-lg hover:bg-text/80 transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Guardando...' : '↗ Publicar'}
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* LEFT */}
                        <div className="flex-1 min-w-0 space-y-4">

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <input {...regMeta('title', { required: true })}
                                    onChange={e => { regMeta('title').onChange(e); setValue('slug', generateSlug(e.target.value)); }}
                                    className="w-full text-2xl font-bold text-text placeholder:text-subtle/50 outline-none bg-transparent border-none"
                                    placeholder="Título del proyecto..." autoFocus />
                            </div>

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-2">Descripción del Hero</label>
                                <textarea {...regMeta('heroDescription')} rows={3}
                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                    placeholder="Texto que aparece en el hero del caso de estudio..." />
                            </div>

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="text-sm font-bold text-text">Contenido del Caso de Estudio</h2>
                                        <p className="text-xs text-subtle mt-0.5">
                                            {sections.length} bloque{sections.length !== 1 ? 's' : ''} · narrativa, reto, proceso, resultados…
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {sections.map((section, index) => (
                                        <ProjectSectionCard key={section.id} section={section} index={index} total={sections.length}
                                            onMoveUp={() => moveSection(section.id, -1)} onMoveDown={() => moveSection(section.id, 1)}
                                            onDelete={() => deleteSection(section.id)} onChange={updateSection} />
                                    ))}
                                    <AddProjectSectionPicker onAdd={addSection} />
                                </div>
                            </div>

                            <MetricsEditor form={metricsForm} />
                            <ToolsEditor form={toolsForm} />

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
                                                placeholder="Project title in English..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Excerpt (EN)</label>
                                            <textarea value={excerptEn} onChange={e => setExcerptEn(e.target.value)} rows={2}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                                placeholder="Short description in English..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Hero description (EN)</label>
                                            <textarea value={heroDescriptionEn} onChange={e => setHeroDescriptionEn(e.target.value)} rows={2}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                                placeholder="Hero text in English..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Category (EN)</label>
                                                <input value={categoryEn} onChange={e => setCategoryEn(e.target.value)}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Digital Marketing" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Duration (EN)</label>
                                                <input value={durationEn} onChange={e => setDurationEn(e.target.value)}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="3 months" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Client (EN)</label>
                                                <input value={clientEn} onChange={e => setClientEn(e.target.value)}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Client name" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Services (EN)</label>
                                                <input value={servicesEn} onChange={e => setServicesEn(e.target.value)}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Email Marketing, SEO" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-subtle">Content (EN)</h3>
                                                <span className="text-xs text-subtle">{sectionsEnProj.length} block{sectionsEnProj.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="space-y-3">
                                                {sectionsEnProj.map((section, index) => (
                                                    <ProjectSectionCard key={section.id} section={section} index={index} total={sectionsEnProj.length}
                                                        onMoveUp={() => moveSectionEn(section.id, -1)} onMoveDown={() => moveSectionEn(section.id, 1)}
                                                        onDelete={() => deleteSectionEn(section.id)} onChange={updateSectionEn} />
                                                ))}
                                                <AddProjectSectionPicker onAdd={addSectionEn} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <ProjectSidebar
                            published={published} setPublished={setPublished}
                            featured={featured} setFeatured={setFeatured}
                            coverDisplayed={coverPreview}
                            onCoverClick={() => fileInputRef.current?.click()}
                            onCoverRemove={() => handleCoverFile(null)}
                            fileInputRef={fileInputRef}
                            onFileChange={e => handleCoverFile(e.target.files?.[0] ?? null)}
                            regMeta={regMeta}
                            projectTags={projectTags} setProjectTags={setProjectTags}
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
