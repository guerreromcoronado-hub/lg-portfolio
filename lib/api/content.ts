import { createClient } from '@/lib/supabase/server';
import { Post, Project } from '@/lib/types/database';
import { type Locale } from '@/lib/i18n/dictionaries';

type Schedulable = { published: boolean; published_at?: string | null };
type ContentQueryOptions = { lightweight?: boolean };

const POST_LIST_SELECT =
    'id,title,slug,excerpt,cover_image,category,published,published_at,views,read_time,title_en,excerpt_en,category_en,read_time_en';
const PROJECT_LIST_SELECT =
    'id,title,slug,excerpt,cover_image,category,published,featured,published_at,title_en,excerpt_en,category_en';

export function isLiveNow<T extends Schedulable>(item: T, now = new Date()): boolean {
    if (!item) return false;
    if (item.published) {
        if (!item.published_at) return true;
        const at = new Date(item.published_at);
        if (Number.isNaN(at.getTime())) return true;
        return at <= now;
    }

    if (!item.published_at) return false;
    const at = new Date(item.published_at);
    if (Number.isNaN(at.getTime())) return false;
    return at <= now;
}

// ── Localization helpers ────────────────────────────────────────────────────

function hasMeaningfulValue(value: unknown): boolean {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
        const entries = Object.values(value as Record<string, unknown>);
        return entries.some((entry) => hasMeaningfulValue(entry));
    }
    return true;
}

function mergeLocalizedValue<T>(baseValue: T, translatedValue: T | null | undefined): T {
    if (!hasMeaningfulValue(translatedValue)) return baseValue;

    if (Array.isArray(baseValue) || Array.isArray(translatedValue)) {
        return ((translatedValue as T) ?? baseValue) as T;
    }

    if (
        baseValue &&
        translatedValue &&
        typeof baseValue === 'object' &&
        typeof translatedValue === 'object'
    ) {
        const baseObj = baseValue as Record<string, unknown>;
        const translatedObj = translatedValue as Record<string, unknown>;
        const merged: Record<string, unknown> = { ...baseObj };

        for (const key of Object.keys(translatedObj)) {
            merged[key] = mergeLocalizedValue(baseObj[key], translatedObj[key]);
        }

        return merged as T;
    }

    return translatedValue as T;
}

/**
 * Returns a Post with English fields merged in when locale = 'en'.
 * Falls back to Spanish (original) values if English translation is missing.
 */
export function localizePost(post: Post, locale: Locale): Post {
    if (locale !== 'en') return post;
    return {
        ...post,
        title: mergeLocalizedValue(post.title, post.title_en),
        excerpt: mergeLocalizedValue(post.excerpt, post.excerpt_en),
        content: mergeLocalizedValue(post.content, post.content_en),
        category: mergeLocalizedValue(post.category, post.category_en),
        read_time: mergeLocalizedValue(post.read_time, post.read_time_en),
    };
}

/**
 * Returns a Project with English fields merged in when locale = 'en'.
 * Falls back to Spanish (original) values if English translation is missing.
 */
export function localizeProject(project: Project, locale: Locale): Project {
    if (locale !== 'en') return project;
    return {
        ...project,
        title: mergeLocalizedValue(project.title, project.title_en),
        excerpt: mergeLocalizedValue(project.excerpt, project.excerpt_en),
        content: mergeLocalizedValue(project.content, project.content_en),
        category: mergeLocalizedValue(project.category, project.category_en),
        services: mergeLocalizedValue(project.services, project.services_en),
        client: mergeLocalizedValue(project.client, project.client_en),
        duration: mergeLocalizedValue(project.duration, project.duration_en),
    };
}

// Posts
export async function getPosts(published = true, options: ContentQueryOptions = {}): Promise<Post[]> {
    try {
        const supabase = await createClient();
        const selectClause: string = options.lightweight ? POST_LIST_SELECT : '*';

        const query = supabase
            .from('posts')
            .select(selectClause)
            .order('published_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error('[getPosts] Supabase error:', error.message);
            return [];
        }

        const posts = ((data ?? []) as unknown) as Post[];
        if (!published) return posts;
        return posts.filter((post) => isLiveNow(post));
    } catch (err) {
        console.error('[getPosts] Unexpected error:', err);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('[getPostBySlug] Supabase error:', error.message);
            return null;
        }
        return data as Post;
    } catch (err) {
        console.error('[getPostBySlug] Unexpected error:', err);
        return null;
    }
}

export async function incrementPostViews(slug: string) {
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('views')
        .eq('slug', slug)
        .single();

    if (post) {
        await supabase
            .from('posts')
            .update({ views: post.views + 1 })
            .eq('slug', slug);
    }
}

// Projects
export async function getProjects(
    published = true,
    featured?: boolean,
    options: ContentQueryOptions = {}
): Promise<Project[]> {
    try {
        const supabase = await createClient();
        const selectClause: string = options.lightweight ? PROJECT_LIST_SELECT : '*';

        let query = supabase
            .from('projects')
            .select(selectClause)
            .order('published_at', { ascending: false });

        if (featured !== undefined) {
            query = query.eq('featured', featured);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[getProjects] Supabase error:', error.message);
            return [];
        }

        const projects = ((data ?? []) as unknown) as Project[];
        if (!published) return projects;
        return projects.filter((project) => isLiveNow(project));
    } catch (err) {
        console.error('[getProjects] Unexpected error:', err);
        return [];
    }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('[getProjectBySlug] Supabase error:', error.message);
            return null;
        }
        return data as Project;
    } catch (err) {
        console.error('[getProjectBySlug] Unexpected error:', err);
        return null;
    }
}
