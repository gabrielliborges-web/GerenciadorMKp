import { Edit, Trash2, Info } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";

interface CategoriaTableProps {
    categorias: Categoria[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

export default function CategoriaTable({
    categorias,
    onEdit,
    onDelete,
    onDetails,
}: CategoriaTableProps) {
    return (
        <div className="hidden md:block overflow-x-auto rounded-2xl border backdrop-blur-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 light:border-gray-200 light:bg-white">
            <table className="w-full">
                <thead>
                    <tr className="border-b dark:border-white/10 light:border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Nome
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Descrição
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Produtos
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5 light:divide-gray-200">
                    {categorias.map((categoria) => (
                        <tr
                            key={categoria.id}
                            className="group transition-all duration-300 dark:hover:bg-white/5 light:hover:bg-gray-50"
                        >
                            <td className="px-6 py-4 text-sm font-semibold dark:text-white light:text-gray-900">
                                {categoria.nome}
                            </td>
                            <td className="max-w-xs px-6 py-4 text-sm dark:text-white/70 light:text-gray-600">
                                <span className="line-clamp-1">
                                    {categoria.descricao || "-"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium dark:text-white light:text-gray-900">
                                {categoria.produtosCount}
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoria.ativo
                                        ? "dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700"
                                        : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-200 light:text-gray-700"
                                        }`}
                                >
                                    {categoria.ativo ? "Ativa" : "Inativa"}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onDetails(categoria.id)}
                                        className="rounded-lg p-2 transition-all duration-300 dark:bg-white/5 dark:text-white/70 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 light:bg-gray-100 light:text-gray-600 light:hover:bg-blue-100 light:hover:text-blue-600"
                                        title="Detalhes"
                                    >
                                        <Info className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(categoria.id)}
                                        className="rounded-lg p-2 transition-all duration-300 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white light:bg-gray-100 light:text-gray-600 light:hover:bg-gray-200 light:hover:text-gray-900"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(categoria.id)}
                                        className="rounded-lg p-2 transition-all duration-300 dark:bg-white/5 dark:text-white/70 dark:hover:bg-red-500/20 dark:hover:text-red-400 light:bg-gray-100 light:text-gray-600 light:hover:bg-red-100 light:hover:text-red-600"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
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
