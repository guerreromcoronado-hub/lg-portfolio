import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';
import { getPosts, getProjects, localizePost, localizeProject } from '@/lib/api/content';
import { getLocale } from '@/lib/i18n/server';

export default async function Home() {
    const locale = await getLocale();

    // Fetch published posts and featured projects
    const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

    // Localize content based on current language
    const publishedPosts = posts
        .filter((p) => p.published)
        .slice(0, 3)
        .map((p) => localizePost(p, locale));

    const featuredProjects = projects
        .filter((p) => p.published && p.featured)
        .map((p) => localizeProject(p, locale));

    return (
        <>
            <Navigation />
            <main>
                <Hero />
                <About />
                <Services />
                <Portfolio projects={featuredProjects} />
                <Blog posts={publishedPosts} />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

