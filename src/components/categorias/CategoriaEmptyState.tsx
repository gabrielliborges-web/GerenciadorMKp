import { Plus } from "lucide-react";

interface CategoriaEmptyStateProps {
    onCreateClick: () => void;
}

export default function CategoriaEmptyState({
    onCreateClick,
}: CategoriaEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 px-4 sm:px-6 py-12 sm:py-16 text-center backdrop-blur-sm min-h-[300px] sm:min-h-[400px]">
            {/* Icon */}
            <div className="mb-3 sm:mb-4 rounded-full p-4 sm:p-6 bg-gradient-to-br from-primary-light-3 dark:from-primary-500/20 to-primary-light-2 dark:to-primary-600/10">
                <span className="text-4xl sm:text-6xl">📦</span>
            </div>

            {/* Text */}
            <h3 className="mb-2 text-lg sm:text-2xl font-bold text-text-primary-light dark:text-white">
                Nenhuma Categoria Encontrada
            </h3>
            <p className="mb-6 text-sm sm:text-base text-text-secondary-light dark:text-white/60 max-w-xs sm:max-w-sm">
                Comece criando uma nova categoria para organizar seus produtos.
            </p>

            {/* Button */}
            <button
                onClick={onCreateClick}
                className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 active:scale-95 bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:shadow-lg hover:shadow-rose-500/50"
            >
                <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
                Criar Categoria
            </button>
        </div>
    );
}
