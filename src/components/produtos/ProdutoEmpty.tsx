import { Plus } from "lucide-react";

interface ProdutoEmptyProps {
    onCreateClick: () => void;
}

export default function ProdutoEmpty({ onCreateClick }: ProdutoEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mauve-light-6 dark:border-white/10 bg-mauve-light-1 dark:bg-white/5 px-6 py-16 text-center backdrop-blur-sm">
            {/* Icon */}
            <div className="mb-4 rounded-full bg-mauve-light-2 dark:bg-white/10 p-6">
                <span className="text-6xl">📦</span>
            </div>

            {/* Text */}
            <h3 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-white">
                Nenhum Produto Encontrado
            </h3>
            <p className="mb-6 text-text-secondary-light dark:text-white/60">
                Comece adicionando seu primeiro produto ao catálogo.
            </p>

            {/* Button */}
            <button
                onClick={onCreateClick}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
            >
                <Plus className="h-5 w-5" />
                Adicionar Produto
            </button>
        </div>
    );
}
