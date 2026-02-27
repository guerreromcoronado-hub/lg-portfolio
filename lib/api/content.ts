import { createClient } from '@/lib/supabase/server';
import { Post, Project } from '@/lib/types/database';
import { type Locale } from '@/lib/i18n/dictionaries';

// ── Localization helpers ────────────────────────────────────────────────────

/**
 * Returns a Post with English fields merged in when locale = 'en'.
 * Falls back to Spanish (original) values if English translation is missing.
 */
export function localizePost(post: Post, locale: Locale): Post {
    if (locale !== 'en') return post;
    return {
        ...post,
        title: post.title_en || post.title,
        excerpt: post.excerpt_en || post.excerpt,
        content: post.content_en || post.content,
        category: post.category_en || post.category,
        read_time: post.read_time_en || post.read_time,
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
        title: project.title_en || project.title,
        excerpt: project.excerpt_en || project.excerpt,
        content: project.content_en || project.content,
        category: project.category_en || project.category,
        services: project.services_en || project.services,
        client: project.client_en || project.client,
        duration: project.duration_en || project.duration,
    };
}

// Posts
export async function getPosts(published = true): Promise<Post[]> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from('posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (published) {
            query = query.eq('published', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[getPosts] Supabase error:', error.message);
            return [];
        }
        return (data ?? []) as Post[];
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
export async function getProjects(published = true, featured?: boolean): Promise<Project[]> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from('projects')
            .select('*')
            .order('published_at', { ascending: false });

        if (published) {
            query = query.eq('published', true);
        }

        if (featured !== undefined) {
            query = query.eq('featured', featured);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[getProjects] Supabase error:', error.message);
            return [];
        }
        return (data ?? []) as Project[];
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
