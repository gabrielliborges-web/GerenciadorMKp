import { Search, Filter, SortAsc } from "lucide-react";

interface ProdutoFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: "todos" | "ativos" | "inativos";
    onStatusChange: (value: "todos" | "ativos" | "inativos") => void;
    categoriaFilter: number | null;
    onCategoriaChange: (value: number | null) => void;
    ordenacao: "nome" | "preco" | "estoque";
    onOrdenacaoChange: (value: "nome" | "preco" | "estoque") => void;
    categorias: Array<{ id: number; nome: string }>;
}

export default function ProdutoFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    categoriaFilter,
    onCategoriaChange,
    ordenacao,
    onOrdenacaoChange,
    categorias,
}: ProdutoFiltersProps) {
    return (
        <div className="space-y-4 rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 p-4 backdrop-blur-sm md:space-y-0 md:flex md:items-center md:gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary-light dark:text-white/40" />
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-mauve-light-1 dark:bg-white/5 text-text-primary-light dark:text-white placeholder-text-secondary-light dark:placeholder-white/50 py-2 pl-10 pr-4 text-sm transition-all duration-300 focus:outline-none focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-white dark:focus:bg-white/10"
                />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-text-secondary-light dark:text-white/60" />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as "todos" | "ativos" | "inativos")}
                    className="rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 text-text-primary-light dark:text-white py-2 px-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary-light-6 dark:focus:border-primary-dark-6"
                >
                    <option value="todos">Todos</option>
                    <option value="ativos">Ativos</option>
                    <option value="inativos">Inativos</option>
                </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
                <select
                    value={categoriaFilter || ""}
                    onChange={(e) => onCategoriaChange(e.target.value ? Number(e.target.value) : null)}
                    className="rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 text-text-primary-light dark:text-white py-2 px-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary-light-6 dark:focus:border-primary-dark-6"
                >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nome}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-text-secondary-light dark:text-white/60" />
                <select
                    value={ordenacao}
                    onChange={(e) => onOrdenacaoChange(e.target.value as "nome" | "preco" | "estoque")}
                    className="rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 text-text-primary-light dark:text-white py-2 px-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary-light-6 dark:focus:border-primary-dark-6"
                >
                    <option value="nome">Nome</option>
                    <option value="preco">Preço</option>
                    <option value="estoque">Estoque</option>
                </select>
            </div>
        </div>
    );
}
