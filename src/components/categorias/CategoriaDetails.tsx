import { X, Calendar, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { listProdutos } from "../../lib/produto";
import type { Categoria } from "../../mocks/categoriasMock";

interface CategoriaDetailsProps {
    categoria: Categoria | null;
    onClose: () => void;
}

interface ProdutoSimples {
    id: number;
    nome: string;
    estoque: number;
}

export default function CategoriaDetails({
    categoria,
    onClose,
}: CategoriaDetailsProps) {
    const [produtos, setProdutos] = useState<ProdutoSimples[]>([]);
    const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);

    useEffect(() => {
        if (categoria?.id) {
            loadProdutos();
        }
    }, [categoria?.id]);

    const loadProdutos = async () => {
        if (!categoria?.id) return;
        
        setIsLoadingProdutos(true);
        try {
            const produtosData = await listProdutos({ categoriaId: categoria.id });
            setProdutos(produtosData.map(p => ({
                id: p.id,
                nome: p.nome,
                estoque: p.estoque
            })));
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            setProdutos([]);
        } finally {
            setIsLoadingProdutos(false);
        }
    };

    if (!categoria) return null;

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "-";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(date));
        } catch {
            return String(date);
        }
    };

    return (
        <div className="mb-8 rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-mauve-light-6 dark:border-white/10 bg-mauve-light-2 dark:bg-white/5">
                <h2 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-white">Detalhes da Categoria</h2>
                <button
                    onClick={onClose}
                    className="rounded-lg p-2 transition-all duration-300 hover:bg-mauve-light-3 dark:hover:bg-white/10 flex-shrink-0"
                >
                    <X className="h-5 w-5 text-text-secondary-light dark:text-white/60" />
                </button>
            </div>

            <div className="p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary-light-3 dark:from-rose-500/10 to-primary-light-2 dark:to-rose-600/5 flex items-center justify-center">
                            <div className="text-6xl">
                                📦
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                Nome
                            </p>
                            <p className="mt-2 text-xl sm:text-2xl font-bold text-text-primary-light dark:text-white break-words">
                                {categoria.nome}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoria.ativo
                                    ? "bg-green-100 dark:bg-rose-500/20 text-green-700 dark:text-rose-400"
                                    : "bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {categoria.ativo ? "Ativa" : "Inativa"}
                            </span>
                        </div>

                        {categoria.descricao && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                    Descrição
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-text-secondary-light dark:text-white/80 break-words">
                                    {categoria.descricao}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl p-4 bg-gradient-to-br from-primary-light-3 dark:from-rose-500/10 to-primary-light-2 dark:to-rose-600/5">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-primary-light-9 dark:text-rose-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                        Quantidade de Produtos
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-text-primary-light dark:text-white">
                                        {categoria.produtosCount || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60 mb-3">
                                Produtos
                            </p>
                            {isLoadingProdutos ? (
                                <p className="text-sm text-text-secondary-light dark:text-white/60">Carregando...</p>
                            ) : produtos.length > 0 ? (
                                <div className="space-y-2">
                                    {produtos.map((produto) => (
                                        <div
                                            key={produto.id}
                                            className="flex items-center justify-between rounded-lg px-3 py-2 bg-mauve-light-2 dark:bg-white/5 border border-mauve-light-6 dark:border-white/10"
                                        >
                                            <span className="text-sm font-medium text-text-primary-light dark:text-white">
                                                {produto.nome}
                                            </span>
                                            <span className="text-xs font-semibold text-text-secondary-light dark:text-white/60">
                                                Qtd: {produto.estoque}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-text-secondary-light dark:text-white/60">Nenhum produto encontrado</p>
                            )}
                        </div>

                        <div className="space-y-4 border-t border-mauve-light-6 dark:border-white/10 pt-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light-9 dark:text-rose-400/60" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/50">
                                        Data de Criação
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary-light dark:text-white/70 break-words">
                                        {formatDate((categoria as any).dataCriacao || (categoria as any).criadoEm)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-light-9 dark:text-rose-400/60" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-white/60">
                                        Última Atualização
                                    </p>
                                    <p className="mt-1 text-sm text-text-secondary-light dark:text-white/80 break-words">
                                        {formatDate((categoria as any).dataAtualizacao || (categoria as any).atualizadoEm)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

