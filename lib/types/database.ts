export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: PostContent;
    cover_image?: string;
    category: string;
    emoji: string;
    published: boolean;
    created_at: string;
    updated_at: string;
    published_at?: string;
    author_id?: string;
    views: number;
    read_time: string;
    // English translations (optional – fall back to Spanish if null)
    title_en?: string | null;
    excerpt_en?: string | null;
    content_en?: PostContent | null;
    category_en?: string | null;
    read_time_en?: string | null;
}

export interface PostContent {
    intro?: string;
    sections: PostSection[];
}

export interface PostSection {
    type: 'heading' | 'paragraph' | 'quote' | 'list' | 'highlight' | 'error-list';
    content?: string;
    title?: string;
    items?: Array<string | {
        number: string;
        title: string;
        description: string;
        fix: string;
    }>;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: ProjectContent;
    cover_image?: string;
    category: string;
    tags: string[];
    emoji: string;
    client?: string;
    services?: string;
    duration?: string;
    year?: string;
    tools: string[];
    metrics?: Record<string, string>;
    results?: ProjectResults;
    published: boolean;
    featured: boolean;
    created_at: string;
    updated_at: string;
    published_at?: string;
    author_id?: string;
    // English translations (optional – fall back to Spanish if null)
    title_en?: string | null;
    excerpt_en?: string | null;
    content_en?: ProjectContent | null;
    category_en?: string | null;
    services_en?: string | null;
    client_en?: string | null;
    duration_en?: string | null;
}

export interface ProjectContent {
    hero?: { description: string };
    context?: string;
    challenge?: string;
    solution?: Array<{
        step: string;
        title: string;
        description: string;
    }>;
    process?: ProcessStep[];
    learnings?: string;
    quote?: string;
}

export interface ProcessStep {
    num?: string;
    step?: string;
    title: string;
    description: string;
}

export interface ProjectResults {
    main: Array<{
        value: string;
        label: string;
    }>;
    summary?: string;
}

export interface ProjectResult {
    num: string;
    label: string;
}
