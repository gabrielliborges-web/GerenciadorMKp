import { Edit, Trash2, Info, Tag } from "lucide-react";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoCardProps {
    produto: Produto;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

function getEstoqueColor(estoque: number) {
    if (estoque > 10) return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400";
    if (estoque >= 5) return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
}

export default function ProdutoCard({
    produto,
    onEdit,
    onDelete,
    onDetails,
}: ProdutoCardProps) {
    const preco = Number(produto.precoPromocional || produto.precoVenda);
    const temPromocao = produto.precoPromocional && produto.precoPromocional < produto.precoVenda;

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 transition-all duration-300 hover:border-mauve-light-8 dark:hover:border-white/20 hover:shadow-lg hover:shadow-primary-light-7/20 dark:hover:shadow-white/5">
            {/* Image */}
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2">
                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x400?text=Sem+Imagem";
                    }}
                />

                {/* Badge - Status Ativo */}
                {produto.ativo && (
                    <div className="absolute right-2 top-2">
                        <span className="inline-flex rounded-full bg-primary-light-3 dark:bg-primary-dark-3 px-3 py-1 text-xs font-semibold text-primary-light-11 dark:text-primary-dark-9">
                            Ativo
                        </span>
                    </div>
                )}

                {/* Badge - Promoção */}
                {temPromocao && (
                    <div className="absolute left-2 top-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                            <Tag className="h-3 w-3" />
                            Promoção
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <h3 className="truncate text-sm font-semibold text-text-primary-light dark:text-white">
                        {produto.nome}
                    </h3>
                    <p className="line-clamp-1 text-xs text-text-secondary-light dark:text-white/60">
                        {produto.categoria?.nome || "Sem categoria"}
                    </p>
                </div>

                {/* Prices */}
                <div className="space-y-1">
                    {temPromocao && (
                        <p className="text-xs line-through text-text-secondary-light dark:text-white/40">
                            R$ {Number(produto?.precoVenda)?.toFixed(2)}
                        </p>
                    )}
                    <p className="text-lg font-bold text-primary-light-11 dark:text-primary-dark-9">
                        R$ {preco.toFixed(2)}
                    </p>
                </div>

                {/* Stock Badge */}
                <div className="flex items-center justify-between rounded-lg bg-mauve-light-2 dark:bg-white/5 px-3 py-2">
                    <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">Estoque:</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstoqueColor(produto.estoque)}`}>
                        {produto.estoque}
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={() => onDetails(produto.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-mauve-light-2 dark:bg-white/10 text-text-primary-light dark:text-white px-3 py-2 text-xs font-medium transition-all duration-300 hover:bg-mauve-light-3 dark:hover:bg-white/15"
                        title="Detalhes"
                    >
                        <Info className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                        onClick={() => onEdit(produto.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-mauve-light-2 dark:bg-white/10 text-text-primary-light dark:text-white px-3 py-2 text-xs font-medium transition-all duration-300 hover:bg-mauve-light-3 dark:hover:bg-white/15"
                        title="Editar"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                        onClick={() => onDelete(produto.id)}
                        className="flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-3 py-2 text-xs font-medium transition-all duration-300 hover:bg-red-200 dark:hover:bg-red-500/20"
                        title="Excluir"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
