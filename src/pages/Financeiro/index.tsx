import { useState, useMemo, useCallback } from "react";
import {
    DollarSign,
    Plus,
    Download,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Settings2,
} from "lucide-react";
import type { EntradaFinanceira } from "../../lib/entradaFinanceira";
import type { Despesa as DespesaType } from "../../lib/despesa";
import type { Movimentacao } from "../../lib/movimentacao";
import { listEntradas, createEntrada } from "../../lib/entradaFinanceira";
import { listDespesas, createDespesa } from "../../lib/despesa";
import { listMovimentacoes, getDashboardResumo, registrarAjuste } from "../../lib/movimentacao";
import FinanceiroResumo from "../../components/financeiro/FinanceiroResumo";
import ExtratoTable from "../../components/financeiro/ExtratoTable";
import ResumoDRE from "../../components/financeiro/ResumoDRE";
import FinanceiroEntradaModal from "../../components/financeiro/FinanceiroEntradaModal";
import FinanceiroDespesaModal from "../../components/financeiro/FinanceiroDespesaModal";
import AjusteManualModal from "../../components/financeiro/AjusteManualModal";

type TabAtiva = "resumo" | "extrato" | "entradas" | "despesas" | "dre";

export default function FinanceiroPage() {
    const [activeTab, setActiveTab] = useState<TabAtiva>("extrato");
    const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
    const [isDespesaModalOpen, setIsDespesaModalOpen] = useState(false);
    const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State para dados
    const [entradas, setEntradas] = useState<EntradaFinanceira[]>([]);
    const [despesas, setDespesas] = useState<DespesaType[]>([]);
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [resumo, setResumo] = useState<any | null>(null);

    // State para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtros
    const [filtroExtratoTipo, setFiltroExtratoTipo] = useState<string>("");
    const [filtroDataInicio, setFiltroDataInicio] = useState("");
    const [filtroDataFim, setFiltroDataFim] = useState("");

    // Calcular totais
    const totalEntradas = useMemo(() => entradas.reduce((sum, e) => sum + e.valor, 0), [entradas]);
    const totalDespesas = useMemo(() => despesas.reduce((sum, d) => sum + d.valor, 0), [despesas]);
    // Movimentações filtradas
    const filteredMovimentacoes = useMemo(() => {
        let result = [...movimentacoes];

        if (filtroExtratoTipo) {
            // filtroExtratoTipo pode ser 'entrada' ou 'saida' vindo do select
            if (filtroExtratoTipo === "entrada") {
                result = result.filter((m) => (m as any).entrada === true);
            } else if (filtroExtratoTipo === "saida") {
                result = result.filter((m) => (m as any).entrada === false);
            } else {
                // fallback: filtrar por tipo textual se for outro valor
                result = result.filter((m) => m.tipo === filtroExtratoTipo);
            }
        }

        if (filtroDataInicio) {
            const dataInicio = new Date(filtroDataInicio);
            result = result.filter(
                (m) => new Date(m.data) >= dataInicio
            );
        }

        if (filtroDataFim) {
            const dataFim = new Date(filtroDataFim);
            dataFim.setDate(dataFim.getDate() + 1);
            result = result.filter(
                (m) => new Date(m.data) < dataFim
            );
        }

        return result;
    }, [movimentacoes, filtroExtratoTipo, filtroDataInicio, filtroDataFim]);

    // Handlers
    const fetchResumo = useCallback(async () => {
        try {
            const d = await getDashboardResumo();
            setResumo(d);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchMovimentacoes = useCallback(async () => {
        try {
            const data = await listMovimentacoes();
            setMovimentacoes((data || []).map((m: any) => ({ ...m, valor: typeof m.valor === "number" ? m.valor : Number(m.valor || 0) })));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchEntradas = useCallback(async () => {
        try {
            const [entradasData, movimentacoesData] = await Promise.all([
                listEntradas(),
                listMovimentacoes()
            ]);
            
            // Mapear entradas normais
            const entradasNormais = (entradasData || []).map((e: any) => ({ 
                ...e, 
                valor: typeof e.valor === "number" ? e.valor : Number(e.valor || 0) 
            }));
            
            // Mapear ajustes do tipo entrada
            const ajustesEntrada = (movimentacoesData || [])
                .filter((m: any) => m.tipo === "ajuste" && m.entrada === true)
                .map((m: any) => ({
                    id: m.id,
                    tipo: "Ajuste Manual",
                    descricao: m.descricao || "Ajuste manual",
                    valor: typeof m.valor === "number" ? m.valor : Number(m.valor || 0),
                    data: m.data,
                    usuarioId: m.usuarioId,
                    criadoEm: m.criadoEm,
                    atualizadoEm: m.atualizadoEm,
                }));
            
            // Combinar entradas normais com ajustes
            setEntradas([...entradasNormais, ...ajustesEntrada]);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchDespesas = useCallback(async () => {
        try {
            const [despesasData, movimentacoesData] = await Promise.all([
                listDespesas(),
                listMovimentacoes()
            ]);
            
            // Mapear despesas normais
            const despesasNormais = (despesasData || []).map((d: any) => ({ 
                ...d, 
                valor: typeof d.valor === "number" ? d.valor : Number(d.valor || 0) 
            }));
            
            // Mapear ajustes do tipo saída
            const ajustesSaida = (movimentacoesData || [])
                .filter((m: any) => m.tipo === "ajuste" && m.entrada === false)
                .map((m: any) => ({
                    id: m.id.toString(),
                    tipo: "Ajuste Manual",
                    descricao: m.descricao || "Ajuste manual",
                    valor: typeof m.valor === "number" ? m.valor : Number(m.valor || 0),
                    data: m.data,
                    usuarioId: m.usuarioId.toString(),
                    observacao: m.descricao || "Ajuste manual",
                    criadoEm: m.criadoEm,
                    atualizadoEm: m.atualizadoEm,
                }));
            
            // Combinar despesas normais com ajustes
            setDespesas([...despesasNormais, ...ajustesSaida]);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // Inicializar dados
    useMemo(() => {
        fetchResumo();
        fetchMovimentacoes();
        fetchEntradas();
        fetchDespesas();
    }, [fetchResumo, fetchMovimentacoes, fetchEntradas, fetchDespesas]);

    const handleSalvarEntrada = useCallback(
        async (data: { tipo: string; valor: number; data: string; descricao?: string }) => {
            setIsLoading(true);
            try {
                await createEntrada({ tipo: data.tipo, descricao: data.descricao || "", valor: data.valor, data: data.data });
                await fetchEntradas();
                await fetchMovimentacoes();
                await fetchResumo();
                setIsEntradaModalOpen(false);
            } catch (err: any) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchEntradas, fetchMovimentacoes, fetchResumo]
    );

    const handleSalvarDespesa = useCallback(
        async (data: { tipo: string; descricao?: string; valor: number; data: string }) => {
            setIsLoading(true);
            try {
                await createDespesa({ tipo: data.tipo, descricao: data.descricao || "", valor: data.valor, data: data.data });
                await fetchDespesas();
                await fetchMovimentacoes();
                await fetchResumo();
                setIsDespesaModalOpen(false);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchDespesas, fetchMovimentacoes, fetchResumo]
    );

    const handleSalvarAjuste = useCallback(
        async (data: { tipo: "entrada" | "saida"; descricao: string; valor: number; data: string; motivo: string }) => {
            setIsLoading(true);
            try {
                await registrarAjuste({ tipo: data.tipo, valor: data.valor, data: data.data, descricao: data.descricao, entrada: data.tipo === "entrada" });
                await fetchMovimentacoes();
                await fetchResumo();
                // Atualizar também as listas de entradas e despesas para incluir o ajuste
                await fetchEntradas();
                await fetchDespesas();
                setIsAjusteModalOpen(false);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchMovimentacoes, fetchResumo, fetchEntradas, fetchDespesas]
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-xl bg-primary-light-3 dark:bg-primary-dark-3 p-2.5">
                            <DollarSign className="h-6 w-6 text-primary-light-11 dark:text-primary-dark-9" />
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary-light dark:text-white">Financeiro</h1>
                    </div>
                    <p className="text-text-secondary-light dark:text-white/60">
                        Visão completa de entradas, despesas e fluxo de caixa
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setIsEntradaModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Entrada</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsDespesaModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Despesa</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsAjusteModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl border border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 px-4 py-2.5 font-medium text-text-primary-light dark:text-white transition-all hover:bg-mauve-light-3 dark:hover:bg-white/10 active:scale-95"
                    >
                        <Settings2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Ajuste</span>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl border border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5 px-4 py-2.5 font-medium text-text-primary-light dark:text-white transition-all hover:bg-mauve-light-3 dark:hover:bg-white/10 active:scale-95"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Saldo Atual */}
                <div className="rounded-2xl border border-primary-light-6 dark:border-primary-dark-6 bg-primary-light-2 dark:bg-primary-dark-2 p-4">
                    <p className="text-sm font-medium text-primary-light-11 dark:text-primary-dark-9">Saldo Atual</p>
                    <p className="mt-2 text-3xl font-bold text-text-primary-light dark:text-white">
                        R$ {((resumo && resumo.saldoAtual) || 0).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary-light dark:text-white/60">em caixa</p>
                </div>

                {/* Receitas do Mês */}
                <div className="rounded-2xl border border-green-600/30 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 p-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">Receitas</p>
                        <TrendingUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-text-primary-light dark:text-white">
                        R$ {totalEntradas.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary-light dark:text-white/60">novembro</p>
                </div>

                {/* Despesas do Mês */}
                <div className="rounded-2xl border border-red-600/30 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">Despesas</p>
                        <TrendingDown className="h-4 w-4 text-red-700 dark:text-red-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-text-primary-light dark:text-white">
                        R$ {totalDespesas.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary-light dark:text-white/60">novembro</p>
                </div>

                {/* Lucro */}
                <div className={`rounded-2xl border-2 p-4 ${((resumo && resumo.lucro) || 0) >= 0 ? "border-green-600/30 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10" : "border-red-600/30 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"}`}>
                    <p
                        className={`text-sm font-medium ${((resumo && resumo.lucro) || 0) >= 0
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                            }`}
                    >
                        Lucro/Prejuízo
                    </p>
                    <p
                        className={`mt-2 text-3xl font-bold ${((resumo && resumo.lucro) || 0) >= 0
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                            }`}
                    >
                        R$ {Math.abs(((resumo && resumo.lucro) || 0)).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary-light dark:text-white/60">
                        {((resumo && resumo.lucro) || 0) >= 0 ? "lucro" : "prejuízo"}
                    </p>
                </div>
            </div>

            {/* Alerts */}
            {(() => {
                const lucro = resumo?.lucro !== undefined ? resumo.lucro : (totalEntradas - totalDespesas);
                return lucro < 0;
            })() && (
                <div className="flex items-start gap-3 rounded-xl border border-yellow-600/30 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-700 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-yellow-700 dark:text-yellow-400">Atenção</p>
                        <p className="text-text-secondary-light dark:text-white/70">
                            Despesas excedem receitas este mês. Considere revisar gastos.
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-mauve-light-6 dark:border-white/10 pb-px">
                {(["extrato", "entradas", "despesas", "dre", "resumo"] as const).map(
                    (tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all ${activeTab === tab
                                ? "border-b-2 border-primary-light-11 dark:border-primary-dark-9 text-primary-light-11 dark:text-primary-dark-9"
                                : "text-text-secondary-light dark:text-white/70 hover:text-text-primary-light dark:hover:text-white"
                                }`}
                        >
                            {tab === "extrato" && "📝 Extrato"}
                            {tab === "entradas" && "📈 Entradas"}
                            {tab === "despesas" && "📉 Despesas"}
                            {tab === "dre" && "📋 DRE"}
                            {tab === "resumo" && "📊 Resumo"}
                        </button>
                    )
                )}
            </div>

            {/* Tab Content */}
            <div className="animate-fadeIn">
                {activeTab === "resumo" && (
                    <FinanceiroResumo
                        entradas={entradas}
                        despesas={despesas}
                        resumo={resumo || { saldoAtual: 0, receitasMes: totalEntradas, despesasMes: totalDespesas, lucro: totalEntradas - totalDespesas }}
                        graficos={{
                            receitasVsDespesas: [],
                            receitasPorTipo: [],
                            despesasPorTipo: [],
                        }}
                    />
                )}

                {activeTab === "extrato" && (
                    <div className="space-y-4">
                        {/* Filtros */}
                        <div className="rounded-xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                                        Tipo
                                    </label>
                                    <select
                                        value={filtroExtratoTipo}
                                        onChange={(e) => {
                                            setFiltroExtratoTipo(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-[#1a1523] px-3 py-2 text-text-primary-light dark:text-white transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-[#1a1523] focus:outline-none"
                                    >
                                        <option className="bg-white dark:bg-[#1a1523] text-text-primary-light dark:text-white" value="">Todos</option>
                                        <option className="bg-white dark:bg-[#1a1523] text-text-primary-light dark:text-white" value="entrada">Entradas</option>
                                        <option className="bg-white dark:bg-[#1a1523] text-text-primary-light dark:text-white" value="saida">Saídas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                                        Data Início
                                    </label>
                                    <input
                                        type="date"
                                        value={filtroDataInicio}
                                        onChange={(e) => {
                                            setFiltroDataInicio(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-text-primary-light dark:text-white transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-white/10 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary-light dark:text-white">
                                        Data Fim
                                    </label>
                                    <input
                                        type="date"
                                        value={filtroDataFim}
                                        onChange={(e) => {
                                            setFiltroDataFim(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-lg border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-text-primary-light dark:text-white transition-colors focus:border-primary-light-6 dark:focus:border-primary-dark-6 focus:bg-mauve-light-2 dark:focus:bg-white/10 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabela */}
                        <ExtratoTable
                            movimentacoes={filteredMovimentacoes}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}

                {activeTab === "entradas" && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-green-600/30 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 p-4">
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                Total de Entradas
                            </p>
                            <p className="mt-2 text-3xl font-bold text-text-primary-light dark:text-white">
                                R$ {totalEntradas.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Valor
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Data
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Usuário
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entradas.map((e, idx) => (
                                            <tr
                                                key={e.id}
                                                className={`border-t border-mauve-light-6 dark:border-white/5 hover:bg-mauve-light-2 dark:hover:bg-white/10 ${idx % 2 === 0 ? "bg-transparent" : "bg-mauve-light-1 dark:bg-white/[0.02]"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-text-primary-light dark:text-white">{e.tipo}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-green-700 dark:text-green-400">
                                                    +R$ {e.valor.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-white/70">
                                                    {new Date(e.data).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-white/70">
                                                    {e.usuarioId}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "despesas" && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-red-600/30 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4">
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                Total de Despesas
                            </p>
                            <p className="mt-2 text-3xl font-bold text-text-primary-light dark:text-white">
                                R$ {totalDespesas.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Descrição
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Valor
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Data
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary-light dark:text-white/70">
                                                Usuário
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {despesas.map((d, idx) => (
                                            <tr
                                                key={d.id}
                                                className={`border-t border-mauve-light-6 dark:border-white/5 hover:bg-mauve-light-2 dark:hover:bg-white/10 ${idx % 2 === 0 ? "bg-transparent" : "bg-mauve-light-1 dark:bg-white/[0.02]"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-text-primary-light dark:text-white">{d.tipo}</td>
                                                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-white/70">
                                                    {d.descricao || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-red-700 dark:text-red-400">
                                                    -R$ {d.valor.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-white/70">
                                                    {new Date(d.data).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary-light dark:text-white/70">
                                                    {d.usuarioId}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "dre" && (
                    <ResumoDRE
                        receitas={{
                            vendas: totalEntradas * 0.67,
                            entradas: totalEntradas * 0.33,
                        }}
                        despesas={{
                            compras: totalDespesas * 0.6,
                            gerais: totalDespesas * 0.3,
                            ajustes: totalDespesas * 0.1,
                        }}
                        mesAnterior={{ lucro: 1500 }}
                    />
                )}
            </div>

            {/* Modals */}
            <FinanceiroEntradaModal
                isOpen={isEntradaModalOpen}
                onClose={() => setIsEntradaModalOpen(false)}
                onSave={handleSalvarEntrada}
                isLoading={isLoading}
            />

            <FinanceiroDespesaModal
                isOpen={isDespesaModalOpen}
                onClose={() => setIsDespesaModalOpen(false)}
                onSave={handleSalvarDespesa}
                isLoading={isLoading}
            />

            <AjusteManualModal
                isOpen={isAjusteModalOpen}
                onClose={() => setIsAjusteModalOpen(false)}
                onRegistrar={handleSalvarAjuste}
                isLoading={isLoading}
            />
        </div>
    );
}
