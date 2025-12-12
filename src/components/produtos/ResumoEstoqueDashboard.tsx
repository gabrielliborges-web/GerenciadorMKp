import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { Produto } from "../../lib/produto";

interface ResumoEstoqueDashboardProps {
    produtos: Produto[];
}

const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ResumoEstoqueDashboard({ produtos }: ResumoEstoqueDashboardProps) {
    const produtosAtivos = useMemo(() => produtos.filter((p) => p.ativo), [produtos]);
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [maxHeight, setMaxHeight] = useState<string>("0px");

    useEffect(() => {
        if (!contentRef.current) return;
        // recalcula quando abrir/fechar ou quando produtos mudam
        setMaxHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }, [open, produtosAtivos.length, produtosAtivos]);

    const totalVenderNormal = useMemo(() => {
        return produtosAtivos.reduce((acc, p) => acc + (p.precoVenda || 0) * (p.estoque || 0), 0);
    }, [produtosAtivos]);

    const totalVenderPromocional = useMemo(() => {
        return produtosAtivos.reduce(
            (acc, p) => acc + ((p.precoPromocional && p.precoPromocional > 0 ? p.precoPromocional : p.precoVenda) || 0) * (p.estoque || 0),
            0
        );
    }, [produtosAtivos]);

    const diferencaPromocional = useMemo(() => totalVenderNormal - totalVenderPromocional, [totalVenderNormal, totalVenderPromocional]);

    const descontoPercentual = useMemo(() => {
        if (totalVenderNormal <= 0) return 0;
        return (diferencaPromocional / totalVenderNormal) * 100;
    }, [diferencaPromocional, totalVenderNormal]);

    const quantidadeProdutosAtivos = useMemo(() => produtosAtivos.length, [produtosAtivos]);

    const quantidadeItensEstoque = useMemo(() => produtosAtivos.reduce((acc, p) => acc + (p.estoque || 0), 0), [produtosAtivos]);

    const produtosEstoqueBaixo = useMemo(() => produtosAtivos.filter((p) => (p.estoque || 0) <= 5).length, [produtosAtivos]);

    const totalPorCategoria = useMemo(() => {
        const map = new Map<string, number>();
        produtosAtivos.forEach((p) => {
            const key = p.categoriaId ? `${p.categoriaId}` : "sem_categoria";
            const prev = map.get(key) || 0;
            map.set(key, prev + (p.precoVenda || 0) * (p.estoque || 0));
        });
        // Transform to array keeping a display name
        const arr: { key: string; nome: string; total: number }[] = [];
        map.forEach((value, key) => {
            // Find a display name from products
            const produtoMatch = produtosAtivos.find((p) => (p.categoriaId ? `${p.categoriaId}` : "sem_categoria") === key);
            const nome = produtoMatch ? ((produtoMatch as any).categoriaNome || (produtoMatch.categoriaId ? `Categoria ${produtoMatch.categoriaId}` : "Sem categoria")) : key;
            arr.push({ key, nome, total: value });
        });
        return arr.sort((a, b) => b.total - a.total);
    }, [produtosAtivos]);

    const maxCategoriaTotal = useMemo(() => (totalPorCategoria.length ? Math.max(...totalPorCategoria.map((c) => c.total)) : 0), [totalPorCategoria]);

    return (
        <div className="mb-8">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="mb-4 w-full flex items-center justify-between gap-3 rounded-lg border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/3 px-4 py-3 text-left transition hover:bg-white/10 dark:hover:bg-white/5"
            >
                <div>
                    <p className="text-lg font-semibold text-white dark:text-white">Resumo do Estoque</p>
                    <p className="text-sm text-white/60 dark:text-white/60 hidden sm:block">Clique para {open ? "ocultar" : "mostrar"} o resumo</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-white dark:text-white transform transition-transform ${open ? "-rotate-180" : "rotate-0"}`} />
            </button>

            <div
                ref={contentRef}
                style={{ maxHeight }}
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-5">
                        <p className="text-sm font-semibold text-slate-300 dark:text-slate-300">Vender todo o estoque (preço normal)</p>
                        <p className="mt-3 text-2xl font-bold text-white dark:text-white">{formatCurrency(totalVenderNormal)}</p>
                        <p className="mt-2 text-sm text-white/60 dark:text-white/60">Baseado em <span className="font-medium">{quantidadeItensEstoque}</span> itens em estoque</p>
                    </div>

                    <div className="rounded-xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-5">
                        <p className="text-sm font-semibold text-slate-300 dark:text-slate-300">Vender todo o estoque (preço promocional)</p>
                        <p className="mt-3 text-2xl font-bold text-white dark:text-white">{formatCurrency(totalVenderPromocional)}</p>
                        <p className="mt-2 text-sm text-white/60 dark:text-white/60">Considera preço promocional quando disponível</p>
                    </div>

                    <div className="rounded-xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-5">
                        <p className="text-sm font-semibold text-slate-300 dark:text-slate-300">Desconto potencial</p>
                        <p className="mt-3 text-2xl font-bold text-white dark:text-white">{formatCurrency(diferencaPromocional)}</p>
                        <p className="mt-2 text-sm text-white/60 dark:text-white/60">{descontoPercentual > 0 ? `${descontoPercentual.toFixed(2)}% de desconto` : "Sem desconto"}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-5">
                        <p className="text-sm font-semibold text-slate-300 dark:text-slate-300">Produtos ativos / Itens</p>
                        <p className="mt-3 text-2xl font-bold text-white dark:text-white">{quantidadeProdutosAtivos} / {quantidadeItensEstoque}</p>
                        <p className="mt-2 text-sm text-white/60 dark:text-white/60">Produtos com estoque baixo: <span className="font-medium">{produtosEstoqueBaixo}</span></p>
                    </div>
                </div>

                {/* Categoria summary */}
                {totalPorCategoria.length > 0 && (
                    <div className="mt-6 rounded-xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-5">
                        <p className="text-sm font-semibold text-slate-300 dark:text-slate-300">Valor por categoria (preço normal)</p>
                        <div className="mt-4 space-y-3">
                            {totalPorCategoria.map((cat) => (
                                <div key={cat.key} className="flex items-center gap-4">
                                    <div className="w-44 text-sm text-white/80 dark:text-white/80">{cat.nome}</div>
                                    <div className="flex-1">
                                        <div className="h-3 w-full rounded bg-white/5 dark:bg-white/5 overflow-hidden">
                                            <div
                                                className="h-3 rounded bg-gradient-to-r from-green-400 to-emerald-500"
                                                style={{ width: `${maxCategoriaTotal > 0 ? (cat.total / maxCategoriaTotal) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-36 text-right text-sm font-medium text-white dark:text-white">{formatCurrency(cat.total)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
