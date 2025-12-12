import { Edit, Trash2, Info } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";

interface CategoriaTableProps {
    categorias: Categoria[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
    selectedIds?: Set<number>;
    onSelectAll?: () => void;
    onSelectSingle?: (id: number) => void;
    onDeleteMultiple?: () => void;
    onClearSelection?: () => void;
}

export default function CategoriaTable({
    categorias,
    onEdit,
    onDelete,
    onDetails,
    selectedIds = new Set(),
    onSelectAll,
    onSelectSingle,
    onDeleteMultiple,
    onClearSelection,
}: CategoriaTableProps) {
    return (
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 backdrop-blur-sm w-full">
            {/* Selection bar */}
            {selectedIds.size > 0 && (
                <div className="border-b border-mauve-light-6 dark:border-white/10 p-3 lg:p-4 bg-gradient-to-r from-red-100 dark:from-rose-500/10 to-red-200 dark:to-rose-600/10 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-text-primary-light dark:text-white">
                        {selectedIds.size} categoria(s) selecionada(s)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDeleteMultiple}
                            className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 transition-all duration-300"
                        >
                            <Trash2 className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                            Deletar Selecionadas
                        </button>
                        <button
                            onClick={onClearSelection}
                            className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-mauve-light-3 dark:bg-white/10 text-text-primary-light dark:text-white/70 hover:bg-mauve-light-4 dark:hover:bg-white/20 transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-mauve-light-6 dark:border-white/10">
                        <th className="px-4 lg:px-6 py-3 lg:py-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.size > 0 && selectedIds.size === categorias.length}
                                onChange={onSelectAll}
                                className="h-4 w-4 cursor-pointer rounded border-rose-300 dark:border-rose-500/30 bg-rose-100 dark:bg-rose-500/10 text-rose-500 transition-colors"
                                title={selectedIds.size === categorias.length ? "Desselecionar todas" : "Selecionar todas"}
                            />
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60 whitespace-nowrap">
                            Nome
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60 whitespace-nowrap">
                            Descrição
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60 whitespace-nowrap">
                            Produtos
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60 whitespace-nowrap">
                            Status
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60 whitespace-nowrap">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-mauve-light-5 dark:divide-white/5 text-xs lg:text-sm">
                    {categorias.map((categoria) => (
                        <tr
                            key={categoria.id}
                            className={`group transition-all duration-300 ${selectedIds.has(categoria.id) ? 'bg-red-100/50 dark:bg-rose-500/10' : 'hover:bg-mauve-light-2 dark:hover:bg-white/5'}`}
                        >
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(categoria.id)}
                                    onChange={() => onSelectSingle?.(categoria.id)}
                                    className="h-4 w-4 cursor-pointer rounded border-rose-300 dark:border-rose-500/30 bg-rose-100 dark:bg-rose-500/10 text-rose-500 transition-colors"
                                />
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4 font-semibold text-text-primary-light dark:text-white whitespace-nowrap">
                                {categoria.nome}
                            </td>
                            <td className="max-w-xs px-4 lg:px-6 py-3 lg:py-4 text-text-secondary-light dark:text-white/70">
                                <span className="line-clamp-1">
                                    {categoria.descricao || "-"}
                                </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-text-primary-light dark:text-white whitespace-nowrap">
                                {categoria.produtosCount}
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <span
                                    className={`inline-flex rounded-full px-2 lg:px-3 py-0.5 lg:py-1 text-xs font-semibold whitespace-nowrap ${categoria.ativo
                                        ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                        : "bg-gray-200 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400"
                                        }`}
                                >
                                    {categoria.ativo ? "Ativa" : "Inativa"}
                                </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <div className="flex items-center gap-1 lg:gap-2">
                                    <button
                                        onClick={() => onDetails(categoria.id)}
                                        className="rounded-lg p-1.5 lg:p-2 transition-all duration-300 bg-mauve-light-3 dark:bg-white/5 text-text-secondary-light dark:text-white/70 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
                                        title="Detalhes"
                                    >
                                        <Info className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(categoria.id)}
                                        className="rounded-lg p-1.5 lg:p-2 transition-all duration-300 bg-mauve-light-3 dark:bg-white/5 text-text-secondary-light dark:text-white/70 hover:bg-mauve-light-4 dark:hover:bg-white/15 hover:text-text-primary-light dark:hover:text-white flex-shrink-0"
                                        title="Editar"
                                    >
                                        <Edit className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(categoria.id)}
                                        className="rounded-lg p-1.5 lg:p-2 transition-all duration-300 bg-mauve-light-3 dark:bg-white/5 text-text-secondary-light dark:text-white/70 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
