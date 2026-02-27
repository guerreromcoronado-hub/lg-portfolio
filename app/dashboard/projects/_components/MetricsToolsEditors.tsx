'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { MetricRow, ToolRow } from './projectSectionTypes';

// ─── Shared form types ────────────────────────────────────────────────────────
// Exported so pages can import them from here.

export interface MetricsForm { rows: MetricRow[] }
export interface ToolsForm { rows: ToolRow[] }

// ─── MetricsEditor ────────────────────────────────────────────────────────────

interface MetricsEditorProps {
    form: UseFormReturn<MetricsForm>;
}

export function MetricsEditor({ form }: MetricsEditorProps) {
    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'rows' });

    return (
        <div className="bg-white rounded-xl border border-text/[0.06] p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-bold text-text">Métricas Clave</h2>
                    <p className="text-xs text-subtle">Los números que demuestran el impacto</p>
                </div>
                <button type="button" onClick={() => append({ label: '', value: '' })}
                    className="text-xs text-orange hover:underline font-semibold">+ Agregar</button>
            </div>
            <div className="space-y-2">
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2 items-center">
                        <input {...form.register(`rows.${idx}.label`)} placeholder="Label (ej: Conversiones)"
                            className="flex-1 bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors" />
                        <input {...form.register(`rows.${idx}.value`)} placeholder="Valor (ej: +45%)"
                            className="flex-1 bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors" />
                        {fields.length > 1 && (
                            <button type="button" onClick={() => remove(idx)}
                                className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg text-sm font-bold flex-shrink-0">×</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── ToolsEditor ──────────────────────────────────────────────────────────────

interface ToolsEditorProps {
    form: UseFormReturn<ToolsForm>;
}

export function ToolsEditor({ form }: ToolsEditorProps) {
    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'rows' });

    return (
        <div className="bg-white rounded-xl border border-text/[0.06] p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-bold text-text">Herramientas Utilizadas</h2>
                    <p className="text-xs text-subtle">Stack, plataformas y software</p>
                </div>
                <button type="button" onClick={() => append({ tool: '' })}
                    className="text-xs text-orange hover:underline font-semibold">+ Agregar</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                        <input {...form.register(`rows.${idx}.tool`)} placeholder="Herramienta..."
                            className="flex-1 bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors" />
                        {fields.length > 1 && (
                            <button type="button" onClick={() => remove(idx)}
                                className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg text-sm font-bold">×</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
