import { useState, useMemo, useCallback } from "react";
import { TrendingUp, Plus, RefreshCw, Calendar } from "lucide-react";
import type { Venda } from "../mocks/vendasMock";
import { vendasMock } from "../mocks/vendasMock";
import VendaModal from "../components/vendas/VendaModal";
import VendaList from "../components/vendas/VendaList";
import VendaCard from "../components/vendas/VendaCard";

type PeriodoFiltro = "hoje" | "semana" | "mes" | "todos";

export default function Vendas() {
    const [vendas, setVendas] = useState<Venda[]>(vendasMock);
    const [isNovaVendaOpen, setIsNovaVendaOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVendaId, setSelectedVendaId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroFormaPagamento, setFiltroFormaPagamento] = useState<string>("");
    const [filtroPeriodo, setFiltroPeriodo] = useState<PeriodoFiltro>("todos");

    // Filter logic
    const filteredVendas = useMemo(() => {
        let result = [...vendas];

        // Search by ID or text
        if (searchTerm) {
            result = result.filter((v) =>
                v.id.toString().includes(searchTerm) ||
                v.observacao?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by payment method
        if (filtroFormaPagamento) {
            result = result.filter((v) => v.formaPagamento === filtroFormaPagamento);
        }

        // Filter by period
        if (filtroPeriodo !== "todos") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter((v) => {
                const vendaDate = new Date(v.data + "T00:00:00");

                if (filtroPeriodo === "hoje") {
                    return vendaDate.toDateString() === today.toDateString();
                } else if (filtroPeriodo === "semana") {
                    const oneWeekAgo = new Date(today);
                    oneWeekAgo.setDate(today.getDate() - 7);
                    return vendaDate >= oneWeekAgo && vendaDate <= today;
                } else if (filtroPeriodo === "mes") {
                    const oneMonthAgo = new Date(today);
                    oneMonthAgo.setMonth(today.getMonth() - 1);
                    return vendaDate >= oneMonthAgo && vendaDate <= today;
                }
                return true;
            });
        }

        // Sort by date descending
        result.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        return result;
    }, [vendas, searchTerm, filtroFormaPagamento, filtroPeriodo]);

    const handleNovaVenda = useCallback(
        async (venda: {
            formaPagamento: string;
            itens: any[];
            observacao: string;
        }) => {
            setIsLoading(true);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const novaVenda: Venda = {
                id: Math.max(...vendas.map((v) => v.id)) + 1,
                data: new Date().toISOString().split("T")[0],
                formaPagamento: venda.formaPagamento as Venda["formaPagamento"],
                itens: venda.itens,
                observacao: venda.observacao,
                total: venda.itens.reduce((sum: number, item: any) => sum + item.subtotal, 0),
            };

            console.log("📊 Nova venda registrada:", novaVenda);
            setVendas([novaVenda, ...vendas]);
            setIsNovaVendaOpen(false);
            setIsLoading(false);
        },
        [vendas]
    );

    const handleViewDetails = useCallback((venda: Venda) => {
        setSelectedVendaId(venda.id);
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedVendaId(null), 300);
    }, []);

    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setVendas([...vendasMock]);
            setIsLoading(false);
        }, 500);
    }, []);

    const totalVendas = filteredVendas.length;
    const totalValor = filteredVendas.reduce((sum, v) => sum + v.total, 0);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/20 p-2.5">
                            <TrendingUp className="h-6 w-6 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Vendas</h1>
                    </div>
                    <p className="text-white/60">Gerencie e registre suas vendas</p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Atualizar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsNovaVendaOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nova Venda</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white/70">Total de Vendas</p>
                    <p className="text-3xl font-bold text-white">{totalVendas}</p>
                    <p className="mt-2 text-xs text-white/50">neste período</p>
                </div>

                <div className="rounded-2xl border border-green-600/30 bg-gradient-to-br from-green-600/10 to-green-700/5 p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white/70">Total Arrecadado</p>
                    <p className="text-3xl font-bold text-green-400">
                        R$ {totalValor.toFixed(2)}
                    </p>
                    <p className="mt-2 text-xs text-white/50">período selecionado</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="grid gap-3 sm:grid-cols-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Buscar por ID ou observação..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/50 transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                    />

                    {/* Payment Method Filter */}
                    <select
                        value={filtroFormaPagamento}
                        onChange={(e) => setFiltroFormaPagamento(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                    >
                        <option value="">Todas as formas</option>
                        <option value="dinheiro">💵 Dinheiro</option>
                        <option value="pix">📱 Pix</option>
                        <option value="débito">🏧 Débito</option>
                        <option value="crédito">💳 Crédito</option>
                        <option value="fiado">📝 Fiado</option>
                    </select>

                    {/* Period Filter */}
                    <select
                        value={filtroPeriodo}
                        onChange={(e) => setFiltroPeriodo(e.target.value as PeriodoFiltro)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                    >
                        <option value="todos">📅 Todos os períodos</option>
                        <option value="hoje">Hoje</option>
                        <option value="semana">Última semana</option>
                        <option value="mes">Último mês</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {filteredVendas.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
                    <div className="rounded-full bg-white/10 p-4">
                        <Calendar className="h-8 w-8 text-white/40" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Nenhuma venda encontrada
                        </h3>
                        <p className="mt-1 text-sm text-white/60">
                            Tente ajustar seus filtros
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Grid view (Mobile) */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                        {filteredVendas.map((venda) => (
                            <VendaCard
                                key={venda.id}
                                venda={venda}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>

                    {/* Table view (Desktop) */}
                    <div className="hidden lg:block">
                        <VendaList
                            vendas={filteredVendas}
                            onSelectVenda={handleViewDetails}
                            selectedId={selectedVendaId || undefined}
                            isDrawerOpen={isDrawerOpen}
                            onCloseDrawer={handleCloseDrawer}
                        />
                    </div>

                    {/* Mobile Drawer */}
                    <div className="lg:hidden">
                        <VendaList
                            vendas={filteredVendas}
                            onSelectVenda={handleViewDetails}
                            selectedId={selectedVendaId || undefined}
                            isDrawerOpen={isDrawerOpen}
                            onCloseDrawer={handleCloseDrawer}
                        />
                    </div>
                </>
            )}

            {/* Modal */}
            <VendaModal
                isOpen={isNovaVendaOpen}
                onClose={() => setIsNovaVendaOpen(false)}
                onRegistrar={handleNovaVenda}
                isLoading={isLoading}
            />
        </div>
    );
}
