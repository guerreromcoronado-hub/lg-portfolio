'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    ProjectSection, ProjectSectionType,
    makeProjSection, ProjectSectionCard, AddProjectSectionPicker,
    buildProjectContent, sectionsFromProjectDB,
    buildMetrics, buildTools, metricsFromDB, toolsFromDB,
} from '../_components/ProjectSectionBuilder';
import { ProjectSidebar, ProjectMeta } from '../_components/ProjectSidebar';
import { MetricsEditor, ToolsEditor, MetricsForm, ToolsForm } from '../_components/MetricsToolsEditors';
import { ConfirmDiscardModal } from '../../_components/ConfirmDiscardModal';
import { useUnsavedChangesGuard } from '../../_components/useUnsavedChangesGuard';
import { IconEye } from '@/components/icons';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProjectPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const supabase = createClient();

    const [fetching, setFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentSlug, setCurrentSlug] = useState('');
    const [sections, setSections] = useState<ProjectSection[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [existingCover, setExistingCover] = useState<string | null>(null);
    const [projectTags, setProjectTags] = useState<string[]>([]);
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [hasCustomChanges, setHasCustomChanges] = useState(false);
    const submitPublishedRef = useRef<boolean | null>(null);
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

    const { register: regMeta, handleSubmit, setValue, reset: resetMeta, setFocus, watch, formState: { isDirty } } = useForm<ProjectMeta>({
        defaultValues: {
            title: '', slug: '', excerpt: '', category: '', emoji: '',
            client: '', services: '', duration: '', year: new Date().getFullYear().toString(),
            heroDescription: '',
        },
    });

    const slug = watch('slug');

    const shouldRequireFields = () => submitPublishedRef.current ?? published;

    const metricsForm = useForm<MetricsForm>({ defaultValues: { rows: [{ label: '', value: '' }] } });
    const toolsForm = useForm<ToolsForm>({ defaultValues: { rows: [{ tool: '' }] } });

    useUnsavedChangesGuard((isDirty || hasCustomChanges || metricsForm.formState.isDirty || toolsForm.formState.isDirty) && !isSubmitting);

    // ─── Load project ─────────────────────────────────────────────────────────

    useEffect(() => {
        if (!id) return;
        (async () => {
            const { data: project, error } = await supabase
                .from('projects').select('*').eq('id', id).single();

            if (error || !project) {
                toast.error('No se encontró el proyecto');
                router.push('/dashboard/projects');
                return;
            }

            const c = project.content ?? {};
            resetMeta({
                title: project.title ?? '',
                slug: project.slug ?? '',
                excerpt: project.excerpt ?? '',
                category: project.category ?? '',
                emoji: project.emoji ?? '',
                client: project.client ?? '',
                services: project.services ?? '',
                duration: project.duration ?? '',
                year: project.year?.toString() ?? new Date().getFullYear().toString(),
                heroDescription: c.hero?.description ?? '',
            });

            setCurrentSlug(project.slug ?? '');
            setPublished(project.published ?? false);
            setFeatured(project.featured ?? false);
            if (Array.isArray(project.tags) && project.tags.length > 0) setProjectTags(project.tags);
            if (project.cover_image) setExistingCover(project.cover_image);

            if (c.seo?.title) setMetaTitle(c.seo.title);
            else setMetaTitle(project.title ?? '');
            if (c.seo?.description) setMetaDesc(c.seo.description);

            setSections(sectionsFromProjectDB(c, project.results));
            metricsForm.reset({ rows: metricsFromDB(project.metrics) });
            toolsForm.reset({ rows: toolsFromDB(project.tools) });

            // Load EN fields
            if (project.title_en) setTitleEn(project.title_en);
            if (project.excerpt_en) setExcerptEn(project.excerpt_en);
            if (project.category_en) setCategoryEn(project.category_en);
            if (project.client_en) setClientEn(project.client_en);
            if (project.services_en) setServicesEn(project.services_en);
            if (project.duration_en) setDurationEn(project.duration_en);
            if (project.content_en?.hero?.description) setHeroDescriptionEn(project.content_en.hero.description);
            if (project.content_en?.sections?.length > 0) setSectionsEnProj(sectionsFromProjectDB(project.content_en, null));

            setHasCustomChanges(false);
            setFetching(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const generateSlug = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const addSection = (type: ProjectSectionType) => { setHasCustomChanges(true); setSections(prev => [...prev, makeProjSection(type)]); };
    const deleteSection = (sId: string) => { setHasCustomChanges(true); setSections(prev => prev.filter(s => s.id !== sId)); };
    const updateSection = (updated: ProjectSection) => { setHasCustomChanges(true); setSections(prev => prev.map(s => s.id === updated.id ? updated : s)); };
    const moveSection = useCallback((sId: string, dir: -1 | 1) => {
        setHasCustomChanges(true);
        setSections(prev => {
            const idx = prev.findIndex(s => s.id === sId);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    // EN section helpers
    const addSectionEn = useCallback((type: ProjectSectionType) => { setHasCustomChanges(true); setSectionsEnProj(prev => [...prev, makeProjSection(type)]); }, []);
    const deleteSectionEn = useCallback((sId: string) => { setHasCustomChanges(true); setSectionsEnProj(prev => prev.filter(s => s.id !== sId)); }, []);
    const updateSectionEn = useCallback((upd: ProjectSection) => { setHasCustomChanges(true); setSectionsEnProj(prev => prev.map(s => s.id === upd.id ? upd : s)); }, []);
    const moveSectionEn = useCallback((sId: string, dir: -1 | 1) => {
        setHasCustomChanges(true);
        setSectionsEnProj(prev => {
            const idx = prev.findIndex(s => s.id === sId);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    const handleCoverFile = (file: File | null) => {
        setHasCustomChanges(true);
        setCoverFile(file);
        if (file) { const r = new FileReader(); r.onload = e => setCoverPreview(e.target?.result as string); r.readAsDataURL(file); }
        else setCoverPreview(null);
    };

    const uploadCover = async (file: File, slug: string): Promise<string> => {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `projects/${slug}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('post-images').upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        const { data } = supabase.storage.from('post-images').getPublicUrl(path);
        return data.publicUrl;
    };

    const dataUrlToFile = (dataUrl: string, fileName: string): File => {
        const [meta, base64] = dataUrl.split(',');
        if (!meta || !base64) throw new Error('Data URL inválida');
        const mimeMatch = meta.match(/data:(.*?);base64/);
        const mime = mimeMatch?.[1] || 'image/jpeg';
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new File([bytes], fileName, { type: mime });
    };

    const uploadSectionImages = async (sourceSections: ProjectSection[], projectSlug: string): Promise<ProjectSection[]> => {
        const normalized = [...sourceSections];

        for (let i = 0; i < normalized.length; i++) {
            const section = normalized[i];
            if (section.type !== 'image') continue;
            if (!section.url || !section.url.startsWith('data:image/')) continue;

            const mime = section.url.match(/^data:(image\/[^;]+);base64,/)?.[1] || 'image/jpeg';
            const ext = mime.split('/')[1] || 'jpg';
            const file = dataUrlToFile(section.url, `project-section-${i + 1}.${ext}`);
            const path = `projects/sections/${projectSlug}/${Date.now()}-${i}.${ext}`;
            const { error } = await supabase.storage.from('post-images').upload(path, file, {
                upsert: true,
                contentType: file.type,
            });
            if (error) throw error;

            const { data } = supabase.storage.from('post-images').getPublicUrl(path);
            normalized[i] = { ...section, url: data.publicUrl };
        }

        return normalized;
    };

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = async (metaData: ProjectMeta) => {
        try {
            setIsSubmitting(true);
            if (!metaData.slug) { metaData.slug = generateSlug(metaData.title); setValue('slug', metaData.slug); }

            const effectivePublished = submitPublishedRef.current ?? published;

            toast.loading('Procesando contenido...', { id: 'content-images' });
            const normalizedSections = await uploadSectionImages(sections, metaData.slug);
            const normalizedSectionsEn = await uploadSectionImages(sectionsEnProj, `${metaData.slug}-en`);
            toast.dismiss('content-images');

            let cover_image: string | null = existingCover;
            if (coverFile) {
                toast.loading('Subiendo imagen...', { id: 'upload' });
                cover_image = await uploadCover(coverFile, metaData.slug);
                toast.dismiss('upload');
            }

            const { error } = await supabase.from('projects').update({
                title: metaData.title, slug: metaData.slug, excerpt: metaData.excerpt,
                category: metaData.category, emoji: metaData.emoji,
                client: metaData.client, services: metaData.services,
                duration: metaData.duration, year: metaData.year,
                tags: projectTags, cover_image,
                content: buildProjectContent(metaData.heroDescription, normalizedSections, { title: metaTitle, description: metaDesc }),
                metrics: buildMetrics(metricsForm.getValues('rows')),
                tools: buildTools(toolsForm.getValues('rows')),
                results: null,
                published: effectivePublished,
                featured,
                updated_at: new Date().toISOString(),
                published_at: effectivePublished ? new Date().toISOString() : null,
                title_en: titleEn || null,
                excerpt_en: excerptEn || null,
                category_en: categoryEn || null,
                client_en: clientEn || null,
                services_en: servicesEn || null,
                duration_en: durationEn || null,
                content_en: normalizedSectionsEn.length > 0 ? buildProjectContent(heroDescriptionEn, normalizedSectionsEn, { title: '', description: '' }) : null,
            }).eq('id', id);
            if (error) throw error;

            setCurrentSlug(metaData.slug);
            resetMeta(metaData);
            setHasCustomChanges(false);
            toast.success(effectivePublished ? 'Cambios publicados' : 'Borrador guardado');
            router.refresh();
        } catch (err: unknown) {
            toast.dismiss('upload');
            toast.dismiss('content-images');
            toast.error(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            submitPublishedRef.current = null;
            setIsSubmitting(false);
        }
    };

    const confirmDiscard = () => {
        setShowDiscardModal(false);
        router.push('/dashboard/projects');
    };

    const onInvalid = (errors: Record<string, { message?: string }>) => {
        const labels: Record<string, string> = {
            title: 'Titulo',
            excerpt: 'Resumen',
            category: 'Categoria',
            slug: 'URL',
        };

        const keys = Object.keys(errors);
        if (keys.length === 0) {
            toast.error('Completa los campos obligatorios para publicar');
            return;
        }

        const missing = keys.map(k => labels[k] ?? k);
        toast.error(`Faltan campos obligatorios: ${missing.join(', ')}`);
        setFocus(keys[0] as keyof ProjectMeta);
    };

    // ─── Loading ──────────────────────────────────────────────────────────────

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted text-sm">Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    // ─── UI ───────────────────────────────────────────────────────────────────

    const coverDisplayed = coverPreview ?? existingCover;

    return (
        <div className="min-h-screen bg-cream/30">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>

                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-text/[0.06] px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/projects"
                            className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1.5 flex-shrink-0">
                            Proyectos
                        </Link>
                        {currentSlug && (
                            <Link href={`/proyectos/${currentSlug}`} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-subtle hover:text-orange transition-colors inline-flex items-center gap-1">
                                <IconEye size={13} /> Ver proyecto
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setShowDiscardModal(true)}
                            className="px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-text/[0.1] rounded-lg transition-colors">
                            Descartar
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            onClickCapture={() => { submitPublishedRef.current = null; }}
                            className="px-4 py-2 text-sm font-semibold text-text border border-text/[0.15] rounded-lg hover:bg-cream transition-colors disabled:opacity-50">
                            {isSubmitting ? '...' : 'Guardar cambios'}
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            onClick={() => setPublished(true)}
                            onClickCapture={() => { submitPublishedRef.current = true; }}
                            className="px-4 py-2 text-sm font-bold bg-text text-white rounded-lg hover:bg-text/80 transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Guardando...' : published ? 'Publicar cambios' : 'Publicar'}
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* LEFT */}
                        <div className="flex-1 min-w-0 space-y-4">

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <input {...regMeta('title', {
                                    validate: value => !shouldRequireFields() || Boolean(value?.trim()),
                                })}
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

                            {/* English Translation */}
                            <div className="bg-white rounded-xl border border-text/[0.06]">
                                <button type="button" onClick={() => setEnOpen(v => !v)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream/30 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-bold text-text">Traducción</h2>
                                        <span className="text-xs text-subtle">(opcional)</span>
                                    </div>
                                    <span className="text-subtle text-sm">{enOpen ? 'Ocultar' : 'Mostrar'}</span>
                                </button>
                                {enOpen && (
                                    <div className="px-6 pb-6 space-y-4 border-t border-text/[0.06]">
                                        <div className="pt-4">
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Title (EN)</label>
                                            <input value={titleEn} onChange={e => { setHasCustomChanges(true); setTitleEn(e.target.value); }}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                placeholder="Project title in English..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Excerpt (EN)</label>
                                            <textarea value={excerptEn} onChange={e => { setHasCustomChanges(true); setExcerptEn(e.target.value); }} rows={2}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                                placeholder="Short description in English..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Hero description (EN)</label>
                                            <textarea value={heroDescriptionEn} onChange={e => { setHasCustomChanges(true); setHeroDescriptionEn(e.target.value); }} rows={2}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                                placeholder="Hero text in English..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Category (EN)</label>
                                                <input value={categoryEn} onChange={e => { setHasCustomChanges(true); setCategoryEn(e.target.value); }}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Digital Marketing" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Duration (EN)</label>
                                                <input value={durationEn} onChange={e => { setHasCustomChanges(true); setDurationEn(e.target.value); }}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="3 months" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Client (EN)</label>
                                                <input value={clientEn} onChange={e => { setHasCustomChanges(true); setClientEn(e.target.value); }}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Client name" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Services (EN)</label>
                                                <input value={servicesEn} onChange={e => { setHasCustomChanges(true); setServicesEn(e.target.value); }}
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
                            published={published} setPublished={(value) => { setHasCustomChanges(true); setPublished(value); }}
                            featured={featured} setFeatured={(value) => { setHasCustomChanges(true); setFeatured(value); }}
                            coverDisplayed={coverDisplayed}
                            onCoverClick={() => fileInputRef.current?.click()}
                            onCoverRemove={() => { setHasCustomChanges(true); setCoverFile(null); setCoverPreview(null); setExistingCover(null); }}
                            fileInputRef={fileInputRef}
                            onFileChange={e => handleCoverFile(e.target.files?.[0] ?? null)}
                            regMeta={regMeta}
                            onSlugChange={setCurrentSlug}
                            projectTags={projectTags} setProjectTags={(value) => { setHasCustomChanges(true); setProjectTags(value); }}
                            metaTitle={metaTitle} setMetaTitle={(value) => { setHasCustomChanges(true); setMetaTitle(value); }}
                            metaDesc={metaDesc} setMetaDesc={(value) => { setHasCustomChanges(true); setMetaDesc(value); }}
                            slug={slug} currentSlug={currentSlug}
                            shouldRequireFields={shouldRequireFields}
                        />
                    </div>
                </div>
            </form>
            <ConfirmDiscardModal
                isOpen={showDiscardModal}
                onCancel={() => setShowDiscardModal(false)}
                onConfirm={confirmDiscard}
            />
        </div>
    );
}
