import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface AjusteManualModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegistrar: (ajuste: {
        tipo: "entrada" | "saida";
        descricao: string;
        valor: number;
        data: string;
        motivo: string;
    }) => void;
    isLoading?: boolean;
}

export default function AjusteManualModal({
    isOpen,
    onClose,
    onRegistrar,
    isLoading = false,
}: AjusteManualModalProps) {
    const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState(new Date().toISOString().split("T")[0]);
    const [motivo, setMotivo] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validar = () => {
        const newErrors: Record<string, string> = {};

        if (!descricao.trim()) {
            newErrors.descricao = "Descrição é obrigatória";
        }

        const valorNum = parseFloat(valor);
        if (!valor || valorNum <= 0) {
            newErrors.valor = "Valor deve ser maior que 0";
        }

        if (!data) {
            newErrors.data = "Data é obrigatória";
        }

        if (!motivo.trim()) {
            newErrors.motivo = "Motivo é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegistrar = () => {
        if (!validar()) return;

        onRegistrar({
            tipo,
            descricao,
            valor: parseFloat(valor),
            data,
            motivo,
        });

        setDescricao("");
        setValor("");
        setData(new Date().toISOString().split("T")[0]);
        setMotivo("");
        setTipo("entrada");
        setErrors({});
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[9998] bg-black/20 dark:bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="fixed left-1/2 top-1/2 z-[9999] max-h-[90vh] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-3xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-[#13081a] shadow-2xl animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-mauve-light-6 dark:border-white/10 bg-white dark:bg-[#13081a] px-6 py-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary-light dark:text-white">Ajuste Manual</h2>
                            <p className="text-sm text-text-secondary-light dark:text-white/60">
                                Registre uma correção no saldo
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 p-2 text-text-secondary-light dark:text-white/70 transition-all hover:bg-mauve-light-3 dark:hover:bg-white/10 hover:text-text-primary-light dark:hover:text-white disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(95vh-140px)] overflow-y-auto p-6 space-y-4">
                    {/* Tipo */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                            Tipo de Ajuste
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(["entrada", "saida"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTipo(t)}
                                    disabled={isLoading}
                                    className={`rounded-lg border-2 px-4 py-2.5 font-medium transition-all ${tipo === t
                                            ? t === "entrada"
                                                ? "border-green-600/50 dark:border-green-500/50 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                                : "border-red-600/50 dark:border-red-500/50 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                                            : "border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 text-text-primary-light dark:text-white hover:border-mauve-light-8 dark:hover:border-white/20"
                                        } disabled:opacity-50`}
                                >
                                    {t === "entrada" ? "➕ Entrada" : "➖ Saída"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                            Descrição
                        </label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ex: Diferença de caixa"
                            className="w-full rounded-xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder-white/50 transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-white/10 focus:outline-none disabled:opacity-50"
                        />
                        {errors.descricao && (
                            <p className="mt-1 text-xs text-red-700 dark:text-red-400">{errors.descricao}</p>
                        )}
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                            Valor (R$)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            disabled={isLoading}
                            placeholder="0,00"
                            className="w-full rounded-xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder-white/50 transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-white/10 focus:outline-none disabled:opacity-50"
                        />
                        {errors.valor && (
                            <p className="mt-1 text-xs text-red-700 dark:text-red-400">{errors.valor}</p>
                        )}
                    </div>

                    {/* Data */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                            Data
                        </label>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            disabled={isLoading}
                            className="w-full rounded-xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-text-primary-light dark:text-white transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-white/10 focus:outline-none disabled:opacity-50"
                        />
                        {errors.data && (
                            <p className="mt-1 text-xs text-red-700 dark:text-red-400">{errors.data}</p>
                        )}
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                            Motivo do Ajuste
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            disabled={isLoading}
                            placeholder="Explique o motivo do ajuste..."
                            className="min-h-24 w-full rounded-xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder-white/50 transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-white/10 focus:outline-none disabled:opacity-50"
                        />
                        {errors.motivo && (
                            <p className="mt-1 text-xs text-red-700 dark:text-red-400">{errors.motivo}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-mauve-light-6 dark:border-white/10 bg-white dark:bg-[#13081a] px-6 py-4 backdrop-blur-xl">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 rounded-xl border border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 px-4 py-3 font-medium text-text-primary-light dark:text-white transition-all hover:bg-mauve-light-3 dark:hover:bg-white/10 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleRegistrar}
                            disabled={isLoading}
                            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 active:scale-95"
                        >
                            {isLoading ? "Registrando..." : "Registrar Ajuste"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
