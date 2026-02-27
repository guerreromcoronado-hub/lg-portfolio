'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import BlogNavigation from '@/components/BlogNavigation';
import Footer from '@/components/Footer';
import { IconSearch, IconShoppingBag } from '@/components/icons';

const steps = [
    {
        num: '01',
        title: 'Auditoría y limpieza de lista',
        description: 'Identifiqué contactos inactivos, eliminé bounces y segmenté por comportamiento. La lista pasó de 12.000 a 9.800 contactos útiles.'
    },
    {
        num: '02',
        title: 'Secuencia de reactivación en 3 pasos',
        description: 'Email de sorpresa, email de valor con contenido útil, y email de oferta exclusiva con urgencia real.'
    },
    {
        num: '03',
        title: 'Copywriting orientado a la persona',
        description: 'Cada email fue escrito sin vender desde el primer mensaje, generando curiosidad y reconexión emocional.'
    },
    {
        num: '04',
        title: 'A/B testing en subject lines',
        description: 'Testeé dos versiones de asunto por envío. Los datos de las primeras horas guiaron el envío al resto de la lista.'
    }
];

const tools = ['Klaviyo', 'Notion', 'Figma', 'Google Sheets', 'Hotjar'];
const metrics = [
    { label: 'Open rate inicial', value: '9%' },
    { label: 'Open rate final', value: '41%' },
    { label: 'CTR promedio', value: '+18%' },
    { label: 'ROI campaña', value: '4.2x' },
    { label: 'Duración', value: '6 semanas' }
];

const moreProjects = [
    {
        icon: <IconSearch size={20} />,
        category: '[SEO]',
        title: 'Estrategia SEO para e-commerce — +60% tráfico orgánico en 4 meses',
        gradient: 'radial-gradient(ellipse, rgba(245,197,24,0.35) 0%, #F0EBE0 70%)'
    },
    {
        icon: <IconShoppingBag size={20} />,
        category: '[E-commerce Growth]',
        title: 'Optimización de fichas de producto — tasa de conversión x2.3',
        gradient: 'radial-gradient(ellipse, rgba(245,160,32,0.3) 0%, #FAF7F0 70%)'
    }
];

export default function CaseStudy() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <>
            <BlogNavigation backLink="/" />

            {/* Hero */}
            <div className="pt-36 pb-24 px-20 bg-cream relative overflow-hidden">
                {/* Ambient background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
              radial-gradient(ellipse 50% 80% at 85% 30%, rgba(245,197,24,0.22) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 15% 75%, rgba(245,160,32,0.14) 0%, transparent 55%)
            `
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-[0.6rem] text-[0.68rem] text-subtle font-semibold tracking-[0.07em] uppercase mb-8">
                        <span>Proyectos</span>
                        <span className="opacity-40">/</span>
                        <span>Email Marketing</span>
                        <span className="opacity-40">/</span>
                        <span>Reactivación de lista</span>
                    </div>

                    <div className="inline-block border-[1.5px] border-orange/30 text-orange text-[0.7rem] px-4 py-[0.3rem] rounded-full font-bold tracking-[0.1em] mb-6">
                        [Email Marketing]
                    </div>

                    <h1 className="text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold text-text leading-[1.1] max-w-[680px] mb-6">
                        Reactivamos una lista <em className="italic font-light text-orange">dormida</em> y generamos un +32% de open rate
                    </h1>

                    <div className="flex gap-12 mt-12 pt-12 border-t border-text/[0.08]">
                        {[
                            { label: 'Cliente', value: 'Tienda de moda online' },
                            { label: 'Servicios', value: 'Email Marketing · Copywriting' },
                            { label: 'Duración', value: '6 semanas' },
                            { label: 'Año', value: '2024' }
                        ].map((item) => (
                            <div key={item.label}>
                                <label className="text-[0.63rem] tracking-[0.14em] uppercase text-subtle font-bold block mb-[0.35rem]">
                                    {item.label}
                                </label>
                                <p className="text-[0.88rem] font-semibold text-text">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Cover */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-20 h-[400px] rounded-[18px] overflow-hidden relative flex items-center justify-center -mt-12"
                style={{
                    background: `
            radial-gradient(ellipse at 28% 55%, rgba(245,197,24,0.45) 0%, transparent 55%),
            radial-gradient(ellipse at 72% 25%, rgba(245,160,32,0.35) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 75%, rgba(232,114,74,0.25) 0%, transparent 45%),
            #F0EBE0
          `
                }}
            >
                <div className="bg-white rounded-[14px] p-8 px-9 w-[370px] shadow-[0_24px_56px_rgba(17,17,17,0.14)] border border-text/[0.07]">
                    <div className="flex gap-[0.4rem] mb-5">
                        {[1, 2, 3].map((dot) => (
                            <div key={dot} className="w-[9px] h-[9px] rounded-full bg-text/10" />
                        ))}
                    </div>

                    <div className="h-[7px] rounded w-[38%] bg-orange/[0.15] mb-[0.55rem]" />
                    <div className="h-[7px] rounded w-full bg-text/[0.07] mb-[0.55rem]" />
                    <div className="h-[7px] rounded w-[80%] bg-text/[0.07] mb-[0.55rem]" />
                    <div className="h-[7px] rounded w-[58%] bg-text/[0.07] mb-[0.55rem]" />
                    <div className="h-[7px] rounded w-full bg-text/[0.07] mb-0" />

                    <div className="flex gap-[0.8rem] mt-[1.4rem]">
                        {[
                            { num: '+32%', label: 'Open Rate' },
                            { num: '+18%', label: 'CTR' },
                            { num: '4.2x', label: 'ROI' }
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex-1 bg-cream rounded-[10px] p-[0.9rem] text-center border border-text/[0.06]"
                            >
                                <div className="text-[1.3rem] font-bold text-orange leading-none">
                                    {stat.num}
                                </div>
                                <div className="text-[0.58rem] text-subtle font-bold tracking-[0.06em] uppercase mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div ref={ref} className="grid grid-cols-[1fr_270px] gap-20 px-20 py-24 items-start">
                {/* Article body */}
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-[1.35rem] font-bold text-text mb-4">
                        El contexto
                    </h2>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-5">
                        El cliente tenía una lista de más de 12.000 suscriptores que no recibían comunicaciones hace más de ocho meses. La tasa de apertura promedio había caído al 9% y el negocio estaba perdiendo una oportunidad enorme de monetizar esa audiencia ya captada.
                    </p>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-5">
                        El reto era claro: ¿cómo volvemos a ganar la atención de personas que ya nos olvidaron, sin quemarlos ni hacer spam?
                    </p>

                    <div className="border-l-[3px] border-yellow pl-7 py-[0.8rem] my-10">
                        <p className="text-[1.08rem] leading-[1.5] font-semibold text-orange italic m-0">
                            "Teníamos 12.000 contactos y no sabíamos qué hacer con ellos. Laura nos ayudó a convertirlos en clientes reales."
                        </p>
                    </div>

                    <h2 className="text-[1.35rem] font-bold text-text mt-11 mb-4">
                        El proceso
                    </h2>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-6">
                        Antes de escribir un solo email, hice un diagnóstico completo de la lista: segmenté por fecha de último engagement, historial de compra y fuente de captación.
                    </p>

                    <div className="flex flex-col gap-[1.1rem] my-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className="flex gap-5 bg-cream rounded-xl p-[1.4rem] border border-text/[0.06] hover:border-orange/20 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">
                                    {step.num}
                                </div>
                                <div>
                                    <h4 className="text-[0.92rem] font-bold text-text mb-[0.4rem]">
                                        {step.title}
                                    </h4>
                                    <p className="text-[0.86rem] text-muted leading-[1.7] m-0">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <h2 className="text-[1.35rem] font-bold text-text mt-11 mb-4">
                        Los resultados
                    </h2>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-6">
                        El open rate pasó del 9% al 41% en el segmento reactivado. El 23% de los contactos que respondieron a la secuencia hicieron una compra en los 30 días siguientes.
                    </p>

                    <div className="bg-text rounded-2xl overflow-hidden relative my-10">
                        <div
                            className="absolute -top-10 -left-10 w-[180px] h-[180px] rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)',
                                filter: 'blur(20px)'
                            }}
                        />
                        <div
                            className="absolute -bottom-10 -right-10 w-[160px] h-[160px] rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)',
                                filter: 'blur(20px)'
                            }}
                        />

                        <div className="px-7 pt-7 pb-0 relative z-10">
                            <div className="text-[0.66rem] font-bold tracking-[0.18em] uppercase text-orange flex items-center gap-2 mb-0">
                                <span className="block w-4 h-[2px] bg-yellow" />
                                Resultados finales
                            </div>
                        </div>

                        <div className="grid grid-cols-3 relative z-10">
                            {[
                                { num: '+32%', label: 'Aumento en open rate general' },
                                { num: '4.2x', label: 'ROI sobre la inversión en la campaña' },
                                { num: '23%', label: 'Tasa de conversión a compra' }
                            ].map((result, index) => (
                                <div
                                    key={result.label}
                                    className={`text-center p-6 ${index > 0 ? 'border-l border-white/[0.07]' : ''}`}
                                >
                                    <span className="text-[2.8rem] font-bold text-yellow leading-none block">
                                        {result.num}
                                    </span>
                                    <div className="text-[0.73rem] text-white/50 mt-2 leading-[1.4]">
                                        {result.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-[1.35rem] font-bold text-text mt-11 mb-4">
                        Lo que aprendí
                    </h2>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-5">
                        Una lista fría no es una lista muerta. La clave estuvo en reconocer la pausa y volver con algo de valor real. El copywriting honesto y cercano funcionó mucho mejor que cualquier descuento agresivo.
                    </p>
                </motion.article>

                {/* Sidebar */}
                <aside className="sticky top-[5.5rem] flex flex-col gap-5">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-[14px] p-6 border border-text/[0.08]"
                    >
                        <h4 className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-subtle mb-5">
                            Herramientas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="inline-block border-[1.5px] border-text/[0.12] text-muted text-[0.72rem] px-[0.8rem] py-[0.28rem] rounded-full font-semibold hover:border-orange hover:text-orange transition-all"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-[14px] p-6 border border-text/[0.08]"
                    >
                        <h4 className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-subtle mb-5">
                            Métricas clave
                        </h4>
                        {metrics.map((metric, index) => (
                            <div
                                key={metric.label}
                                className={`flex justify-between items-center py-[0.6rem] text-[0.82rem] ${index < metrics.length - 1 ? 'border-b border-text/[0.06]' : ''
                                    }`}
                            >
                                <span className="text-muted">{metric.label}</span>
                                <span className="font-bold text-text">{metric.value}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-orange rounded-[14px] p-6 text-center relative overflow-hidden"
                    >
                        <div
                            className="absolute -top-[30px] -right-[30px] w-[130px] h-[130px] rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(245,197,24,0.7) 0%, transparent 70%)',
                                filter: 'blur(16px)'
                            }}
                        />
                        <div
                            className="absolute -bottom-[30px] -left-[20px] w-[100px] h-[100px] rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(245,197,24,0.45) 0%, transparent 70%)',
                                filter: 'blur(14px)'
                            }}
                        />
                        <p className="text-[0.86rem] leading-[1.65] text-white font-medium mb-[1.1rem] relative z-10">
                            ¿Tienes una lista dormida? Puedo ayudarte a reactivarla.
                        </p>
                        <a
                            href="#"
                            className="block bg-text text-white no-underline px-4 py-[0.78rem] rounded-full text-[0.8rem] font-bold text-center tracking-[0.04em] hover:bg-[#333] transition-colors relative z-10"
                        >
                            ↘ Hablemos
                        </a>
                    </motion.div>
                </aside>
            </div>

            {/* More projects */}
            <section className="px-20 py-20 bg-cream border-t border-text/[0.07]">
                <h3 className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-subtle mb-10 flex items-center gap-2">
                    <span className="block w-5 h-[2px] bg-yellow" />
                    Más proyectos
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    {moreProjects.map((project) => (
                        <Link
                            key={project.title}
                            href="/caso-de-estudio"
                            className="bg-white rounded-[14px] overflow-hidden no-underline block border border-text/[0.07] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(17,17,17,0.08)] transition-all"
                        >
                            <div
                                className="h-[160px] flex items-center justify-center"
                                style={{ background: project.gradient }}
                            >
                                <span className="text-orange/50">{project.icon}</span>
                            </div>
                            <div className="p-[1.4rem]">
                                <div className="text-[0.65rem] font-bold tracking-[0.1em] text-orange mb-[0.4rem] opacity-75">
                                    {project.category}
                                </div>
                                <h4 className="text-[0.95rem] font-bold text-text leading-[1.35]">
                                    {project.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </>
    );
}
