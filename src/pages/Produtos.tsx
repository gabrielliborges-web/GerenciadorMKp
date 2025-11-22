import { useState, useMemo, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";

import ProdutoFilters from "../components/produtos/ProdutoFilters";
import ProdutoCard from "../components/produtos/ProdutoCard";
import ProdutoList from "../components/produtos/ProdutoList";
import ProdutoFormModal from "../components/produtos/ProdutoFormModal";
import ProdutoDetailsDrawer from "../components/produtos/ProdutoDetailsDrawer";
import ProdutoEmpty from "../components/produtos/ProdutoEmpty";
import ConfirmModal from "../components/common/ConfirmModal";
import { produtosMock, categoriasMockProdutos, type Produto } from "../mocks/produtosMock";

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>(produtosMock);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | "ativos" | "inativos">("todos");
    const [categoriaFilter, setCategoriaFilter] = useState<number | null>(null);
    const [ordenacao, setOrdenacao] = useState<"nome" | "preco" | "estoque">("nome");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; produtoId: number | null }>({
        isOpen: false,
        produtoId: null,
    });

    // Filtered and sorted produtos
    const filteredProdutos = useMemo(() => {
        let result = produtos.filter((produto) => {
            // Search filter
            const matchesSearch =
                produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus =
                statusFilter === "todos" ||
                (statusFilter === "ativos" && produto.ativo) ||
                (statusFilter === "inativos" && !produto.ativo);

            // Category filter
            const matchesCategoria =
                !categoriaFilter || produto.categoriaId === categoriaFilter;

            return matchesSearch && matchesStatus && matchesCategoria;
        });

        // Sorting
        result = result.sort((a, b) => {
            switch (ordenacao) {
                case "nome":
                    return a.nome.localeCompare(b.nome);
                case "preco":
                    return a.precoVenda - b.precoVenda;
                case "estoque":
                    return b.estoque - a.estoque;
                default:
                    return 0;
            }
        });

        return result;
    }, [produtos, searchTerm, statusFilter, categoriaFilter, ordenacao]);

    // Selected produto for drawer
    const selectedProduto = useMemo(
        () => produtos.find((p) => p.id === selectedProdutoId) || null,
        [produtos, selectedProdutoId]
    );

    // Handle create
    const handleCreateProduto = useCallback(() => {
        setEditingProduto(null);
        setIsModalOpen(true);
    }, []);

    // Handle edit
    const handleEditProduto = useCallback((id: number) => {
        const produto = produtos.find((p) => p.id === id);
        if (produto) {
            setEditingProduto(produto);
            setIsModalOpen(true);
        }
    }, [produtos]);

    // Handle save (create/update)
    const handleSaveProduto = useCallback(
        async (data: Omit<Produto, "id" | "criadoEm" | "atualizadoEm">) => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));

                if (editingProduto) {
                    // Update existing
                    setProdutos((prev) =>
                        prev.map((p) =>
                            p.id === editingProduto.id
                                ? {
                                    ...p,
                                    ...data,
                                    atualizadoEm: new Date().toISOString(),
                                }
                                : p
                        )
                    );
                    console.log("✅ Produto atualizado:", editingProduto.id);
                } else {
                    // Create new
                    const newProduto: Produto = {
                        id: Math.max(...produtos.map((p) => p.id), 0) + 1,
                        ...data,
                        criadoEm: new Date().toISOString(),
                        atualizadoEm: new Date().toISOString(),
                    };
                    setProdutos((prev) => [...prev, newProduto]);
                    console.log("✅ Produto criado:", newProduto.id);
                }

                setIsModalOpen(false);
                setEditingProduto(null);
            } catch (error) {
                console.error("❌ Erro ao salvar produto:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [editingProduto, produtos]
    );

    // Handle delete
    const handleDeleteProduto = useCallback((id: number) => {
        setConfirmDelete({ isOpen: true, produtoId: id });
    }, []);

    // Handle confirm delete
    const handleConfirmDelete = useCallback(() => {
        if (confirmDelete.produtoId !== null) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setProdutos((prev) => prev.filter((p) => p.id !== confirmDelete.produtoId));
                console.log("✅ Produto excluído:", confirmDelete.produtoId);
                setConfirmDelete({ isOpen: false, produtoId: null });
                setIsLoading(false);
            }, 500);
        }
    }, [confirmDelete.produtoId]);

    // Handle details
    const handleDetailsProduto = useCallback((id: number) => {
        setSelectedProdutoId(id);
        setIsDrawerOpen(true);
    }, []);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        setProdutos(produtosMock);
        setSearchTerm("");
        setStatusFilter("todos");
        setCategoriaFilter(null);
        setOrdenacao("nome");
        console.log("🔄 Produtos recarregados");
    }, []);

    return (
        <div className="min-h-screen p-2 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white lg:text-4xl">Produtos</h1>
                    <p className="mt-2 text-white/60">
                        {filteredProdutos.length} produto{filteredProdutos.length !== 1 ? "s" : ""}{" "}
                        encontrado{filteredProdutos.length !== 1 ? "s" : ""}
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
                        onClick={handleCreateProduto}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Novo Produto</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
                <ProdutoFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    categoriaFilter={categoriaFilter}
                    onCategoriaChange={setCategoriaFilter}
                    ordenacao={ordenacao}
                    onOrdenacaoChange={setOrdenacao}
                    categorias={categoriasMockProdutos}
                />
            </div>

            {/* Content */}
            {filteredProdutos.length === 0 ? (
                <ProdutoEmpty onCreateClick={handleCreateProduto} />
            ) : (
                <>
                    {/* Grid (Mobile/Tablet) */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:hidden">
                        {filteredProdutos.map((produto) => (
                            <ProdutoCard
                                key={produto.id}
                                produto={produto}
                                onEdit={() => handleEditProduto(produto.id)}
                                onDelete={() => handleDeleteProduto(produto.id)}
                                onDetails={() => handleDetailsProduto(produto.id)}
                            />
                        ))}
                    </div>

                    {/* Table (Desktop) */}
                    <ProdutoList
                        produtos={filteredProdutos}
                        onEdit={handleEditProduto}
                        onDelete={handleDeleteProduto}
                        onDetails={handleDetailsProduto}
                    />
                </>
            )}

            {/* Modal */}
            <ProdutoFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduto(null);
                }}
                onSave={handleSaveProduto}
                initialData={editingProduto || undefined}
                isLoading={isLoading}
                categorias={categoriasMockProdutos}
            />

            {/* Drawer */}
            <ProdutoDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                produto={selectedProduto}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Excluir Produto"
                message="Tem certeza que deseja excluir esse produto? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, produtoId: null })}
            />
        </div>
    );
}
