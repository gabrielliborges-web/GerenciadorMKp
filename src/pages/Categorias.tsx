import { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";

import CategoriaFilters from "../components/categorias/CategoriaFilters";
import CategoriaCard from "../components/categorias/CategoriaCard";
import CategoriaTable from "../components/categorias/CategoriaTable";
import CategoriaModal from "../components/categorias/CategoriaModal";
import CategoriaDrawer from "../components/categorias/CategoriaDrawer";
import CategoriaEmptyState from "../components/categorias/CategoriaEmptyState";
import ConfirmModal from "../components/common/ConfirmModal";
import { categoriasMock, type Categoria } from "../mocks/categoriasMock";

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>(categoriasMock);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | "ativas" | "inativas">("todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; categoriaId: number | null }>({
        isOpen: false,
        categoriaId: null,
    });

    // Filtered categories
    const filteredCategorias = useMemo(() => {
        return categorias.filter((categoria) => {
            // Search filter
            const matchesSearch =
                categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                categoria.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus =
                statusFilter === "todos" ||
                (statusFilter === "ativas" && categoria.ativo) ||
                (statusFilter === "inativas" && !categoria.ativo);

            return matchesSearch && matchesStatus;
        });
    }, [categorias, searchTerm, statusFilter]);

    // Selected categoria for drawer
    const selectedCategoria = useMemo(
        () => categorias.find((c) => c.id === selectedCategoriaId) || null,
        [categorias, selectedCategoriaId]
    );

    // Handle create
    const handleCreateCategoria = () => {
        setEditingCategoria(null);
        setIsModalOpen(true);
    };

    // Handle edit
    const handleEditCategoria = (id: number) => {
        const categoria = categorias.find((c) => c.id === id);
        if (categoria) {
            setEditingCategoria(categoria);
            setIsModalOpen(true);
        }
    };

    // Handle save (create/update)
    const handleSaveCategoria = async (
        data: Omit<Categoria, "id" | "dataCriacao" | "dataAtualizacao">
    ) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (editingCategoria) {
                // Update existing
                setCategorias((prev) =>
                    prev.map((c) =>
                        c.id === editingCategoria.id
                            ? {
                                ...c,
                                ...data,
                                dataAtualizacao: new Date().toISOString(),
                            }
                            : c
                    )
                );
                console.log("✅ Categoria atualizada:", editingCategoria.id);
            } else {
                // Create new
                const newCategoria: Categoria = {
                    id: Math.max(...categorias.map((c) => c.id), 0) + 1,
                    ...data,
                    dataCriacao: new Date().toISOString(),
                    dataAtualizacao: new Date().toISOString(),
                };
                setCategorias((prev) => [...prev, newCategoria]);
                console.log("✅ Categoria criada:", newCategoria.id);
            }

            setIsModalOpen(false);
            setEditingCategoria(null);
        } catch (error) {
            console.error("❌ Erro ao salvar categoria:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete
    const handleDeleteCategoria = (id: number) => {
        setConfirmDelete({ isOpen: true, categoriaId: id });
    };

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (confirmDelete.categoriaId !== null) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setCategorias((prev) => prev.filter((c) => c.id !== confirmDelete.categoriaId));
                console.log("✅ Categoria excluída:", confirmDelete.categoriaId);
                setConfirmDelete({ isOpen: false, categoriaId: null });
                setIsLoading(false);
            }, 500);
        }
    };

    // Handle details
    const handleDetailsCategoria = (id: number) => {
        setSelectedCategoriaId(id);
        setIsDrawerOpen(true);
    };

    // Handle refresh
    const handleRefresh = () => {
        setCategorias(categoriasMock);
        setSearchTerm("");
        setStatusFilter("todos");
        console.log("🔄 Categorias recarregadas");
    };

    return (
        <div className="min-h-screen p-2 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white lg:text-4xl">Categorias</h1>
                    <p className="mt-2 text-white/60">
                        {filteredCategorias.length} categoria{filteredCategorias.length !== 1 ? "s" : ""}{" "}
                        encontrada{filteredCategorias.length !== 1 ? "s" : ""}
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
                        onClick={handleCreateCategoria}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nova Categoria</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
                <CategoriaFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={(value: string) =>
                        setStatusFilter(value as "todos" | "ativas" | "inativas")
                    }
                />
            </div>

            {/* Content */}
            {filteredCategorias.length === 0 ? (
                <CategoriaEmptyState onCreateClick={handleCreateCategoria} />
            ) : (
                <>
                    {/* Grid (Mobile/Tablet) */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:hidden">
                        {filteredCategorias.map((categoria) => (
                            <CategoriaCard
                                key={categoria.id}
                                categoria={categoria}
                                onEdit={() => handleEditCategoria(categoria.id)}
                                onDelete={() => handleDeleteCategoria(categoria.id)}
                                onDetails={() => handleDetailsCategoria(categoria.id)}
                            />
                        ))}
                    </div>

                    {/* Table (Desktop) */}
                    <CategoriaTable
                        categorias={filteredCategorias}
                        onEdit={handleEditCategoria}
                        onDelete={handleDeleteCategoria}
                        onDetails={handleDetailsCategoria}
                    />
                </>
            )}

            {/* Modal */}
            <CategoriaModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCategoria(null);
                }}
                onSave={handleSaveCategoria}
                initialData={editingCategoria || undefined}
                isLoading={isLoading}
            />

            {/* Drawer */}
            <CategoriaDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                categoria={selectedCategoria}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Excluir Categoria"
                message="Tem certeza que deseja excluir essa categoria? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, categoriaId: null })}
            />
        </div>
    );
}
