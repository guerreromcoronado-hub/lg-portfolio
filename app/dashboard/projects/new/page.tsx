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
import { ConfirmDiscardModal } from '../../_components/ConfirmDiscardModal';
import { useUnsavedChangesGuard } from '../../_components/useUnsavedChangesGuard';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewProjectPage() {
    const router = useRouter();
    const supabase = createClient();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sections, setSections] = useState<ProjectSection[]>([makeProjSection('paragraph')]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
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

    const { register: regMeta, handleSubmit, setValue, setFocus, watch, formState: { isDirty } } = useForm<ProjectMeta>({
        defaultValues: {
            title: '', slug: '', excerpt: '', category: '', emoji: '',
            client: '', services: '', duration: '', year: new Date().getFullYear().toString(),
            heroDescription: '',
        },
    });

    const slug = watch('slug');
    const title = watch('title');

    const shouldRequireFields = () => submitPublishedRef.current ?? published;

    useEffect(() => { if (title && !metaTitle) setMetaTitle(title); }, [title, metaTitle]);

    const metricsForm = useForm<MetricsForm>({
        defaultValues: { rows: [{ label: 'Conversiones', value: '' }, { label: 'Engagement', value: '' }, { label: 'ROI', value: '' }] },
    });
    const toolsForm = useForm<ToolsForm>({ defaultValues: { rows: [{ tool: '' }] } });

    useUnsavedChangesGuard((isDirty || hasCustomChanges || metricsForm.formState.isDirty || toolsForm.formState.isDirty) && !isSubmitting);

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

    const handleCoverFile = async (file: File | null) => {
        setHasCustomChanges(true);
        if (!file) {
            setCoverFile(null);
            setCoverImageUrl(null);
            setCoverPreview(null);
            setUploadProgress(0);
            return;
        }

        setCoverFile(file);

        const previewReader = new FileReader();
        previewReader.onload = e => setCoverPreview(e.target?.result as string);
        previewReader.readAsDataURL(file);

        const slugCandidate = slug?.trim() || generateSlug(title || '') || `project-${Date.now()}`;

        try {
            setIsUploadingCover(true);
            toast.loading('Subiendo imagen...', { id: 'upload' });
            const publicUrl = await uploadCover(file, slugCandidate);
            setCoverImageUrl(publicUrl);
            setCoverPreview(publicUrl);
            toast.success('Imagen subida correctamente', { id: 'upload' });
        } catch (err: unknown) {
            setCoverImageUrl(null);
            toast.error(err instanceof Error ? err.message : 'No se pudo subir la imagen', { id: 'upload' });
        } finally {
            setIsUploadingCover(false);
            setUploadProgress(0);
        }
    };

    const uploadCover = async (file: File, slug: string): Promise<string> => {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `projects/${slug}-${Date.now()}.${ext}`;
        setUploadProgress(30);
        const { error } = await supabase.storage.from('post-images').upload(path, file, { upsert: true, contentType: file.type });
        if (error) throw error;
        setUploadProgress(80);
        const { data } = supabase.storage.from('post-images').getPublicUrl(path);
        setUploadProgress(100);
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
            const effectivePublished = submitPublishedRef.current ?? published;
            if (!effectivePublished) {
                if (!metaData.title?.trim()) metaData.title = 'Proyecto en borrador';
                if (!metaData.excerpt?.trim()) metaData.excerpt = '';
                if (!metaData.category?.trim()) metaData.category = 'Sin categoría';
                if (!metaData.slug?.trim()) {
                    metaData.slug = generateSlug(metaData.title) || `proyecto-borrador-${Date.now()}`;
                }
                setValue('title', metaData.title);
                setValue('excerpt', metaData.excerpt);
                setValue('category', metaData.category);
                setValue('slug', metaData.slug);
            } else if (!metaData.slug) {
                metaData.slug = generateSlug(metaData.title);
                setValue('slug', metaData.slug);
            }

            let cover_image: string | null = coverImageUrl;
            if (coverFile && !cover_image) {
                try {
                    toast.loading('Subiendo imagen...', { id: 'upload' });
                    cover_image = await uploadCover(coverFile, metaData.slug);
                    setCoverImageUrl(cover_image);
                    setCoverPreview(cover_image);
                    toast.success('Imagen subida correctamente', { id: 'upload' });
                } catch (err: unknown) {
                    toast.error('No se pudo subir la imagen. Se publicará sin portada.', { id: 'upload' });
                }
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast.error('No estás autenticado'); router.push('/login'); return; }

            toast.loading('Procesando contenido...', { id: 'content-images' });
            const normalizedSections = await uploadSectionImages(sections, metaData.slug);
            const normalizedSectionsEn = await uploadSectionImages(sectionsEnProj, `${metaData.slug}-en`);
            toast.dismiss('content-images');

            const { error } = await supabase.from('projects').insert({
                title: metaData.title, slug: metaData.slug, excerpt: metaData.excerpt,
                category: metaData.category, emoji: metaData.emoji,
                client: metaData.client, services: metaData.services,
                duration: metaData.duration, year: metaData.year,
                tags: projectTags, cover_image,
                content: buildProjectContent(metaData.heroDescription, normalizedSections, { title: metaTitle, description: metaDesc }),
                metrics: buildMetrics(metricsForm.getValues('rows')),
                tools: buildTools(toolsForm.getValues('rows')),
                published: effectivePublished,
                featured,
                author_id: user.id,
                published_at: effectivePublished ? new Date().toISOString() : null,
                title_en: titleEn || null,
                excerpt_en: excerptEn || null,
                category_en: categoryEn || null,
                client_en: clientEn || null,
                services_en: servicesEn || null,
                duration_en: durationEn || null,
                content_en: normalizedSectionsEn.length > 0 ? buildProjectContent(heroDescriptionEn, normalizedSectionsEn, { title: '', description: '' }) : null,
            });
            if (error) throw error;

            toast.success(effectivePublished ? 'Proyecto publicado' : 'Proyecto guardado como borrador');
            router.push('/dashboard/projects');
            router.refresh();
        } catch (err: unknown) {
            toast.dismiss('upload');
            toast.dismiss('content-images');
            toast.error(err instanceof Error ? err.message : 'Error al crear el proyecto');
        } finally {
            submitPublishedRef.current = null;
            setIsSubmitting(false);
        }
    };

    const onInvalid = (errors: Record<string, { message?: string }>) => {
        const labels: Record<string, string> = {
            title: 'Titulo',
            excerpt: 'Resumen',
            category: 'Categoria',
            slug: 'URL',
        };
        const keys = Object.keys(errors);
        const missing = keys.map(k => labels[k] ?? k);
        toast.error(missing.length > 0
            ? `Faltan campos obligatorios: ${missing.join(', ')}`
            : 'Completa los campos requeridos para publicar');
        if (keys.length > 0) {
            setFocus(keys[0] as keyof ProjectMeta);
        }
    };

    const confirmDiscard = () => {
        setShowDiscardModal(false);
        router.push('/dashboard/projects');
    };

    // ─── UI ───────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-cream/30">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>

                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-text/[0.06] px-6 py-3 flex items-center justify-between gap-4">
                    <Link href="/dashboard/projects"
                        className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1.5 flex-shrink-0">
                        Proyectos
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setShowDiscardModal(true)}
                            className="px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-text/[0.1] rounded-lg transition-colors">
                            Descartar
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            onClick={() => setPublished(false)}
                            onClickCapture={() => { submitPublishedRef.current = false; }}
                            className="px-4 py-2 text-sm font-semibold text-text border border-text/[0.15] rounded-lg hover:bg-cream transition-colors disabled:opacity-50">
                            {isSubmitting ? '...' : 'Guardar borrador'}
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            onClick={() => setPublished(true)}
                            onClickCapture={() => { submitPublishedRef.current = true; }}
                            className="px-4 py-2 text-sm font-bold bg-text text-white rounded-lg hover:bg-text/80 transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Guardando...' : 'Publicar'}
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
                            coverDisplayed={coverPreview}
                            onCoverClick={() => fileInputRef.current?.click()}
                            onCoverRemove={() => handleCoverFile(null)}
                            fileInputRef={fileInputRef}
                            onFileChange={e => { void handleCoverFile(e.target.files?.[0] ?? null); }}
                            uploadProgress={uploadProgress}
                            regMeta={regMeta}
                            projectTags={projectTags} setProjectTags={(value) => { setHasCustomChanges(true); setProjectTags(value); }}
                            metaTitle={metaTitle} setMetaTitle={(value) => { setHasCustomChanges(true); setMetaTitle(value); }}
                            metaDesc={metaDesc} setMetaDesc={(value) => { setHasCustomChanges(true); setMetaDesc(value); }}
                            slug={slug}
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
