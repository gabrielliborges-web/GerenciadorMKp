import { Search, Calendar, RotateCcw } from "lucide-react";

interface ComprasFiltersProps {
    fornecedor: string;
    onFornecedorChange: (value: string) => void;
    dataInicio: string;
    onDataInicioChange: (value: string) => void;
    dataFim: string;
    onDataFimChange: (value: string) => void;
    onLimparFiltros: () => void;
}

export default function ComprasFilters({
    fornecedor,
    onFornecedorChange,
    dataInicio,
    onDataInicioChange,
    dataFim,
    onDataFimChange,
    onLimparFiltros,
}: ComprasFiltersProps) {
    return (
        <div className="space-y-4 rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 p-4 backdrop-blur-sm md:p-6">
            {/* Primeira linha - Fornecedor e Datas */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Buscar Fornecedor */}
                <div className="relative">
                    <label className="mb-2 block text-sm font-semibold text-text-primary-light dark:text-white/80">Fornecedor</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary-light dark:text-white/40" />
                        <input
                            type="text"
                            placeholder="Buscar fornecedor..."
                            value={fornecedor}
                            onChange={(e) => onFornecedorChange(e.target.value)}
                            className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 py-2 pl-9 pr-3 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder:text-white/40 transition-all duration-300 hover:border-mauve-light-8 dark:hover:border-white/20 focus:border-primary-light-9 dark:focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-light-9/20 dark:focus:ring-white/10"
                        />
                    </div>
                </div>

                {/* Data Início */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text-primary-light dark:text-white/80">Data Início</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-secondary-light dark:text-white/40" />
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => onDataInicioChange(e.target.value)}
                            className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 py-2 pl-9 pr-3 text-text-primary-light dark:text-white transition-all duration-300 hover:border-mauve-light-8 dark:hover:border-white/20 focus:border-primary-light-9 dark:focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-light-9/20 dark:focus:ring-white/10"
                        />
                    </div>
                </div>

                {/* Data Fim */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-text-primary-light dark:text-white/80">Data Fim</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-secondary-light dark:text-white/40" />
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => onDataFimChange(e.target.value)}
                            className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 py-2 pl-9 pr-3 text-text-primary-light dark:text-white transition-all duration-300 hover:border-mauve-light-8 dark:hover:border-white/20 focus:border-primary-light-9 dark:focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-light-9/20 dark:focus:ring-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Segunda linha - Botão Limpar */}
            <div className="flex justify-end">
                {/* Botão Limpar Filtros */}
                <button
                    onClick={onLimparFiltros}
                    className="flex items-center justify-center gap-2 rounded-lg border border-mauve-light-6 dark:border-white/10 px-4 py-2 font-semibold text-text-secondary-light dark:text-white/70 transition-all duration-300 hover:border-mauve-light-8 dark:hover:border-white/20 hover:bg-mauve-light-3 dark:hover:bg-white/5 hover:text-text-primary-light dark:hover:text-white"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Limpar Filtros</span>
                </button>
            </div>
        </div>
    );
}
