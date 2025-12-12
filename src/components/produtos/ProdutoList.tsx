import { Edit, Trash2, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoListProps {
    produtos: Produto[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
    selectedIds?: Set<number>;
    onSelectAll?: () => void;
    onSelectSingle?: (id: number) => void;
    onDeleteMultiple?: () => void;
    onClearSelection?: () => void;
}

function getEstoqueColor(estoque: number) {
    if (estoque > 10) return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400";
    if (estoque >= 5) return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400";
}

export default function ProdutoList({
    produtos,
    onEdit,
    onDelete,
    onDetails,
    selectedIds = new Set(),
    onSelectAll,
    onSelectSingle,
    onDeleteMultiple,
    onClearSelection,
}: ProdutoListProps) {
    const [expandedProdutoId, setExpandedProdutoId] = useState<number | null>(null);

    const numeroColunas = 10; // incluir coluna de seleção

    // utilitários
    const formatCurrency = (value: number) =>
        value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const calcularMargens = (p: Produto) => {
        const precoVenda = Number(p.precoVenda || 0);
        const precoCompra = p.precoCompra !== undefined ? Number(p.precoCompra) : undefined;
        const precoPromo = p.precoPromocional !== undefined && p.precoPromocional > 0 ? Number(p.precoPromocional) : undefined;

        const margemUnitariaVenda = precoVenda - (precoCompra ?? 0);
        const margemPercentualVenda = precoCompra ? (margemUnitariaVenda / precoCompra) * 100 : null;

        const margemUnitariaPromocional = precoPromo !== undefined ? precoPromo - (precoCompra ?? 0) : null;
        const margemPercentualPromocional = precoPromo !== undefined && precoCompra ? (margemUnitariaPromocional! / precoCompra) * 100 : null;

        return {
            precoVenda,
            precoCompra,
            precoPromo,
            margemUnitariaVenda,
            margemPercentualVenda,
            margemUnitariaPromocional,
            margemPercentualPromocional,
        };
    };

    const gerarListaDeAlertas = (p: Produto) => {
        const alerts: string[] = [];
        const m = calcularMargens(p);

        if (m.precoCompra !== undefined && m.precoCompra >= m.precoVenda) {
            alerts.push("⚠️ O preço de compra está maior ou igual ao preço de venda. Reveja o preço ou condições de compra.");
        }
        if (m.precoPromo !== undefined && m.precoCompra !== undefined && m.precoCompra >= m.precoPromo) {
            alerts.push("⚠️ O preço promocional está menor ou igual ao preço de compra. Cuidado para não vender com prejuízo.");
        }
        if (m.margemPercentualVenda !== null && m.margemPercentualVenda < 10) {
            alerts.push("⚠️ Margem muito baixa no preço normal. Avalie aumentar o preço de venda ou negociar melhor com o fornecedor.");
        }
        if (p.estoque > 50 && m.precoPromo !== undefined) {
            alerts.push("💡 Estoque alto com preço promocional configurado. Essa promoção pode ajudar a girar este estoque.");
        }
        if (m.precoCompra === undefined) {
            alerts.push("ℹ️ Nenhum preço de compra cadastrado. Cadastre o preço de compra para análises de margem mais precisas.");
        }

        return alerts;
    };
    return (
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-primary-200/50 dark:border-primary-600/20 bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 backdrop-blur-sm">
            {/* Selection bar */}
            {selectedIds && selectedIds.size > 0 && (
                <div className="border-b border-gray-200 dark:border-white/10 p-3 lg:p-4 bg-gradient-to-r from-primary-100/50 to-primary-200/50 dark:from-primary-600/10 dark:to-primary-700/10 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedIds.size} produto(s) selecionado(s)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDeleteMultiple?.()}
                            className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-all duration-300"
                        >
                            <Trash2 className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                            Deletar Selecionadas
                        </button>
                        <button
                            onClick={() => onClearSelection?.()}
                            className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/20 transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-primary-200/50 dark:border-primary-600/20">
                        <th className="px-4 lg:px-6 py-3 lg:py-4">
                            <input
                                type="checkbox"
                                checked={selectedIds ? selectedIds.size > 0 && selectedIds.size === produtos.length : false}
                                onChange={onSelectAll}
                                className="h-4 w-4 cursor-pointer rounded dark:border-primary-600/30 dark:bg-primary-600/10 light:border-primary-300 light:bg-primary-100 text-primary-600 transition-colors"
                                title={selectedIds && selectedIds.size === produtos.length ? "Desselecionar todas" : "Selecionar todas"}
                            />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Produto
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Categoria
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Preço venda
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Preço compra
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Preço promo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Estoque
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Resumo
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-white/60">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary-200/30 dark:divide-primary-600/10">
                    {produtos.map((produto) => {
                        const rowSelected = selectedIds ? selectedIds.has(produto.id) : false;
                        const isExpanded = expandedProdutoId === produto.id;

                        const margens = calcularMargens(produto);
                        const alerts = gerarListaDeAlertas(produto);

                        return (
                            // fragment para conter a linha principal e a linha de detalhe
                            <>
                                <tr
                                    key={produto.id}
                                    onClick={() => setExpandedProdutoId(isExpanded ? null : produto.id)}
                                    className={`group transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${rowSelected ? 'bg-primary-100/50 dark:bg-primary-600/10' : ''}`}
                                >
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <input
                                            type="checkbox"
                                            checked={rowSelected}
                                            onChange={(e) => { e.stopPropagation(); onSelectSingle?.(produto.id); }}
                                            className="h-4 w-4 cursor-pointer rounded border-primary-300 dark:border-primary-600/30 bg-primary-100 dark:bg-primary-600/10 text-primary-600 transition-colors"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={produto.imagem}
                                                alt={produto.nome}
                                                className="h-10 w-10 rounded-lg object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=Sem";
                                                }}
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {produto.nome}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-white/50">
                                                    ID: {produto.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-white/80">
                                        {produto.categoria?.nome || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        R$ {(Number(produto.precoVenda) || 0).toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-white/80">
                                        {produto.precoCompra !== undefined ? `R$ ${Number(produto.precoCompra).toFixed(2)}` : "-"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-white/80">
                                        {produto.precoPromocional !== undefined && produto.precoPromocional > 0
                                            ? `R$ ${Number(produto.precoPromocional).toFixed(2)}`
                                            : "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstoqueColor(produto.estoque)}`}>
                                            {produto.estoque}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {produto.estoque <= 5 ? (
                                            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 dark:bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                                <AlertTriangle className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                                                Estoque baixo
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500 dark:text-white/60">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDetails(produto.id); }}
                                                className="rounded-lg p-2 transition-all duration-300 hover:bg-primary-100 dark:hover:bg-primary-600/20"
                                                title="Detalhes"
                                            >
                                                <Info className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit(produto.id); }}
                                                className="rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4 text-gray-600 dark:text-white/70" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete(produto.id); }}
                                                className="rounded-lg p-2 transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-500/20"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {isExpanded && (
                                    <tr className="bg-transparent">
                                        <td colSpan={numeroColunas} className="px-6 py-4">
                                            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 mt-2">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Coluna esquerda: resumo do produto e preços */}
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resumo do produto</h3>
                                                        <p className="mt-2 text-sm text-gray-700 dark:text-white/80">{produto.nome}</p>
                                                        <p className="text-xs text-gray-600 dark:text-white/60">Categoria: {produto.categoria?.nome || "-"} • Status: {produto.ativo ? "Ativo" : "Inativo"} • Estoque: {produto.estoque}</p>

                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Preços & Estoque</h4>
                                                            <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-white/80">
                                                                <div>Preço de Venda: <span className="font-medium">{formatCurrency(Number(produto.precoVenda || 0))}</span></div>
                                                                <div>Preço de Compra: <span className="font-medium">{produto.precoCompra !== undefined ? formatCurrency(Number(produto.precoCompra)) : "—"}</span></div>
                                                                <div>Preço Promocional: <span className="font-medium">{produto.precoPromocional !== undefined && produto.precoPromocional > 0 ? formatCurrency(Number(produto.precoPromocional)) : "—"}</span></div>
                                                                <div>Valor total em estoque (venda): <span className="font-medium">{formatCurrency((Number(produto.precoVenda || 0)) * produto.estoque)}</span></div>
                                                                <div>Valor total em estoque (promo): <span className="font-medium">{formatCurrency((Number(produto.precoPromocional && produto.precoPromocional > 0 ? produto.precoPromocional : produto.precoVenda) || 0) * produto.estoque)}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Coluna direita: análise financeira e alertas */}
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Análise financeira</h4>
                                                        <div className="mt-2 space-y-2 text-sm text-gray-700 dark:text-white/80">
                                                            <div>
                                                                <div className="text-xs text-gray-600 dark:text-white/60">Margem unitária (preço normal)</div>
                                                                <div className="font-medium">{formatCurrency(margens.margemUnitariaVenda)} {margens.margemPercentualVenda !== null ? `• ${margens.margemPercentualVenda.toFixed(2)}%` : ""}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-600 dark:text-white/60">Margem unitária (promocional)</div>
                                                                <div className="font-medium">{margens.margemUnitariaPromocional !== null ? `${formatCurrency(margens.margemUnitariaPromocional)} ${margens.margemPercentualPromocional !== null ? `• ${margens.margemPercentualPromocional.toFixed(2)}%` : ""}` : "—"}</div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Alertas / Insights</h4>
                                                            <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-white/80 space-y-1">
                                                                {alerts.map((a, idx) => (
                                                                    <li key={idx} className={a.startsWith("⚠️") ? "text-red-600 dark:text-red-300" : "text-gray-700 dark:text-white/80"}>{a}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
