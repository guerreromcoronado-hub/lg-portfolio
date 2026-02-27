'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('¡Bienvenida!');
            router.push('/dashboard');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" />
            <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
                {/* Ambient background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
              radial-gradient(ellipse 60% 70% at 70% 30%, rgba(245,197,24,0.2) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 20% 70%, rgba(255,107,53,0.15) 0%, transparent 55%)
            `
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,17,17,0.12)] border border-text/[0.06] p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-orange mb-2">
                                Laura Guerrero
                            </h1>
                            <p className="text-sm text-muted">
                                Panel de Administración
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-bold tracking-[0.1em] uppercase text-subtle mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-yellow transition-colors"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-bold tracking-[0.1em] uppercase text-subtle mb-2"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm text-text outline-none focus:border-yellow transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow text-text px-6 py-3 rounded-full font-bold text-sm tracking-[0.03em] hover:bg-[#e0b510] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-text/[0.06]">
                            <p className="text-xs text-center text-subtle">
                                Acceso exclusivo para administradores
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <Link
                            href="/"
                            className="text-sm text-muted hover:text-orange transition-colors inline-flex items-center gap-2"
                        >
                            ← Volver al sitio
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
