import { useMemo, useEffect, useState } from "react";
import {
    Wallet2,
    TrendingUp,
    TrendingDown,
    Target,
    RotateCcw,
} from "lucide-react";
import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardChartArea from "../components/dashboard/DashboardChartArea";
import DashboardChartPie from "../components/dashboard/DashboardChartPie";
import DashboardMovementsList from "../components/dashboard/DashboardMovementsList";
import DashboardAlerts from "../components/dashboard/DashboardAlerts";
import { getDashboardResumo } from "../lib/movimentacao";

export default function Home() {
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resumo = await getDashboardResumo();
                if (!mounted) return;

                // Mapear resposta do backend para o formato esperado pelos componentes
                const totalEntradas = resumo.totalEntradas ?? 0;
                const totalSaidas = resumo.totalSaidas ?? 0;
                const saldoAtual = resumo.saldoAtual ?? 0;
                const lucro = resumo.lucro ?? (totalEntradas - totalSaidas);

                // gerar séries simples para o gráfico (últimos 7 dias usando movimentacoesRecentes quando disponível)
                const movimentacoesRecentes = resumo.movimentacoesRecentes || [];

                const receitasDespesas: Array<any> = [];
                // tentar agrupar por data a partir das movimentacoesRecentes
                const grouped: Record<string, { receitas: number; despesas: number }> = {};
                (movimentacoesRecentes as any[]).forEach((m) => {
                    const day = new Date(m.data).toLocaleDateString("pt-BR");
                    const valor = typeof m.valor === "number" ? m.valor : Number(m.valor || 0);
                    if (!grouped[day]) grouped[day] = { receitas: 0, despesas: 0 };
                    if (m.entrada) grouped[day].receitas += valor;
                    else grouped[day].despesas += valor;
                });

                // converter grouped em array ordenado (máximo 7 dias)
                Object.keys(grouped)
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                    .slice(-7)
                    .forEach((day) => {
                        receitasDespesas.push({ data: day, receitas: grouped[day].receitas, despesas: grouped[day].despesas });
                    });

                // fallback se não houver dados agrupados
                if (receitasDespesas.length === 0) {
                    receitasDespesas.push({ data: new Date().toLocaleDateString("pt-BR"), receitas: totalEntradas, despesas: totalSaidas });
                }

                // distribuição de entradas por tipo (transformar em porcentagem)
                const entradasPorTipo = resumo.entradasPorTipo || {};
                const distribEntradasArr = Object.entries(entradasPorTipo).map(([name, value]: any) => ({ name, value: Number(value) }));
                const totalEntradasVal = distribEntradasArr.reduce((s, it) => s + it.value, 0) || 1;
                const distribuicaoEntradas = distribEntradasArr.map((it) => ({ name: it.name, value: Math.round((it.value / totalEntradasVal) * 100) }));

                // alertas simples
                const alerts: any[] = [];
                if (totalSaidas > totalEntradas) {
                    alerts.push({ id: "1", tipo: "aviso", titulo: "Despesas maiores que receitas", descricao: "As despesas deste mês superam as receitas.", icone: "AlertCircle" });
                }

                setData({
                    cards: { saldoAtual, receitasMes: totalEntradas, despesasMes: totalSaidas, lucroMes: lucro },
                    receitasDespesas,
                    distribuicaoEntradas,
                    movimentacoesRecentes: (movimentacoesRecentes || []).map((m: any) => ({ id: String(m.id), tipo: m.entrada ? "entrada" : "saida", descricao: m.descricao || m.tipo, valor: typeof m.valor === "number" ? m.valor : Number(m.valor || 0), data: m.data })),
                    alertas: alerts,
                });
            } catch (err) {
                console.error(err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="space-y-8 pb-6">
            {/* Header */}
            <div className="animate-fade-in space-y-2">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-white/60">
                    Indicadores gerais e visão financeira em tempo real
                </p>
            </div>

            {/* Cards de Indicadores */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
                <DashboardCard icon={Wallet2} title="Saldo Atual" value={data?.cards.saldoAtual ?? 0} variation={0} format="currency" />
                <DashboardCard icon={TrendingUp} title="Receitas do Mês" value={data?.cards.receitasMes ?? 0} variation={0} format="currency" />
                <DashboardCard icon={TrendingDown} title="Despesas do Mês" value={data?.cards.despesasMes ?? 0} variation={0} format="currency" />
                <DashboardCard icon={Target} title="Lucro / Resultado" value={data?.cards.lucroMes ?? 0} variation={0} format="currency" />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in">
                <div className="lg:col-span-2">
                    <DashboardChartArea data={data?.receitasDespesas ?? []} />
                </div>
                <div>
                    <DashboardChartPie data={data?.distribuicaoEntradas ?? []} />
                </div>
            </div>

            {/* Movimentações + Alertas */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in">
                <div className="lg:col-span-2">
                    <DashboardMovementsList movimentos={data?.movimentacoesRecentes ?? []} />
                </div>
                <div>
                    <DashboardAlerts alertas={data?.alertas ?? []} />
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <RotateCcw className="h-4 w-4" />
                    <span>Última atualização há alguns segundos</span>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/15"
                >
                    <RotateCcw className="h-4 w-4" />
                    Atualizar
                </button>
            </div>
        </div>
    );
}
