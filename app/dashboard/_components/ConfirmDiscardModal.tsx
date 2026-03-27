'use client';

type ConfirmDiscardModalProps = {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmDiscardModal({ isOpen, onCancel, onConfirm }: ConfirmDiscardModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Cerrar modal"
                onClick={onCancel}
                className="absolute inset-0 bg-text/40"
            />
            <div className="relative w-full max-w-md rounded-xl border border-text/[0.08] bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-text">¿Descartar cambios?</h3>
                <p className="mt-2 text-sm text-muted">
                    Se perderán los cambios no guardados. Esta acción no se puede deshacer.
                </p>
                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-text/[0.1] rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-bold bg-text text-white rounded-lg hover:bg-text/80 transition-colors"
                    >
                        Sí, descartar
                    </button>
                </div>
            </div>
        </div>
    );
}