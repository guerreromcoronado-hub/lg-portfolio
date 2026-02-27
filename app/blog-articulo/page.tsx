'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import BlogNavigation from '@/components/BlogNavigation';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ProgressBar';
import { IconUser, IconMail, IconSearch, IconShoppingBag, IconChart } from '@/components/icons';

const errors = [
    {
        num: '01',
        title: 'Usar asuntos genéricos o demasiado "vendedores"',
        description: 'Asuntos como "¡Oferta especial solo para ti!" ya no engañan a nadie. Los lectores los identifican como spam antes de abrir.',
        fix: '✓ Sé específico y curioso. "El email que envié un martes a las 10am y generó 3x más ventas" funciona mejor que cualquier promesa genérica.'
    },
    {
        num: '02',
        title: 'Ignorar el preheader (el texto debajo del asunto)',
        description: 'El preheader es tu segundo asunto. En móvil, esos 40-90 caracteres deciden si alguien abre o no. La mayoría de marcas lo dejan en blanco.',
        fix: '✓ Trata el preheader como continuación del asunto. Si el asunto hace una pregunta, el preheader puede ser la promesa de respuesta.'
    },
    {
        num: '03',
        title: 'Enviar a toda la lista sin segmentar',
        description: 'Un suscriptor de hace dos años y uno de ayer no tienen el mismo interés. Enviarles el mismo email a todos daña tu reputación de remitente.',
        fix: '✓ Segmenta al menos por fecha de última interacción. Los activos de los últimos 90 días merecen una cadencia diferente.'
    },
    {
        num: '04',
        title: 'No hacer A/B testing en el asunto',
        description: 'Klaviyo, Mailchimp y ActiveCampaign permiten testear dos versiones de asunto y enviar el ganador automáticamente. Casi nadie lo usa.',
        fix: '✓ Para cada envío importante, testea una versión directa vs. una con curiosidad. Deja que los datos decidan, no tu instinto.'
    },
    {
        num: '05',
        title: 'Enviar siempre el mismo día y hora sin analizar',
        description: 'No existe un horario universalmente perfecto. Depende de tu audiencia y su rutina. Enviar los martes a las 10am porque "lo leíste en un blog" no es estrategia.',
        fix: '✓ Revisa en tu plataforma a qué hora se abren más tus emails. Ese dato ya existe en tus reportes. Úsalo.'
    }
];

const tocLinks = [
    { num: '01', text: 'Asuntos genéricos' },
    { num: '02', text: 'El preheader ignorado' },
    { num: '03', text: 'Listas sin segmentar' },
    { num: '04', text: 'Sin A/B testing' },
    { num: '05', text: 'Horarios fijos sin datos' }
];

const moreArticles = [
    { icon: <IconSearch size={18} />, category: '[SEO]', title: 'Guía de SEO para pequeños negocios que no tienen tiempo', gradient: 'radial-gradient(ellipse, rgba(245,197,24,0.3) 0%, #F0EBE0 70%)' },
    { icon: <IconShoppingBag size={18} />, category: '[E-commerce]', title: 'Cómo escribir fichas de producto que realmente venden', gradient: 'radial-gradient(ellipse, rgba(245,160,32,0.25) 0%, #FAF7F0 70%)' },
    { icon: <IconChart size={18} />, category: '[Email Marketing]', title: 'Las 3 métricas de email que realmente importan', gradient: 'radial-gradient(ellipse, rgba(232,114,74,0.2) 0%, #F0EBE0 70%)' }
];

export default function BlogArticle() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <>
            <ProgressBar />
            <BlogNavigation backLink="/" />

            {/* Hero */}
            <div className="pt-36 pb-20 px-20 max-w-[800px] mx-auto text-center relative">
                {/* Ambient background */}
                <div
                    className="fixed top-0 left-0 right-0 h-screen z-[-1] pointer-events-none"
                    style={{
                        background: `
              radial-gradient(ellipse 60% 50% at 70% 30%, rgba(245,197,24,0.12) 0%, transparent 65%),
              radial-gradient(ellipse 40% 40% at 20% 70%, rgba(245,160,32,0.08) 0%, transparent 60%)
            `
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block border-[1.5px] border-orange/30 text-orange text-[0.7rem] px-4 py-[0.3rem] rounded-full font-bold tracking-[0.1em] mb-7">
                        [Email Marketing]
                    </div>
                    <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-text leading-[1.12] mb-[1.4rem]">
                        5 errores que <em className="italic font-light text-orange">arruinan</em> tu tasa de apertura (y cómo corregirlos)
                    </h1>
                    <p className="text-base leading-[1.8] text-muted max-w-[540px] mx-auto mb-10 font-normal">
                        Una campaña bien escrita empieza mucho antes de hacer clic en &ldquo;enviar&rdquo;. Si tu open rate no mejora, probablemente estás cometiendo uno de estos errores.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-[0.78rem] text-subtle font-medium">
                        <div className="w-[34px] h-[34px] rounded-full bg-beige border-2 border-orange/15 flex items-center justify-center text-muted">
                            <IconUser size={16} strokeWidth={1.6} />
                        </div>
                        <span>Laura Guerrero</span>
                        <span className="opacity-35">·</span>
                        <span>7 min de lectura</span>
                        <span className="opacity-35">·</span>
                        <span>Febrero 2025</span>
                    </div>
                </motion.div>
            </div>

            {/* Cover */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-20 h-[340px] rounded-[18px] overflow-hidden relative flex items-center justify-center mb-20"
                style={{
                    background: `
            radial-gradient(ellipse at 30% 55%, rgba(245,197,24,0.4) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 25%, rgba(245,160,32,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(232,114,74,0.2) 0%, transparent 45%),
            #F0EBE0
          `
                }}
            >
                <div className="bg-white rounded-[14px] p-7 w-[320px] shadow-[0_20px_50px_rgba(17,17,17,0.12)] border border-text/[0.06]">
                    <div className="flex items-center gap-[0.8rem] pb-4 border-b border-text/[0.06] mb-4">
                        <div className="w-[34px] h-[34px] rounded-lg bg-orange flex items-center justify-center text-white">
                            <IconMail size={16} strokeWidth={1.8} />
                        </div>
                        <div>
                            <div className="text-[0.78rem] font-bold text-text">Tu Newsletter</div>
                            <div className="text-[0.68rem] text-muted mt-[0.1rem]">Asunto: ¡Oferta especial para ti!</div>
                        </div>
                    </div>
                    <div className="h-[6px] rounded-[3px] bg-text/[0.07] mb-2 w-full" />
                    <div className="h-[6px] rounded-[3px] bg-text/[0.07] mb-2 w-3/4" />
                    <div className="h-[6px] rounded-[3px] bg-text/[0.07] mb-2 w-full" />
                    <div className="h-[6px] rounded-[3px] bg-text/[0.07] mb-2 w-1/2" />
                    <div className="h-[6px] rounded-[3px] bg-orange/[0.12] mb-2 w-[38%]" />
                    <div className="flex gap-2 mt-4">
                        <div className="bg-cream rounded-full px-3 py-[0.28rem] text-[0.63rem] font-bold text-muted">
                            Open rate: 8%
                        </div>
                        <div className="bg-yellow-light border border-orange/15 rounded-full px-3 py-[0.28rem] text-[0.63rem] font-bold text-orange">
                            ↑ puede ser 32%
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Article layout */}
            <div ref={ref} className="grid grid-cols-[1fr_255px] gap-20 px-20 max-w-[1180px] mx-auto pb-20">
                {/* Article body */}
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="article-body"
                >
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-[1.4rem]">
                        El email marketing tiene el ROI más alto de cualquier canal digital. Pero ese promedio esconde una realidad: la mayoría de campañas ni siquiera son abiertas.
                    </p>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-[1.4rem]">
                        Si tu tasa de apertura está por debajo del 20%, algo está fallando antes de que el lector vea el contenido. Aquí van los 5 errores más comunes que veo en mis clientes, y exactamente cómo corregirlos.
                    </p>

                    <div className="border-l-[3px] border-yellow pl-7 py-[0.8rem] my-10">
                        <p className="text-[1.08rem] leading-[1.5] font-semibold text-orange italic m-0">
                            El open rate no se gana en el cuerpo del email. Se gana en el asunto y en la bandeja de entrada.
                        </p>
                    </div>

                    <h2 className="text-[1.35rem] font-bold text-text mt-11 mb-4 leading-[1.25]">
                        Los 5 errores (y sus soluciones)
                    </h2>

                    <div className="flex flex-col gap-5 my-6">
                        {errors.map((error, index) => (
                            <motion.div
                                key={error.num}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className="grid grid-cols-[42px_1fr] gap-5 bg-cream rounded-xl p-[1.4rem] border border-text/[0.06] hover:border-orange/20 transition-colors"
                            >
                                <div className="w-[38px] h-[38px] rounded-full bg-orange text-white flex items-center justify-center text-[0.78rem] font-bold flex-shrink-0">
                                    {error.num}
                                </div>
                                <div>
                                    <h3 className="text-[0.93rem] font-bold text-text mb-2">
                                        {error.title}
                                    </h3>
                                    <p className="text-muted text-[0.87rem] leading-[1.7] mb-0">
                                        {error.description}
                                    </p>
                                    <div className="bg-yellow-light border-l-[3px] border-yellow rounded-r-lg px-4 py-[0.65rem] mt-[0.8rem] text-[0.78rem] font-semibold text-text leading-[1.55]">
                                        {error.fix}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <h2 className="text-[1.35rem] font-bold text-text mt-11 mb-4 leading-[1.25]">
                        ¿Y si ya estoy haciendo todo esto?
                    </h2>
                    <p className="text-[0.97rem] leading-[1.9] text-text mb-[1.4rem]">
                        El problema puede estar en la reputación del dominio remitente. Si has enviado a listas sin limpiar, los proveedores te penalizan de manera invisible: tus emails llegan a promociones o al spam sin que lo sepas.
                    </p>

                    <div className="bg-cream border-l-[3px] border-orange rounded-r-xl p-[1.6rem] my-10">
                        <h4 className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-orange mb-[0.7rem]">
                            ↗ Diagnóstico rápido
                        </h4>
                        <p className="text-[0.92rem] text-text leading-[1.7] m-0 font-medium">
                            Usa Mail-Tester.com o Google Postmaster Tools para revisar la reputación de tu dominio. Si tu puntuación está por debajo de 7/10, necesitas un plan de warming antes de cualquier otra optimización.
                        </p>
                    </div>

                    <p className="text-[0.97rem] leading-[1.9] text-text mb-[1.4rem]">
                        El email marketing no está muerto. Está mal ejecutado. Con ajustes simples y consistencia, es posible llevar una tasa de apertura del 9% al 35%+ en pocas semanas.
                    </p>
                </motion.article>

                {/* Sidebar */}
                <aside className="sticky top-[5.5rem] flex flex-col gap-5 self-start">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-[14px] p-6 border-[1.5px] border-yellow"
                    >
                        <h4 className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-subtle mb-[1.1rem]">
                            En este artículo
                        </h4>
                        {tocLinks.map((link) => (
                            <a
                                key={link.num}
                                href="#"
                                className="flex gap-[0.8rem] py-2 border-b border-text/[0.05] last:border-b-0 no-underline hover:gap-[1.1rem] transition-all group"
                            >
                                <span className="text-[0.63rem] font-bold text-subtle min-w-[16px] pt-[1px]">
                                    {link.num}
                                </span>
                                <span className="text-[0.8rem] font-medium text-muted group-hover:text-orange transition-colors leading-[1.35]">
                                    {link.text}
                                </span>
                            </a>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-orange rounded-[14px] p-7 relative overflow-hidden"
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
                            ¿Quieres revisar tu estrategia de email? Encontremos juntas qué está frenando tus resultados.
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

            {/* More articles */}
            <section className="px-20 py-20 bg-cream border-t border-text/[0.07]">
                <h3 className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-subtle mb-10 flex items-center gap-2">
                    <span className="block w-5 h-[2px] bg-yellow" />
                    Seguir leyendo
                </h3>
                <div className="grid grid-cols-3 gap-6">
                    {moreArticles.map((article) => (
                        <Link
                            key={article.title}
                            href="/blog-articulo"
                            className="bg-white rounded-[14px] overflow-hidden no-underline block border border-text/[0.07] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(17,17,17,0.08)] transition-all"
                        >
                            <div
                                className="h-[130px] flex items-center justify-center"
                                style={{ background: article.gradient }}
                            >
                                <span className="text-orange/50">{article.icon}</span>
                            </div>
                            <div className="p-5">
                                <div className="text-[0.63rem] font-bold tracking-[0.1em] text-orange mb-[0.4rem] opacity-75">
                                    {article.category}
                                </div>
                                <h4 className="text-[0.88rem] font-bold text-text leading-[1.4]">
                                    {article.title}
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
