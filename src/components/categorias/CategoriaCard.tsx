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
        <div className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 dark:border-rose-500/20 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 dark:hover:border-rose-500/40 dark:hover:shadow-lg dark:hover:shadow-rose-500/10 light:border-rose-200/50 light:bg-gradient-to-br light:from-rose-50/30 light:to-white light:hover:border-rose-300/50 light:hover:shadow-lg light:hover:shadow-rose-200/30">
            {/* Ícone */}
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:from-rose-100/40 light:to-rose-50/20">
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl">📦</div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute right-2 top-2">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoria.ativo
                            ? "dark:bg-rose-500/20 dark:text-rose-400 light:bg-rose-100 light:text-rose-700"
                            : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-100 light:text-gray-600"
                            }`}
                    >
                        {categoria.ativo ? "Ativa" : "Inativa"}
                    </span>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <h3 className="truncate text-sm font-semibold dark:text-white light:text-gray-900">
                        {categoria.nome}
                    </h3>
                    <p className="line-clamp-2 text-xs dark:text-white/50 light:text-gray-600">
                        {categoria.descricao || "Sem descrição"}
                    </p>
                </div>

                {/* Contador de produtos */}
                <div className="flex items-center gap-2 rounded-lg dark:bg-rose-500/10 light:bg-rose-100/50 px-3 py-2">
                    <span className="text-xs font-semibold dark:text-white/60 light:text-gray-700">Produtos:</span>
                    <span className="font-bold dark:text-rose-400 light:text-rose-600">
                        {categoria.produtosCount}
                    </span>
                </div>

                {/* Ações */}
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={() => onDetails(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 dark:bg-white/10 dark:text-white dark:hover:bg-rose-500/20 dark:hover:text-rose-300 light:bg-rose-100/50 light:text-gray-700 light:hover:bg-rose-200"
                        title="Detalhes"
                    >
                        <Info className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                        onClick={() => onEdit(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 dark:bg-white/10 dark:text-white dark:hover:bg-rose-500/20 light:bg-gray-100 light:text-gray-700 light:hover:bg-rose-100"
                        title="Editar"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                        onClick={() => onDelete(categoria.id)}
                        className="flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 light:bg-rose-100 light:text-rose-700 light:hover:bg-rose-200"
                        title="Excluir"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
