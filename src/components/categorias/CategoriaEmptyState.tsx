import { Plus } from "lucide-react";

interface CategoriaEmptyStateProps {
    onCreateClick: () => void;
}

export default function CategoriaEmptyState({
    onCreateClick,
}: CategoriaEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 text-center backdrop-blur-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 light:border-gray-200 light:bg-gray-50">
            {/* Icon */}
            <div className="mb-4 rounded-full p-6 dark:bg-gradient-to-br dark:from-primary-500/20 dark:to-primary-600/10 light:bg-primary-100">
                <span className="text-6xl">📦</span>
            </div>

            {/* Text */}
            <h3 className="mb-2 text-2xl font-bold dark:text-white light:text-gray-900">
                Nenhuma Categoria Encontrada
            </h3>
            <p className="mb-6 dark:text-white/60 light:text-gray-600">
                Comece criando uma nova categoria para organizar seus produtos.
            </p>

            {/* Button */}
            <button
                onClick={onCreateClick}
                className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-300 active:scale-95 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/50"
            >
                <Plus className="h-5 w-5" />
                Criar Categoria
            </button>
        </div>
    );
}
