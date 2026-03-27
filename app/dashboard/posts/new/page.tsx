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
import { ConfirmDiscardModal } from '../../_components/ConfirmDiscardModal';
import { useUnsavedChangesGuard } from '../../_components/useUnsavedChangesGuard';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewPostPage() {
    const router = useRouter();
    const supabase = createClient();
    const { register, handleSubmit, setValue, watch, setFocus, formState: { isDirty } } = useForm<PostFormData>({
        defaultValues: { emoji: '', read_time: '5 min' },
    });

    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<Section[]>([makeSection('paragraph')]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [publishStatus, setPublishStatus] = useState<PublishStatus>('draft');
    const [scheduleDate, setScheduleDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [hasCustomChanges, setHasCustomChanges] = useState(false);

    // ─── English translation state ────────────────────────────────────────────
    const [enOpen, setEnOpen] = useState(false);
    const [titleEn, setTitleEn] = useState('');
    const [excerptEn, setExcerptEn] = useState('');
    const [categoryEn, setCategoryEn] = useState('');
    const [readTimeEn, setReadTimeEn] = useState('');
    const [sectionsEn, setSectionsEn] = useState<Section[]>([makeSection('paragraph')]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const submitIntentRef = useRef<PublishStatus | null>(null);
    const slug = watch('slug');
    const title = watch('title');

    const shouldRequireFields = () => (submitIntentRef.current ?? publishStatus) !== 'draft';

    useUnsavedChangesGuard((isDirty || hasCustomChanges) && !loading);

    const generateSlug = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    useEffect(() => { if (title && !metaTitle) setMetaTitle(title); }, [title, metaTitle]);

    // ─── Helpers ──────────────────────────────────────────────────────────────

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

        const slugCandidate = slug?.trim() || generateSlug(title || '') || `post-${Date.now()}`;

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

    const addSection = (type: SectionType) => { setHasCustomChanges(true); setSections(prev => [...prev, makeSection(type)]); };
    const deleteSection = (id: string) => { setHasCustomChanges(true); setSections(prev => prev.filter(s => s.id !== id)); };
    const updateSection = (upd: Section) => { setHasCustomChanges(true); setSections(prev => prev.map(s => s.id === upd.id ? upd : s)); };
    const moveSection = useCallback((id: string, dir: -1 | 1) => {
        setHasCustomChanges(true);
        setSections(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    // EN section helpers
    const addSectionEn = useCallback((type: SectionType) => { setHasCustomChanges(true); setSectionsEn(prev => [...prev, makeSection(type)]); }, []);
    const deleteSectionEn = useCallback((id: string) => { setHasCustomChanges(true); setSectionsEn(prev => prev.filter(s => s.id !== id)); }, []);
    const updateSectionEn = useCallback((upd: Section) => { setHasCustomChanges(true); setSectionsEn(prev => prev.map(s => s.id === upd.id ? upd : s)); }, []);
    const moveSectionEn = useCallback((id: string, dir: -1 | 1) => {
        setHasCustomChanges(true);
        setSectionsEn(prev => {
            const idx = prev.findIndex(s => s.id === id);
            if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
            const next = [...prev];[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]; return next;
        });
    }, []);

    const uploadCover = async (file: File, postSlug: string): Promise<string> => {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${postSlug}-${Date.now()}.${ext}`;
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

    const uploadSectionImages = async (sourceSections: Section[], postSlug: string): Promise<Section[]> => {
        const normalized = [...sourceSections];

        for (let i = 0; i < normalized.length; i++) {
            const section = normalized[i];
            if (section.type !== 'image') continue;
            if (!section.url || !section.url.startsWith('data:image/')) continue;

            const mime = section.url.match(/^data:(image\/[^;]+);base64,/)?.[1] || 'image/jpeg';
            const ext = mime.split('/')[1] || 'jpg';
            const file = dataUrlToFile(section.url, `section-${i + 1}.${ext}`);
            const path = `sections/${postSlug}/${Date.now()}-${i}.${ext}`;
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

    const onSubmit = async (data: PostFormData) => {
        setLoading(true);
        try {
            const effectivePublishStatus = submitIntentRef.current ?? publishStatus;
            if (effectivePublishStatus === 'scheduled' && !scheduleDate) {
                toast.error('Selecciona fecha y hora para programar el post');
                return;
            }
            if (effectivePublishStatus === 'draft') {
                if (!data.title?.trim()) data.title = 'Borrador sin título';
                if (!data.excerpt?.trim()) data.excerpt = '';
                if (!data.category?.trim()) data.category = 'Sin categoría';
                if (!data.slug?.trim()) {
                    data.slug = generateSlug(data.title) || `borrador-${Date.now()}`;
                }
                setValue('title', data.title);
                setValue('excerpt', data.excerpt);
                setValue('category', data.category);
                setValue('slug', data.slug);
            } else if (!data.slug) {
                data.slug = generateSlug(data.title);
                setValue('slug', data.slug);
            }

            let cover_image: string | null = coverImageUrl;
            if (coverFile && !cover_image) {
                try {
                    toast.loading('Subiendo imagen...', { id: 'upload' });
                    cover_image = await uploadCover(coverFile, data.slug);
                    setCoverImageUrl(cover_image);
                    setCoverPreview(cover_image);
                    toast.success('Imagen subida correctamente', { id: 'upload' });
                } catch (err: unknown) {
                    toast.error('No se pudo subir la imagen. Se publicará sin portada.', { id: 'upload' });
                }
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast.error('No estás autenticado'); router.push('/login'); return; }

            const isPublished = effectivePublishStatus === 'active';
            const publishedAt = effectivePublishStatus === 'active' ? new Date().toISOString()
                : effectivePublishStatus === 'scheduled' && scheduleDate ? new Date(scheduleDate).toISOString() : null;

            toast.loading('Procesando contenido...', { id: 'content-images' });
            const normalizedSections = await uploadSectionImages(sections, data.slug);
            const normalizedSectionsEn = await uploadSectionImages(sectionsEn, `${data.slug}-en`);
            toast.dismiss('content-images');

            const { error } = await supabase.from('posts').insert({
                ...data, cover_image, author_id: user.id,
                content: buildContent(normalizedSections, { tags, seo: { title: metaTitle, description: metaDesc } }),
                published: isPublished, published_at: publishedAt,
                title_en: titleEn || null,
                excerpt_en: excerptEn || null,
                category_en: categoryEn || null,
                read_time_en: readTimeEn || null,
                content_en: normalizedSectionsEn.length > 0 ? buildContent(normalizedSectionsEn, {}) : null,
            });
            if (error) throw error;

            toast.success(
                effectivePublishStatus === 'draft'
                    ? ' Borrador guardado'
                    : effectivePublishStatus === 'scheduled'
                        ? 'Post programado'
                        : 'Post publicado'
            );
            router.push('/dashboard/posts');
            router.refresh();
        } catch (err: unknown) {
            toast.dismiss('upload');
            toast.dismiss('content-images');
            toast.error(err instanceof Error ? err.message : 'Error al crear el post');
        } finally {
            submitIntentRef.current = null;
            setLoading(false);
            setUploadProgress(0);
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
            setFocus(keys[0] as keyof PostFormData);
        }
    };

    const confirmDiscard = () => {
        setShowDiscardModal(false);
        router.push('/dashboard/posts');
    };

    // ─── UI ───────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-cream/30">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>

                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-text/[0.06] px-6 py-3 flex items-center justify-between gap-4">
                    <Link href="/dashboard/posts"
                        className="text-sm text-muted hover:text-text transition-colors flex items-center gap-1.5 flex-shrink-0">
                        Posts
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setShowDiscardModal(true)}
                            className="px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-text/[0.1] rounded-lg transition-colors">
                            Descartar
                        </button>
                        <button type="submit" disabled={loading} onClick={() => setPublishStatus('draft')}
                            onClickCapture={() => { submitIntentRef.current = 'draft'; }}
                            className="px-4 py-2 text-sm font-semibold text-text border border-text/[0.15] rounded-lg hover:bg-cream transition-colors disabled:opacity-50">
                            {loading ? '...' : 'Guardar borrador'}
                        </button>
                        <button type="submit" disabled={loading}
                            onClick={() => setPublishStatus(publishStatus === 'scheduled' ? 'scheduled' : 'active')}
                            onClickCapture={() => { submitIntentRef.current = publishStatus === 'scheduled' ? 'scheduled' : 'active'; }}
                            className="px-4 py-2 text-sm font-bold bg-text text-white rounded-lg hover:bg-text/80 transition-colors disabled:opacity-50">
                            {loading ? 'Guardando...' : publishStatus === 'scheduled' ? 'Programar' : 'Publicar'}
                        </button>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* LEFT */}
                        <div className="flex-1 min-w-0 space-y-4">

                            <div className="bg-white rounded-xl border border-text/[0.06] p-6">
                                <input {...register('title', {
                                    validate: value => !shouldRequireFields() || Boolean(value?.trim()),
                                })}
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
                                                placeholder="Post title in English..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Excerpt (EN)</label>
                                            <textarea value={excerptEn} onChange={e => { setHasCustomChanges(true); setExcerptEn(e.target.value); }} rows={2}
                                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                                                placeholder="Short description in English..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Category (EN)</label>
                                                <input value={categoryEn} onChange={e => { setHasCustomChanges(true); setCategoryEn(e.target.value); }}
                                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                                    placeholder="Email Marketing" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">Read time (EN)</label>
                                                <input value={readTimeEn} onChange={e => { setHasCustomChanges(true); setReadTimeEn(e.target.value); }}
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
                            publishStatus={publishStatus} setPublishStatus={(value) => { setHasCustomChanges(true); setPublishStatus(value); }}
                            scheduleDate={scheduleDate} setScheduleDate={(value) => { setHasCustomChanges(true); setScheduleDate(value); }}
                            coverDisplayed={coverPreview}
                            onCoverClick={() => fileInputRef.current?.click()}
                            onCoverRemove={() => handleCoverFile(null)}
                            fileInputRef={fileInputRef}
                            onFileChange={e => { void handleCoverFile(e.target.files?.[0] ?? null); }}
                            uploadProgress={uploadProgress}
                            register={register}
                            tags={tags} setTags={(value) => { setHasCustomChanges(true); setTags(value); }}
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
