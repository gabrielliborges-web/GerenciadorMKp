import { Search, Calendar, User, RotateCcw } from "lucide-react";

interface ComprasFiltersProps {
    fornecedor: string;
    onFornecedorChange: (value: string) => void;
    dataInicio: string;
    onDataInicioChange: (value: string) => void;
    dataFim: string;
    onDataFimChange: (value: string) => void;
    usuarioId: string;
    onUsuarioChange: (value: string) => void;
    usuarios: Array<{ id: number; nome: string }>;
    onLimparFiltros: () => void;
}

export default function ComprasFilters({
    fornecedor,
    onFornecedorChange,
    dataInicio,
    onDataInicioChange,
    dataFim,
    onDataFimChange,
    usuarioId,
    onUsuarioChange,
    usuarios,
    onLimparFiltros,
}: ComprasFiltersProps) {
    return (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-6">
            {/* Primeira linha - Fornecedor e Datas */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Buscar Fornecedor */}
                <div className="relative">
                    <label className="mb-2 block text-sm font-semibold text-white/80">Fornecedor</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Buscar fornecedor..."
                            value={fornecedor}
                            onChange={(e) => onFornecedorChange(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-white placeholder:text-white/40 transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        />
                    </div>
                </div>

                {/* Data Início */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white/80">Data Início</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => onDataInicioChange(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        />
                    </div>
                </div>

                {/* Data Fim */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white/80">Data Fim</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => onDataFimChange(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Segunda linha - Usuário e Botão Limpar */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Usuário */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white/80">Usuário</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                        <select
                            value={usuarioId}
                            onChange={(e) => onUsuarioChange(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        >
                            <option value="">Todos os usuários</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id.toString()}>
                                    {usuario.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Espaço vazio para alinhamento */}
                <div />

                {/* Botão Limpar Filtros */}
                <div className="flex items-end">
                    <button
                        onClick={onLimparFiltros}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 font-semibold text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
                    >
                        <RotateCcw className="h-4 w-4" />
                        <span>Limpar Filtros</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
