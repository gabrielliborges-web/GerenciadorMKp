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

const CustomTooltip = ({ active, payload, isDark }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    backgroundColor: isDark ? "rgba(30, 30, 45, 0.98)" : "rgba(255, 255, 255, 0.98)",
                    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(142, 78, 198, 0.3)",
                    borderRadius: "12px",
                    boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.15)",
                    padding: "12px 16px",
                }}
            >
                <p
                    style={{
                        color: isDark ? "#ffffff" : "#1A1523",
                        fontWeight: "600",
                        marginBottom: "8px",
                        fontSize: "14px",
                    }}
                >
                    {payload[0].name}
                </p>
                <p
                    style={{
                        color: isDark ? "#ffffff" : "#1A1523",
                        fontSize: "16px",
                        fontWeight: "700",
                    }}
                >
                    {payload[0].value}%
                </p>
            </div>
        );
    }
    return null;
};

export default function DashboardChartPie({ data }: DashboardChartPieProps) {
    const { isDark } = useTheme();
    
    return (
        <div className="rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-br from-mauve-light-2 dark:from-white/5 to-mauve-light-1 dark:to-white/2 p-6 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-white">
                    Distribuição de Entradas
                </h3>
                <p className="mt-1 text-sm text-text-secondary-light dark:text-white/60">Proporção mensal</p>
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
                    <Tooltip content={<CustomTooltip isDark={isDark} />} />
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
