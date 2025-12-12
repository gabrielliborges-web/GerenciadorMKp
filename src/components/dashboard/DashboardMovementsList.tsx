import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Movimento {
    id: string;
    tipo: "entrada" | "saida";
    descricao: string;
    valor: number;
    data: string;
}

interface DashboardMovementsListProps {
    movimentos: Movimento[];
}

export default function DashboardMovementsList({
    movimentos,
}: DashboardMovementsListProps) {
    return (
        <div className="rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 p-6 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Movimentações Recentes
                </h3>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">Últimas transações</p>
            </div>

            <div className="space-y-3">
                {movimentos.map((movimento) => {
                    const isEntrada = movimento.tipo === "entrada"; return (
                        <div
                            key={movimento.id}
                            className="group flex items-center gap-4 rounded-xl border border-mauve-light-5 dark:border-white/5 bg-mauve-light-1 dark:bg-white/2 p-4 transition-all duration-300 hover:border-mauve-light-7 dark:hover:border-white/10 hover:bg-mauve-light-2 dark:hover:bg-white/5"
                        >
                            <div
                                className={`rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110 ${isEntrada
                                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                    : "bg-red-500/20 text-red-600 dark:text-red-400"
                                    }`}
                            >
                                {isEntrada ? (
                                    <ArrowUpRight className="h-5 w-5" />
                                ) : (
                                    <ArrowDownRight className="h-5 w-5" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    {movimento.descricao}
                                </p>
                                <p className="text-xs text-text-secondary-light dark:text-white/50">
                                    {new Date(movimento.data).toLocaleDateString("pt-BR")}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <p
                                    className={`text-sm font-bold ${isEntrada ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {isEntrada ? "+" : "-"} R${" "}
                                    {movimento.valor.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
