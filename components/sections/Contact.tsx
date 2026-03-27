'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { IconLinkedIn, IconMail } from '@/components/icons';

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const { dict } = useLanguage();
    const d = dict.contact;

    const fallbackInbox = '29guerrero06@gmail.com';

    const openMailClientWithFormData = () => {
        const subject = `Nuevo mensaje web de ${formData.name.trim() || 'Contacto'}`;
        const body = [
            `Nombre: ${formData.name}`,
            `Email: ${formData.email}`,
            '',
            'Mensaje:',
            formData.message,
        ].join('\n');

        const mailto = `mailto:${fallbackInbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { error?: string } | null;
                const errorMessage = data?.error || 'No se pudo enviar el mensaje';

                // Free fallback: if server email delivery is not configured,
                // open the user's mail client with the message prefilled.
                if (errorMessage.toLowerCase().includes('no está configurado')) {
                    openMailClientWithFormData();
                    setFeedback({
                        type: 'success',
                        message: 'Se abrió tu cliente de correo con el mensaje prellenado.',
                    });
                    return;
                }

                throw new Error(errorMessage);
            }

            setFeedback({ type: 'success', message: 'Mensaje enviado correctamente. Te responderé por correo pronto.' });
            setFormData({ name: '', email: '', message: '' });
        } catch (err: unknown) {
            setFeedback({
                type: 'error',
                message: err instanceof Error ? err.message : 'No se pudo enviar el mensaje. Intenta de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" ref={ref} className="relative overflow-hidden px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-[#f8f6f1]">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-yellow/10 blur-3xl" />
                <div className="absolute right-[-6rem] top-1/3 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(180deg,rgba(248,246,241,0),rgba(232,227,214,0.65))]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-28 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-yellow flex items-center gap-2">
                        <span className="block w-6 h-[2px] bg-yellow" />
                        {d.label}
                    </span>
                    <h2 className="text-[clamp(2rem,5vw,2.8rem)] font-bold leading-[1.12] text-text mt-4 mb-6">
                        {d.heading1}<br /><em className="italic font-light text-orange">{d.heading2}</em>
                    </h2>
                    <p className="text-[0.97rem] leading-[1.75] text-muted mb-8">
                        {d.subtitle}
                    </p>
                    <div className="flex gap-[0.8rem] flex-wrap">
                        {[
                            {
                                icon: <IconLinkedIn size={14} />,
                                label: 'LinkedIn',
                                href: 'https://www.linkedin.com/in/laura-guerrero-coronado/',
                            },
                            {
                                icon: <IconMail size={14} />,
                                label: 'Email',
                                href: 'mailto:29guerrero06@gmail.com',
                            },
                        ].map((channel) => (
                            <a
                                key={channel.label}
                                href={channel.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-text no-underline px-5 py-[0.6rem] rounded-full border-[1.5px] border-text/15 hover:border-orange hover:text-orange transition-all"
                            >
                                {channel.icon} {channel.label}
                            </a>
                        ))}
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-[1.1rem]"
                >
                    <div className="flex flex-col gap-[0.35rem]">
                        <label className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-subtle">
                            {d.nameLabel}
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder={d.namePlaceholder}
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-white border-[1.5px] border-text/10 rounded-[10px] px-[1.1rem] py-[0.9rem] font-sans text-[0.92rem] text-text outline-none focus:border-yellow transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-[0.35rem]">
                        <label className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-subtle">
                            {d.emailLabel}
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder={d.emailPlaceholder}
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-white border-[1.5px] border-text/10 rounded-[10px] px-[1.1rem] py-[0.9rem] font-sans text-[0.92rem] text-text outline-none focus:border-yellow transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-[0.35rem]">
                        <label className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-subtle">
                            {d.messageLabel}
                        </label>
                        <textarea
                            name="message"
                            placeholder={d.messagePlaceholder}
                            value={formData.message}
                            onChange={handleChange}
                            className="bg-white border-[1.5px] border-text/10 rounded-[10px] px-[1.1rem] py-[0.9rem] font-sans text-[0.92rem] text-text outline-none focus:border-yellow transition-colors resize-none h-[110px]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-yellow text-text border-none px-10 py-4 rounded-full font-sans text-[0.9rem] font-bold cursor-pointer hover:bg-[#e0b510] hover:-translate-y-[2px] transition-all self-start tracking-[0.03em]"
                    >
                        {isSubmitting ? 'Enviando...' : d.submit}
                    </button>

                    {feedback && (
                        <p className={`text-sm ${feedback.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                            {feedback.message}
                        </p>
                    )}
                </motion.form>
            </div>
        </section>
    );
}

