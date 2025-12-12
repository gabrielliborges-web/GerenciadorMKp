import { Search, Filter } from "lucide-react";

interface CategoriaFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: "todos" | "ativas" | "inativas";
    onStatusChange: (value: "todos" | "ativas" | "inativas") => void;
}

export default function CategoriaFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: CategoriaFiltersProps) {
    return (
        <div className="rounded-xl sm:rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 p-3 sm:p-4 backdrop-blur-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
            {/* Busca */}
            <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 -translate-y-1/2 text-text-secondary-light dark:text-white/40" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 pl-9 sm:pl-10 text-xs sm:text-sm text-text-primary-light dark:text-white placeholder-text-secondary-light dark:placeholder-white/50 transition-all duration-300 focus:outline-none focus:border-primary-light-9 dark:focus:border-white/30 focus:bg-white dark:focus:bg-white/10"
                />
            </div>

            {/* Filtro de Status */}
            <div className="flex items-center gap-2 min-w-fit">
                <Filter className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-text-secondary-light dark:text-white/60 flex-shrink-0" />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as "todos" | "ativas" | "inativas")}
                    className="rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-2 sm:px-3 py-2 text-xs sm:text-sm text-text-primary-light dark:text-white transition-all duration-300 focus:outline-none focus:border-primary-light-9 dark:focus:border-white/30 focus:bg-white dark:focus:bg-white/10"
                >
                    <option value="todos" className="text-text-primary-light dark:text-white">Todas</option>
                    <option value="ativas" className="text-text-primary-light dark:text-white">Ativas</option>
                    <option value="inativas" className="text-text-primary-light dark:text-white">Inativas</option>
                </select>
            </div>
        </div>
    );
}
