import { X, Calendar, Package } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";
import { produtosMockPorCategoria } from "../../mocks/categoriasMock";

interface CategoriaDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categoria: Categoria | null;
}

export default function CategoriaDrawer({
    isOpen,
    onClose,
    categoria,
}: CategoriaDrawerProps) {
    if (!categoria) return null;

    const produtos = produtosMockPorCategoria[categoria.id] || [];

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "-";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(date));
        } catch {
            return String(date);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform backdrop-blur-xl transition-transform duration-300 bg-gradient-to-b from-white dark:from-gray-900 to-primary-light-2 dark:to-gray-800 border-l border-mauve-light-6 dark:border-rose-500/20 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur border-b border-mauve-light-6 dark:border-rose-500/20 bg-white/80 dark:bg-gray-900/50">
                    <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-white">Detalhes da Categoria</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-all duration-300 hover:bg-mauve-light-3 dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5 text-text-secondary-light dark:text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-mauve-light-8 dark:scrollbar-thumb-white/20 hover:scrollbar-thumb-mauve-light-9 dark:hover:scrollbar-thumb-white/30">
                    {/* Icon */}
                    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-primary-light-3 dark:from-rose-500/10 to-primary-light-2 dark:to-rose-600/5">
                        <div className="flex h-full items-center justify-center text-6xl">
                            📦
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6 p-4 sm:p-6">
                        {/* Title */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                Nome
                            </p>
                            <p className="mt-2 text-xl sm:text-2xl font-bold text-text-primary-light dark:text-white">
                                {categoria.nome}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoria.ativo
                                    ? "bg-green-100 dark:bg-rose-500/20 text-green-700 dark:text-rose-400"
                                    : "bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {categoria.ativo ? "Ativa" : "Inativa"}
                            </span>
                        </div>

                        {/* Description */}
                        {categoria.descricao && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                    Descrição
                                </p>
                                <p className="mt-2 leading-relaxed text-text-secondary-light dark:text-white/80">
                                    {categoria.descricao}
                                </p>
                            </div>
                        )}

                        {/* Products Count */}
                        <div className="rounded-2xl p-4 bg-gradient-to-br from-primary-light-3 dark:from-rose-500/10 to-primary-light-2 dark:to-rose-600/5">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-primary-light-9 dark:text-rose-400" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                        Quantidade de Produtos
                                    </p>
                                    <p className="mt-1 text-lg sm:text-2xl font-bold text-text-primary-light dark:text-white">
                                        {categoria.produtosCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Products List */}
                        {produtos.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                    Produtos
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {produtos.map((produto) => (
                                        <div
                                            key={produto.id}
                                            className="flex items-center gap-2 rounded-full backdrop-blur px-3 py-2 bg-gradient-to-r from-primary-light-3 dark:from-rose-500/20 to-primary-light-2 dark:to-rose-600/20"
                                        >
                                            <span className="text-sm font-medium text-primary-light-11 dark:text-rose-300">
                                                {produto.nome}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="space-y-4 border-t border-mauve-light-6 dark:border-rose-500/20 pt-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light-9 dark:text-rose-400/60" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/50">
                                        Data de Criação
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary-light dark:text-white/70">
                                        {formatDate(categoria.dataCriacao)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light-9 dark:text-rose-400/60" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                        Última Atualização
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary-light dark:text-white/80">
                                        {formatDate(categoria.dataAtualizacao)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
