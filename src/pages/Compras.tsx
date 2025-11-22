import { useState, useMemo, useCallback } from "react";
import { Plus, RefreshCw, ShoppingCart } from "lucide-react";
import ComprasFilters from "../components/compras/ComprasFilters";
import ComprasTable from "../components/compras/ComprasTable";
import CompraDetailsDrawer from "../components/compras/CompraDetailsDrawer";
import NovaCompraModal from "../components/compras/NovaCompraModal";
import ConfirmModal from "../components/common/ConfirmModal";
import {
    mockCompras,
    mockProdutosCompra,
    mockUsuarios,
    type CompraMock,
} from "../mocks/comprasMock";

export default function Compras() {
    const [compras, setCompras] = useState<CompraMock[]>(mockCompras);
    const [filtroFornecedor, setFiltroFornecedor] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [usuarioId, setUsuarioId] = useState("");

    const [isNovaCompraOpen, setIsNovaCompraOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCompraId, setSelectedCompraId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{
        isOpen: boolean;
        compraId: number | null;
    }>({
        isOpen: false,
        compraId: null,
    });

    // Filtered compras
    const filteredCompras = useMemo(() => {
        return compras.filter((compra) => {
            // Filtro fornecedor
            const matchesFornecedor =
                !filtroFornecedor ||
                (compra.fornecedor || "")
                    .toLowerCase()
                    .includes(filtroFornecedor.toLowerCase());

            // Filtro data
            let matchesData = true;
            if (dataInicio || dataFim) {
                const compraDate = new Date(compra.data);
                if (dataInicio) {
                    const inicio = new Date(dataInicio);
                    matchesData = matchesData && compraDate >= inicio;
                }
                if (dataFim) {
                    const fim = new Date(dataFim);
                    fim.setHours(23, 59, 59, 999);
                    matchesData = matchesData && compraDate <= fim;
                }
            }

            // Filtro usuário
            const matchesUsuario =
                !usuarioId || compra.usuarioNome === mockUsuarios.find((u) => u.id === Number(usuarioId))?.nome;

            return matchesFornecedor && matchesData && matchesUsuario;
        });
    }, [compras, filtroFornecedor, dataInicio, dataFim, usuarioId]);

    // Selected compra for drawer
    const selectedCompra = useMemo(
        () => compras.find((c) => c.id === selectedCompraId) || null,
        [compras, selectedCompraId]
    );

    // Handle nova compra
    const handleNovaCompra = useCallback(() => {
        setIsNovaCompraOpen(true);
    }, []);

    // Handle salvar nova compra
    const handleSalvarCompra = useCallback(
        async (novaCompra: Omit<CompraMock, "id">) => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));

                const compraComId: CompraMock = {
                    id: Math.max(...compras.map((c) => c.id), 0) + 1,
                    ...novaCompra,
                };

                setCompras((prev) => [...prev, compraComId]);
                setIsNovaCompraOpen(false);
                console.log("✅ Compra criada:", compraComId.id);
            } catch (error) {
                console.error("❌ Erro ao salvar compra:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [compras]
    );

    // Handle detalhes
    const handleDetalhes = useCallback((id: number) => {
        setSelectedCompraId(id);
        setIsDrawerOpen(true);
    }, []);

    // Handle delete
    const handleDelete = useCallback((id: number) => {
        setConfirmDelete({ isOpen: true, compraId: id });
    }, []);

    // Handle confirm delete
    const handleConfirmDelete = useCallback(() => {
        if (confirmDelete.compraId !== null) {
            setIsLoading(true);
            setTimeout(() => {
                setCompras((prev) => prev.filter((c) => c.id !== confirmDelete.compraId));
                console.log("✅ Compra excluída:", confirmDelete.compraId);
                setConfirmDelete({ isOpen: false, compraId: null });
                setIsLoading(false);
            }, 500);
        }
    }, [confirmDelete.compraId]);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        setCompras(mockCompras);
        setFiltroFornecedor("");
        setDataInicio("");
        setDataFim("");
        setUsuarioId("");
        console.log("🔄 Compras recarregadas");
    }, []);

    // Handle limpar filtros
    const handleLimparFiltros = useCallback(() => {
        setFiltroFornecedor("");
        setDataInicio("");
        setDataFim("");
        setUsuarioId("");
    }, []);

    return (
        <div className="min-h-screen p-2 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white lg:text-4xl">Compras</h1>
                    <p className="mt-2 text-white/60">
                        {filteredCompras.length} compra{filteredCompras.length !== 1 ? "s" : ""}{" "}
                        encontrada{filteredCompras.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-semibold text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-white"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Recarregar</span>
                    </button>
                    <button
                        onClick={handleNovaCompra}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nova Compra</span>
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-8">
                <ComprasFilters
                    fornecedor={filtroFornecedor}
                    onFornecedorChange={setFiltroFornecedor}
                    dataInicio={dataInicio}
                    onDataInicioChange={setDataInicio}
                    dataFim={dataFim}
                    onDataFimChange={setDataFim}
                    usuarioId={usuarioId}
                    onUsuarioChange={setUsuarioId}
                    usuarios={mockUsuarios}
                    onLimparFiltros={handleLimparFiltros}
                />
            </div>

            {/* Conteúdo */}
            {filteredCompras.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                    <div className="mx-auto mb-4 inline-flex rounded-full bg-primary-500/20 p-4">
                        <ShoppingCart className="h-8 w-8 text-primary-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">Nenhuma compra encontrada</p>
                    <p className="mt-2 text-white/60">
                        Tente ajustar os filtros ou adicionar uma nova compra
                    </p>
                    <button
                        onClick={handleNovaCompra}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Compra
                    </button>
                </div>
            ) : (
                <>
                    {/* Grid Mobile */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:hidden">
                        {filteredCompras.map((compra) => (
                            <div
                                key={compra.id}
                                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-white/60">Fornecedor</p>
                                        <p className="font-semibold text-white">{compra.fornecedor || "-"}</p>
                                    </div>
                                    <p className="text-right">
                                        <p className="text-xs text-white/60">Total</p>
                                        <p className="font-bold text-primary-400">
                                            R$ {compra.total.toFixed(2)}
                                        </p>
                                    </p>
                                </div>
                                <div className="mb-3 space-y-1 text-sm">
                                    <p className="text-white/80">
                                        <span className="text-white/60">Data:</span> {new Date(compra.data).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p className="text-white/80">
                                        <span className="text-white/60">Usuário:</span> {compra.usuarioNome}
                                    </p>
                                    <p className="text-white/80">
                                        <span className="text-white/60">Itens:</span> {compra.itens.length}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDetalhes(compra.id)}
                                        className="flex-1 rounded-lg bg-primary-600/20 py-2 text-sm font-semibold text-primary-400 transition-all duration-300 hover:bg-primary-600/30"
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={() => handleDelete(compra.id)}
                                        className="flex-1 rounded-lg bg-red-500/20 py-2 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/30"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabela Desktop */}
                    <ComprasTable
                        compras={filteredCompras}
                        onDetails={handleDetalhes}
                        onDelete={handleDelete}
                    />
                </>
            )}

            {/* Modal Nova Compra */}
            <NovaCompraModal
                isOpen={isNovaCompraOpen}
                onClose={() => setIsNovaCompraOpen(false)}
                onSave={handleSalvarCompra}
                produtos={mockProdutosCompra}
                isLoading={isLoading}
            />

            {/* Drawer Detalhes */}
            <CompraDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                compra={selectedCompra}
            />

            {/* Modal Confirmação Delete */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Excluir Compra"
                message="Tem certeza que deseja excluir essa compra? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, compraId: null })}
            />
        </div>
    );
}
