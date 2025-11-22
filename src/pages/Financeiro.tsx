import { useState, useCallback } from "react";
import { Plus, DollarSign } from "lucide-react";
import FinanceiroResumo from "../components/financeiro/FinanceiroResumo";
import FinanceiroExtrato from "../components/financeiro/FinanceiroExtrato";
import FinanceiroEntradas from "../components/financeiro/FinanceiroEntradas";
import FinanceiroDespesas from "../components/financeiro/FinanceiroDespesas";
import FinanceiroEntradaModal from "../components/financeiro/FinanceiroEntradaModal";
import FinanceiroDespesaModal from "../components/financeiro/FinanceiroDespesaModal";
import ConfirmModal from "../components/common/ConfirmModal";

type TabType = "resumo" | "extrato" | "entradas" | "despesas";

export default function FinanceiroPage() {
    const [activeTab, setActiveTab] = useState<TabType>("resumo");
    const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
    const [isDespesaModalOpen, setIsDespesaModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{
        isOpen: boolean;
        id: number | null;
        tipo: "entrada" | "despesa" | null;
    }>({
        isOpen: false,
        id: null,
        tipo: null,
    });

    const handleSalvarEntrada = useCallback(async (data: any) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("✅ Entrada criada:", data);
            setIsEntradaModalOpen(false);
        } catch (error) {
            console.error("❌ Erro ao salvar entrada:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSalvarDespesa = useCallback(async (data: any) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("✅ Despesa criada:", data);
            setIsDespesaModalOpen(false);
        } catch (error) {
            console.error("❌ Erro ao salvar despesa:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleDeleteEntrada = useCallback((id: number) => {
        setConfirmDelete({ isOpen: true, id, tipo: "entrada" });
    }, []);

    const handleDeleteDespesa = useCallback((id: number) => {
        setConfirmDelete({ isOpen: true, id, tipo: "despesa" });
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (confirmDelete.id && confirmDelete.tipo) {
            setIsLoading(true);
            setTimeout(() => {
                console.log(`✅ ${confirmDelete.tipo} #${confirmDelete.id} excluída`);
                setConfirmDelete({ isOpen: false, id: null, tipo: null });
                setIsLoading(false);
            }, 500);
        }
    }, [confirmDelete]);

    const tabs = [
        { id: "resumo", label: "Resumo" },
        { id: "extrato", label: "Extrato" },
        { id: "entradas", label: "Entradas" },
        { id: "despesas", label: "Despesas" },
    ];

    return (
        <div className="min-h-screen p-2 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white lg:text-4xl">Financeiro</h1>
                        <DollarSign className="h-8 w-8 text-primary-400" />
                    </div>
                    <p className="mt-2 text-white/60">Visão geral, extrato, entradas e despesas</p>
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                    <button
                        onClick={() => setIsEntradaModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">+ Entrada</span>
                    </button>
                    <button
                        onClick={() => setIsDespesaModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">+ Despesa</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex-1 rounded-lg px-4 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-500/50"
                            : "text-white/70 hover:text-white"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fadeIn">
                {activeTab === "resumo" && <FinanceiroResumo />}
                {activeTab === "extrato" && <FinanceiroExtrato />}
                {activeTab === "entradas" && (
                    <FinanceiroEntradas
                        onDelete={handleDeleteEntrada}
                    />
                )}
                {activeTab === "despesas" && (
                    <FinanceiroDespesas
                        onDelete={handleDeleteDespesa}
                    />
                )}
            </div>

            {/* Modais */}
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

            {/* Modal de Confirmação */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title={`Excluir ${confirmDelete.tipo === "entrada" ? "Entrada" : "Despesa"}`}
                message={`Tem certeza que deseja excluir esta ${confirmDelete.tipo}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null, tipo: null })}
            />
        </div>
    );
}
