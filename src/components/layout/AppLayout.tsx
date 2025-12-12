import { useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    LogIn,
    LogOut,
    Menu,
    Moon,
    PieChart,
    Settings,
    ShoppingCart,
    Sparkles,
    Sun,
    Tags,
    TrendingUp,
    Wallet2,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../context/AuthContext";
import { useNavigation, type AppView } from "../../context/NavigationContext";

interface AppLayoutProps {
    children: React.ReactNode;
}

type NavItem = {
    label: string;
    description: string;
    view: AppView;
    icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
    {
        label: "Início",
        description: "Indicadores e alertas inteligentes",
        view: "home",
        icon: PieChart,
    },
    {
        label: "Categorias",
        description: "Gestão de categorias de produtos",
        view: "categorias",
        icon: Tags,
    },
    {
        label: "Produtos",
        description: "Portfólio premium e curadoria",
        view: "produtos",
        icon: Sparkles,
    },
    {
        label: "Compras",
        description: "Fornecedores e entrada de estoque",
        view: "compras",
        icon: ShoppingCart,
    },
    {
        label: "Vendas",
        description: "Metas e oportunidades",
        view: "vendas",
        icon: TrendingUp,
    },
    {
        label: "Financeiro",
        description: "Entradas, despesas, extrato e resumo",
        view: "financeiro",
        icon: Wallet2,
    },
    {
        label: "Configurações",
        description: "Preferências e integrações",
        view: "configuracoes",
        icon: Settings,
    },
];

export default function AppLayout({ children }: AppLayoutProps) {
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, logout, user } = useAuth();
    const { currentView, goTo, isCurrent } = useNavigation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const primaryActionLabel = useMemo(() => {
        if (isAuthenticated) return "Sair";
        return currentView === "signup" ? "Ir para login" : "Entrar";
    }, [currentView, isAuthenticated]);

    const handlePrimaryAction = () => {
        if (isAuthenticated) {
            logout();
            return;
        }

        if (currentView === "signup") {
            goTo("login");
        } else {
            goTo("home");
        }
    };

    const renderNavItems = (compact = false) => (
        <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.view);

                return (
                    <button
                        key={item.view}
                        type="button"
                        onClick={() => {
                            goTo(item.view);
                            setIsMobileSidebarOpen(false);
                        }}
                        className={`group relative flex w-full items-center rounded-2xl px-2 py-2 text-left text-sm transition-all duration-500 ${compact ? "justify-center" : "gap-3"
                            } ${active
                                ? "bg-white dark:bg-white/10 text-primary-light-11 dark:text-primary-dark-9"
                                : "bg-transparent hover:bg-primary-light-3 dark:hover:bg-white/5 text-text-primary-light dark:text-white"
                            }`}
                    >
                        {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary-light-11 dark:bg-primary-dark-9" />
                        )}
                        <span
                            className={`flex items-center justify-center transition-all duration-300 ${compact
                                ? `h-12 w-12 rounded-3xl ${active
                                    ? "bg-primary-light-3 dark:bg-primary-dark-3"
                                    : "bg-primary-light-3 dark:bg-white/5"
                                }`
                                : `h-11 w-11 rounded-2xl ${active
                                    ? "bg-primary-light-3 dark:bg-primary-dark-3"
                                    : "bg-primary-light-3 dark:bg-white/5"
                                }`
                                }`}
                        >
                            <Icon
                                className={`h-5 w-5 transition-transform duration-300 ${active
                                    ? "text-primary-light-11 dark:text-primary-dark-9 scale-110"
                                    : "text-primary-light-11 dark:text-white/80 group-hover:scale-105"
                                    }`}
                            />
                        </span>

                        {!compact && (
                            <div className="flex flex-col">
                                <span className={`text-sm font-semibold transition-colors ${active
                                    ? "text-primary-light-11 dark:text-primary-dark-9"
                                    : "text-text-primary-light dark:text-white"
                                    }`}>{item.label}</span>
                                <span className={`text-xs transition-colors ${active
                                    ? "text-primary-light-10 dark:text-primary-dark-8"
                                    : "text-text-secondary-light dark:text-white/70"
                                    }`}>{item.description}</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="relative h-screen overflow-hidden bg-primary-light-1 dark:bg-[#050107] text-text-primary-light transition-colors duration-500 dark:text-text-primary-dark">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-[-80px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#f8d7ff]/40 via-[#f7c0e2]/30 to-transparent blur-[140px]" />
                <div className="absolute bottom-[-120px] right-[-60px] h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-[#d6c1ff]/35 via-[#f9e3ff]/25 to-transparent blur-[150px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f7edfe_0%,_#fefcfe_55%)] dark:bg-[radial-gradient(circle_at_top,_#1a0f2b_0%,_#06020a_55%)] opacity-80" />
            </div>

            <div className="relative z-10 mx-auto flex h-full max-w-[1700px] flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-10">
                <aside
                    className={`hidden lg:flex flex-col px-2 py-6 rounded-2xl border border-mauve-light-6 dark:border-white/10 bg-gradient-to-b from-mauve-light-2/80 dark:from-white/5 to-mauve-light-1/80 dark:to-transparent backdrop-blur-xl text-text-primary-light dark:text-white transition-all duration-500 ${isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-[260px] opacity-100"} relative z-20 overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-mauve-light-8 dark:scrollbar-thumb-white/20 hover:scrollbar-thumb-mauve-light-9 dark:hover:scrollbar-thumb-white/30`}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div
                                className={`flex items-center gap-3 transition-opacity duration-300 ${isSidebarCollapsed ? "pointer-events-none opacity-0" : "opacity-100"}`}
                            >
                                <div className="rounded-2xl bg-primary-light-3 dark:bg-white/15 p-2 text-primary-light-12 dark:text-white">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-text-primary-light dark:text-white">MKP Finanças</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                                aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
                                className="rounded-full bg-primary-light-3 dark:bg-white/5 p-2 text-primary-light-12 dark:text-white transition-all duration-300 hover:bg-primary-light-4 dark:hover:bg-white/15 flex-shrink-0"
                            >
                                {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className={`flex gap-2 ${isSidebarCollapsed ? "flex-col" : "flex-row"}`}>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex-1 flex items-center justify-center rounded-2xl bg-primary-light-3 dark:bg-white/10 p-2.5 text-primary-light-12 dark:text-white transition-all duration-300 hover:bg-primary-light-4 dark:hover:bg-white/15"
                            >
                                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </button>

                            <button
                                type="button"
                                onClick={handlePrimaryAction}
                                className="flex-1 flex items-center justify-center rounded-2xl bg-primary-light-3 dark:bg-white/10 p-2.5 text-primary-light-12 dark:text-white transition-all duration-300 hover:bg-primary-light-4 dark:hover:bg-white/15"
                            >
                                {isAuthenticated ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col">
                        {renderNavItems(isSidebarCollapsed)}
                    </div>

                </aside>

                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="relative flex flex-1 min-h-0 flex-col rounded-[36px] border border-mauve-light-6 dark:border-white/5 bg-white/95 dark:bg-[#13081a]/95 p-4 text-text-primary-light dark:text-white shadow-[0_40px_160px_-140px_rgba(142,78,198,0.1)] dark:shadow-[0_40px_160px_-140px_rgba(7,2,12,1)] backdrop-blur-xl">
                        <section className="flex-1 min-h-0 overflow-y-auto rounded-[28px] bg-white/90 dark:bg-white/5 p-4 shadow-[0_25px_60px_-50px_rgba(142,78,198,0.05)] dark:shadow-[0_25px_60px_-50px_rgba(10,5,20,1)] backdrop-blur-2xl scrollbar scrollbar-track-transparent scrollbar-thumb-mauve-light-8 dark:scrollbar-thumb-white/20 hover:scrollbar-thumb-mauve-light-9 dark:hover:scrollbar-thumb-white/30">
                            {children}
                        </section>
                    </div>
                </div>
            </div>

            {isSidebarCollapsed && (
                <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="fixed top-4 left-4 z-40 hidden lg:flex rounded-2xl bg-primary-light-3 dark:bg-white/10 p-2.5 text-primary-light-12 dark:text-white shadow-[0_10px_30px_-20px_rgba(142,78,198,0.2)] dark:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:bg-primary-light-4 dark:hover:bg-white/15"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            )}

            <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="fixed top-4 left-4 z-40 lg:hidden rounded-2xl bg-gradient-to-br from-white/90 to-[#f9ecff]/80 p-2.5 text-[#1a0f29] shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:from-white hover:to-[#f6ddff]"
            >
                <Menu className="h-5 w-5" />
            </button>

            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div
                        className={`mt-16 w-[92%] max-h-[80vh] rounded-[32px] border p-5 shadow-[0_30px_80px_-50px_rgba(142,78,198,0.2)] dark:shadow-[0_30px_80px_-50px_rgba(8,4,12,0.9)] overflow-y-auto scrollbar scrollbar-track-transparent ${isDark
                            ? "border-white/15 bg-gradient-to-b from-[#13081a]/95 via-[#1a0f2b]/95 to-[#0f061a]/95 text-white scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
                            : "border-mauve-light-6 bg-gradient-to-b from-white/95 via-primary-light-2/90 to-primary-light-1/80 text-text-primary-light scrollbar-thumb-mauve-light-8 hover:scrollbar-thumb-mauve-light-9"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-text-primary-light"}`}>Controle elegante</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className={`rounded-full border p-2 transition-colors ${isDark
                                    ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                                    : "border-primary-light-6 bg-primary-light-3 text-primary-light-12 hover:bg-primary-light-4"
                                    }`}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {renderNavItems(false)}

                        <div className="mt-6 flex flex-col gap-3">
                            {user && (
                                <div className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${isDark ? "bg-white/10 text-white" : "bg-primary-light-3 text-text-primary-light"
                                    }`}>
                                    <div>
                                        <p className="text-sm font-semibold">Alertas</p>
                                        <p className={`text-xs ${isDark ? "text-white/70" : "text-text-secondary-light"}`}>Eventos e lembretes</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileSidebarOpen(false);
                                }}
                                disabled
                                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors opacity-50 cursor-not-allowed ${isDark ? "bg-white/10 text-white" : "bg-primary-light-3 text-text-primary-light"
                                    }`}
                            >
                                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <span className="text-sm font-semibold">
                                    {isDark ? "Modo noturno" : "Modo luminoso"}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    handlePrimaryAction();
                                    setIsMobileSidebarOpen(false);
                                }}
                                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${isDark ? "bg-white/10 text-white hover:bg-white/15" : "bg-primary-light-3 text-text-primary-light hover:bg-primary-light-4"
                                    }`}
                            >
                                {isAuthenticated ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                                <span className="text-sm font-semibold">{primaryActionLabel}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
