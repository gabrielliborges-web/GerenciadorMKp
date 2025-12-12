import { X, Calendar, DollarSign, Package, TrendingUp } from "lucide-react";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    produto: Produto | null;
}

export default function ProdutoDetailsDrawer({
    isOpen,
    onClose,
    produto,
}: ProdutoDetailsDrawerProps) {
    if (!produto) return null;

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

    const margemLucro = produto.precoCompra
        ? (((produto.precoVenda - produto.precoCompra) / produto.precoVenda) * 100).toFixed(1)
        : "-";

    const temPromocao = produto.precoPromocional && produto.precoPromocional < produto.precoVenda;
    const descontoPromocional = temPromocao
        ? (((produto.precoVenda - produto.precoPromocional!) / produto.precoVenda) * 100).toFixed(1)
        : "0";

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform backdrop-blur-xl transition-transform duration-300 bg-white dark:bg-[#13081a] border-l border-mauve-light-6 dark:border-white/10 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur border-b border-mauve-light-6 dark:border-white/10 bg-white dark:bg-[#13081a]">
                    <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-white">Detalhes do Produto</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-all duration-300 hover:bg-mauve-light-2 dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5 text-text-secondary-light dark:text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-mauve-light-8 dark:scrollbar-thumb-white/20 hover:scrollbar-thumb-mauve-light-9 dark:hover:scrollbar-thumb-white/30">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2">
                        <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x400?text=Sem+Imagem";
                            }}
                        />
                    </div>

                    {/* Details */}
                    <div className="space-y-6 p-4 sm:p-6">
                        {/* Title */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                Nome do Produto
                            </p>
                            <p className="mt-2 text-xl sm:text-2xl font-bold text-text-primary-light dark:text-white">
                                {produto.nome}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${produto.ativo
                                    ? "bg-primary-light-3 dark:bg-primary-dark-3 text-primary-light-11 dark:text-primary-dark-9"
                                    : "bg-mauve-light-3 dark:bg-white/10 text-text-secondary-light dark:text-white/60"
                                    }`}
                            >
                                {produto.ativo ? "Ativo" : "Inativo"}
                            </span>
                        </div>

                        {/* Description */}
                        {produto.descricao && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                    Descrição
                                </p>
                                <p className="mt-2 leading-relaxed text-text-secondary-light dark:text-white/80">
                                    {produto.descricao}
                                </p>
                            </div>
                        )}

                        {/* Category */}
                        {produto.categoria && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                    Categoria
                                </p>
                                <p className="mt-2 text-sm text-text-secondary-light dark:text-white/80">
                                    {produto.categoria.nome}
                                </p>
                            </div>
                        )}

                        {/* Preços */}
                        <div className="space-y-3 rounded-2xl p-4 bg-mauve-light-2 dark:bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary-light-11 dark:text-primary-dark-9" />
                                    <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">Preço de Venda</span>
                                </div>
                                <p className="text-sm font-bold text-primary-light-11 dark:text-primary-dark-9">
                                    R$ {produto?.precoVenda?.toFixed(2)}
                                </p>
                            </div>

                            {produto.precoCompra && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">Preço de Compra</span>
                                    <p className="text-sm text-text-secondary-light dark:text-white/80">
                                        R$ {produto.precoCompra.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            {produto.precoPromocional && (
                                <div className="flex items-center justify-between pt-2 border-t border-mauve-light-6 dark:border-white/10">
                                    <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">
                                        Preço Promocional
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-700 dark:text-green-400">
                                            R$ {produto.precoPromocional.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-green-700/60 dark:text-green-400/60">
                                            -{descontoPromocional}%
                                        </p>
                                    </div>
                                </div>
                            )}

                            {margemLucro !== "-" && (
                                <div className="flex items-center justify-between pt-2 border-t border-mauve-light-6 dark:border-white/10">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-yellow-700 dark:text-yellow-400" />
                                        <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">Margem de Lucro</span>
                                    </div>
                                    <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                                        {margemLucro}%
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="rounded-2xl p-4 bg-mauve-light-2 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-primary-light-11 dark:text-primary-dark-9" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                        Estoque
                                    </p>
                                    <p className="mt-1 text-lg sm:text-2xl font-bold text-text-primary-light dark:text-white">
                                        {produto.estoque}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4 border-t border-mauve-light-6 dark:border-white/10 pt-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-secondary-light dark:text-white/60" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/50">
                                        Criado em
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary-light dark:text-white/70">
                                        {formatDate(produto.criadoEm)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-secondary-light dark:text-white/60" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/50">
                                        Atualizado em
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary-light dark:text-white/70">
                                        {formatDate(produto.atualizadoEm)}
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
