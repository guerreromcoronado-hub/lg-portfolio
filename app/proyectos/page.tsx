import { getProjects, localizeProject } from '@/lib/api/content';
import { getServerDictionary } from '@/lib/i18n/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconTrendingUp } from '@/components/icons';

const getGradient = (index: number) => {
    const gradients = [
        'radial-gradient(ellipse at 35% 55%, rgba(245,197,24,0.4) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(245,160,32,0.3) 0%, transparent 50%), #F0EBE0',
        'radial-gradient(ellipse at 60% 50%, rgba(245,160,32,0.3) 0%, transparent 55%), radial-gradient(ellipse at 20% 30%, rgba(245,197,24,0.2) 0%, transparent 45%), #FAF7F0',
        'radial-gradient(ellipse at 40% 60%, rgba(232,114,74,0.25) 0%, transparent 55%), #F5F0E8',
    ];
    return gradients[index % gradients.length];
};

export const metadata = {
    title: 'Proyectos | Laura Guerrero',
    description: 'Casos de estudio de estrategia digital, email marketing y SEO.',
};

export default async function ProyectosPage() {
    const { locale, dict } = await getServerDictionary();
    const d = dict.projectsPage;
    const rawProjects = await getProjects();
    const projects = rawProjects.map((p) => localizeProject(p, locale));

    return (
        <>
            <Navigation />
            <main className="bg-white min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-20">
                {/* Header */}
                <div className="mb-14">
                    <Link href="/" className="text-[0.78rem] text-muted font-semibold hover:text-orange transition-colors">
                        {d.back}
                    </Link>
                    <div className="mt-6">
                        <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-yellow flex items-center gap-2">
                            <span className="block w-6 h-[2px] bg-yellow" />
                            {d.label}
                        </span>
                        <h1 className="text-[clamp(1.8rem,5vw,2.6rem)] font-bold text-text leading-[1.15] mt-4">
                            {d.heading} <em className="italic font-light text-orange">{d.highlight}</em>
                        </h1>
                        <p className="text-muted mt-4 text-[0.95rem] max-w-xl">
                            {d.subtitle}
                        </p>
                    </div>
                </div>

                {/* Projects grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-24 text-muted">
                        <div className="flex justify-center mb-4 opacity-30">
                            <IconTrendingUp size={56} strokeWidth={1.2} />
                        </div>
                        <p className="font-semibold">{d.empty}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project, index) => (
                            <Link
                                key={project.id}
                                href={`/proyectos/${project.slug}`}
                                className={`block rounded-2xl overflow-hidden relative cursor-pointer border border-text/[0.07] group hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(17,17,17,0.1)] transition-all${projects.length % 2 !== 0 && index === projects.length - 1 ? ' md:col-span-2' : ''}`}
                            >
                                {/* Visual */}
                                {project.cover_image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={project.cover_image}
                                        alt={project.title}
                                        className="w-full h-[300px] object-cover"
                                    />
                                ) : (
                                    <div
                                        className="h-[300px] flex items-center justify-center"
                                        style={{ background: getGradient(index) }}
                                    >
                                        <IconTrendingUp size={56} className="text-orange/35" strokeWidth={1.2} />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 px-8 py-8 text-white"
                                    style={{ background: 'linear-gradient(transparent, rgba(17,17,17,0.85))' }}
                                >
                                    <div className="text-[0.68rem] font-bold tracking-[0.1em] text-yellow mb-[0.4rem] uppercase">
                                        {project.category}
                                    </div>
                                    <div className="text-[1.1rem] font-bold leading-[1.3]">
                                        {project.title}
                                    </div>
                                    <div className="text-[0.78rem] font-semibold text-white/70 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {d.viewCaseStudy}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

