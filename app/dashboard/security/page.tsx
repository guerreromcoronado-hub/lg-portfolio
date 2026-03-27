'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function SecurityPage() {
    const supabase = createClient();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setSaving(true);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            toast.error(error.message || 'No se pudo actualizar la contraseña');
        } else {
            toast.success('Contraseña actualizada correctamente');
            setNewPassword('');
            setConfirmPassword('');
        }

        setSaving(false);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Seguridad</h1>
                <p className="text-muted">Actualiza tu contraseña de acceso al panel</p>
            </div>

            <div className="max-w-2xl bg-white rounded-xl border border-text/[0.06] p-6">
                <h2 className="text-lg font-bold text-text mb-1">Cambiar contraseña</h2>
                <p className="text-sm text-subtle mb-6">Usa una contraseña segura para proteger tu cuenta.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">
                            Nueva contraseña
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow transition-colors"
                            placeholder="Mínimo 8 caracteres"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.1em] text-subtle mb-1">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow transition-colors"
                            placeholder="Repite la contraseña"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-text text-white hover:bg-text/85 transition-colors disabled:opacity-60"
                        >
                            {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
