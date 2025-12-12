import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../hooks/useTheme";

interface PieDataPoint {
    name: string;
    value: number;
}

interface DashboardChartPieProps {
    data: PieDataPoint[];
}

const COLORS = ["#8E4EC6", "#7C3AA0"];

export default function DashboardChartPie({ data }: DashboardChartPieProps) {
    const { isDark } = useTheme();
    
    return (
        <div className="rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 p-6 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Distribuição de Entradas
                </h3>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">Proporção mensal</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data as unknown as Record<string, unknown>[]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={800}
                    >
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? "rgba(20, 20, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
                            border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(142, 78, 198, 0.2)",
                            borderRadius: "12px",
                            boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.1)",
                            color: isDark ? "rgba(255,255,255,0.9)" : "#1A1523",
                        }}
                        formatter={(value) => `${value}%`}
                        labelStyle={{ color: isDark ? "rgba(255,255,255,0.7)" : "#1A1523" }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                            <span style={{ color: isDark ? "rgba(255,255,255,0.8)" : "#1A1523", fontSize: "12px" }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
