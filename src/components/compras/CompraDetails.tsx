import { X, Calendar, FileText, User, DollarSign, Package } from "lucide-react";
import type { CompraMock } from "../../mocks/comprasMock";

interface CompraDetailsProps {
    compra: CompraMock | null;
    onClose: () => void;
}

function formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

export default function CompraDetails({
    compra,
    onClose,
}: CompraDetailsProps) {
    if (!compra) return null;

    return (
        <div className="mb-8 rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5">
                <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-white">Detalhes da Compra</h2>
                <button
                    onClick={onClose}
                    className="rounded-lg p-2 transition-all duration-300 hover:bg-mauve-light-3 dark:hover:bg-white/10 flex-shrink-0"
                >
                    <X className="h-5 w-5 text-text-secondary-light dark:text-white/60" />
                </button>
            </div>

            <div className="p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-4 rounded-xl border border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 p-4 backdrop-blur-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                Informações Gerais
                            </h3>

                            <div className="space-y-3">
                                {compra.fornecedor && compra.fornecedor !== "-" && (
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="mt-1 h-5 w-5 text-primary-light-9 dark:text-primary-400 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-text-secondary-light dark:text-white/60">Fornecedor</p>
                                            <p className="text-sm font-semibold text-text-primary-light dark:text-white break-words">
                                                {compra.fornecedor}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-1 h-5 w-5 text-primary-light-9 dark:text-primary-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-text-secondary-light dark:text-white/60">Data</p>
                                        <p className="text-sm font-semibold text-text-primary-light dark:text-white break-words">
                                            {formatarData(compra.data)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="mt-1 h-5 w-5 text-primary-light-9 dark:text-primary-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-text-secondary-light dark:text-white/60">Usuário</p>
                                        <p className="text-sm font-semibold text-text-primary-light dark:text-white break-words">
                                            {compra.usuarioNome}
                                        </p>
                                    </div>
                                </div>

                                {compra.descricao && (
                                    <div className="flex items-start gap-3">
                                        <FileText className="mt-1 h-5 w-5 text-primary-light-9 dark:text-primary-400 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-text-secondary-light dark:text-white/60">Descrição</p>
                                            <p className="text-sm font-semibold text-text-primary-light dark:text-white break-words">
                                                {compra.descricao}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3 rounded-xl border border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary-light-9 dark:text-primary-400 flex-shrink-0" />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                    Itens ({compra.itens.length})
                                </h3>
                            </div>

                            <div className="space-y-2">
                                {compra.itens.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between gap-3 rounded-lg bg-mauve-light-3 dark:bg-white/5 p-3 text-sm"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-text-primary-light dark:text-white break-words">
                                                {item.produtoNome}
                                            </p>
                                            <p className="text-xs text-text-secondary-light dark:text-white/60">
                                                Qtd: {item.quantidade} × {formatarMoeda(item.custoUnit)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-primary-light-9 dark:text-primary-400 flex-shrink-0 whitespace-nowrap">
                                            {formatarMoeda(item.total)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-mauve-light-6 dark:border-white/10 pt-3">
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-text-secondary-light dark:text-white/80">Total:</p>
                                    <p className="text-lg font-bold text-primary-light-9 dark:text-primary-400">
                                        {formatarMoeda(compra.total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

