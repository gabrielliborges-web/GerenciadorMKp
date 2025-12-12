import { Edit, Trash2, Info } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";

interface CategoriaCardProps {
    categoria: Categoria;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

export default function CategoriaCard({
    categoria,
    onEdit,
    onDelete,
    onDetails,
}: CategoriaCardProps) {
    return (
        <div className="group flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl border border-mauve-light-6 dark:border-rose-500/20 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 transition-all duration-300 hover:border-primary-light-8 dark:hover:border-rose-500/40 hover:shadow-lg hover:shadow-primary-light-9/10 dark:hover:shadow-rose-500/10">
            {/* Ícone */}
            <div className="relative h-28 sm:h-40 w-full overflow-hidden bg-gradient-to-br from-primary-light-3 dark:from-rose-500/10 to-primary-light-2 dark:to-rose-600/5 flex-shrink-0">
                <div className="flex h-full items-center justify-center">
                    <div className="text-3xl sm:text-5xl">📦</div>
                </div>

                {/* Status Badge */}
                <div className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2">
                    <span
                        className={`inline-flex rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold ${categoria.ativo
                            ? "bg-green-100 dark:bg-rose-500/20 text-green-700 dark:text-rose-400"
                            : "bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        {categoria.ativo ? "Ativa" : "Inativa"}
                    </span>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex flex-1 flex-col gap-2 sm:gap-3 p-3 sm:p-4">
                <div className="min-w-0">
                    <h3 className="truncate text-xs sm:text-sm font-semibold text-text-primary-light dark:text-white">
                        {categoria.nome}
                    </h3>
                    <p className="line-clamp-2 text-xs text-text-secondary-light dark:text-white/50">
                        {categoria.descricao || "Sem descrição"}
                    </p>
                </div>

                {/* Contador de produtos */}
                <div className="flex items-center gap-1 sm:gap-2 rounded-lg bg-primary-light-3 dark:bg-rose-500/10 px-2 sm:px-3 py-1.5 sm:py-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">Produtos:</span>
                    <span className="font-bold text-primary-light-9 dark:text-rose-400 text-xs sm:text-sm">
                        {categoria.produtosCount}
                    </span>
                </div>

                {/* Ações */}
                <div className="mt-auto flex gap-1 sm:gap-2">
                    <button
                        onClick={() => onDetails(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 bg-primary-light-3 dark:bg-white/10 text-text-primary-light dark:text-white hover:bg-primary-light-4 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                        title="Detalhes"
                    >
                        <Info className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                        onClick={() => onEdit(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 bg-mauve-light-3 dark:bg-white/10 text-text-primary-light dark:text-white hover:bg-mauve-light-4 dark:hover:bg-rose-500/20"
                        title="Editar"
                    >
                        <Edit className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                        onClick={() => onDelete(categoria.id)}
                        className="flex items-center justify-center rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 bg-red-100 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 hover:bg-red-200 dark:hover:bg-rose-500/20 flex-shrink-0"
                        title="Excluir"
                    >
                        <Trash2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
