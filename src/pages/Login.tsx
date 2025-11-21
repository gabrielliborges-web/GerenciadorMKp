import { useEffect, useMemo, useState } from "react";
import { LineChart, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import FormsFields, {
    buildInitialValues,
    type Field,
} from "../components/common/FormsFields";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { sendResetCode, validateResetCode, resetPassword } from "../lib/passwordReset";

type Step = "login" | "forgot" | "reset";

const stepCopy: Record<Step, { title: string; subtitle: string; helper: string }> = {
    login: {
        title: "Acesse sua central",
        subtitle: "Entre e acompanhe seus resultados, metas e alertas inteligentes em tempo real.",
        helper: "Credenciais criptografadas com dupla verificação e camadas extras de proteção.",
    },
    forgot: {
        title: "Recupere o acesso",
        subtitle: "Envie um código seguro para redefinir sua senha com rapidez e tranquilidade.",
        helper: "Vamos confirmar seu e-mail e garantir que apenas você possa solicitar o código.",
    },
    reset: {
        title: "Defina uma nova senha",
        subtitle: "Use o código enviado e escolha uma senha forte para voltar ao controle.",
        helper: "Recomendamos ao menos 8 caracteres, com letras maiúsculas, minúsculas e números.",
    },
};

export default function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<Step>("login");

    const fieldsLogin = useMemo<Field[]>(
        () => [
            {
                internalName: "email",
                label: "Nome/E-mail",
                type: "text",
                value: "",
                required: true,
                colSpan: 12,
            },
            {
                internalName: "Senha",
                label: "Senha",
                type: "password",
                value: "",
                required: true,
                colSpan: 12,
            },
        ],
        []
    );

    const fieldsForgot = useMemo<Field[]>(
        () => [
            {
                internalName: "email",
                label: "E-mail",
                type: "text",
                required: true,
                colSpan: 12,
            },
        ],
        []
    );

    const fieldsReset = useMemo<Field[]>(
        () => [
            {
                internalName: "email",
                label: "E-mail",
                type: "text",
                required: true,
                colSpan: 12,
            },
            {
                internalName: "code",
                label: "Código de Recuperação",
                type: "text",
                required: true,
                colSpan: 12,
            },
            {
                internalName: "newPassword",
                label: "Nova Senha",
                type: "password",
                required: true,
                colSpan: 12,
            },
            {
                internalName: "confirmPassword",
                label: "Confirmar Senha",
                type: "password",
                required: true,
                colSpan: 12,
            },
        ],
        []
    );

    const activeFields = useMemo(() => {
        if (step === "login") return fieldsLogin;
        if (step === "forgot") return fieldsForgot;
        return fieldsReset;
    }, [fieldsForgot, fieldsLogin, fieldsReset, step]);

    const [formData, setFormData] = useState(() => buildInitialValues(fieldsLogin));

    useEffect(() => {
        const baseValues = buildInitialValues(activeFields);
        setFormData((prev) => ({ ...baseValues, ...prev }));
    }, [activeFields]);

    const clearSensitiveFields = () => {
        setFormData((prev) => ({
            ...prev,
            Senha: "",
            newPassword: "",
            confirmPassword: "",
            code: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (step === "login") {
                if (!formData.email || !formData.Senha) {
                    toast.error("Preencha todos os campos obrigatórios");
                    return;
                }

                await login({
                    email: formData.email,
                    senha: formData.Senha,
                });
            }

            if (step === "forgot") {
                if (!formData.email) {
                    toast.error("Informe o e-mail para enviar o código");
                    return;
                }

                await sendResetCode(formData.email);
                toast.success("Código enviado para o seu e-mail!");
                setStep("reset");
            }

            if (step === "reset") {
                const { email, code, newPassword, confirmPassword } = formData;

                if (!email || !code || !newPassword || !confirmPassword) {
                    toast.error("Preencha todos os campos obrigatórios");
                    return;
                }

                if (newPassword !== confirmPassword) {
                    toast.error("As senhas não coincidem");
                    return;
                }

                await validateResetCode(email, code);
                await resetPassword(email, code, newPassword);
                toast.success("Senha redefinida com sucesso!");

                clearSensitiveFields();
                setStep("login");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Erro ao processar solicitação");
        } finally {
            setLoading(false);
        }
    };

    const heroHighlights = [
        {
            label: "Carteiras guiadas",
            value: "124",
            detail: "+18% neste trimestre",
        },
        {
            label: "Fluxo monitorado",
            value: "R$ 540k",
            detail: "Alertas diários ativos",
        },
        {
            label: "Metas concluídas",
            value: "92%",
            detail: "Planos com progresso contínuo",
        },
    ];

    const actionLabel =
        step === "login"
            ? "Entrar"
            : step === "forgot"
                ? "Enviar código"
                : "Redefinir senha";

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#08050c]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#ffe1f6]/40 via-[#d6c6ff]/35 to-transparent blur-[120px] opacity-80 animate-soft-pulse" />
                <div className="absolute -bottom-10 left-0 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-[#f7d4ff]/50 via-[#f9b9d0]/40 to-transparent blur-[120px] opacity-70 animate-soft-orbit" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1430_0%,#08050c_55%)]" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center px-4 py-12 sm:px-8">
                <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-12">
                    <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-[0_30px_120px_-50px_rgba(255,192,203,0.8)] backdrop-blur-3xl animate-fade-slide">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-[0.3em] uppercase text-white/70">
                            <Sparkles className="h-4 w-4 text-[#ffd9f7]" />
                            Equilíbrio & Luxo
                        </div>

                        <h1 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                            Controle financeiro com delicadeza e potência feminina.
                        </h1>
                        <p className="mt-4 text-base text-white/80">
                            Visualize ativos, acompanhe metas e receba alertas inteligentes em um ambiente acolhedor, sofisticado e pensado para quem lidera suas finanças com sensibilidade e estratégia.
                        </p>

                        <div className="mt-10 grid gap-4 lg:gap-6">
                            <div className="rounded-[24px] border border-white/20 bg-white/10 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1">
                                <div className="flex items-center justify-between text-sm text-white/80">
                                    <span>Performance consolidada</span>
                                    <LineChart className="h-5 w-5 text-[#f6d4ff]" />
                                </div>
                                <div className="mt-6 flex items-end gap-4">
                                    <div>
                                        <p className="text-4xl font-semibold text-white">+32,4%</p>
                                        <p className="text-sm text-white/80">rendimentos nos últimos 12 meses</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-20 w-full rounded-2xl bg-gradient-to-tr from-[#ffd6ec]/50 via-[#f0cfff]/60 to-white/15 p-3">
                                            <div className="h-full w-full rounded-xl bg-white/10">
                                                <div className="h-full w-full animate-soft-graph rounded-xl bg-gradient-to-r from-[#f0b5d8] via-[#d4a9ff] to-[#fce1ff]/80" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                {heroHighlights.map((card) => (
                                    <div
                                        key={card.label}
                                        className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white/80 backdrop-blur-xl transition duration-500 hover:-translate-y-1"
                                    >
                                        <p className="text-xs uppercase tracking-wide text-white/70">{card.label}</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
                                        <p className="text-sm">{card.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/80">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                <ShieldCheck className="h-4 w-4 text-[#ffd9f7]" />
                                Proteção multicamada
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                <Sparkles className="h-4 w-4 text-[#ffd9f7]" />
                                Insights em tempo real
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                <LineChart className="h-4 w-4 text-[#ffd9f7]" />
                                Crescimento progressivo
                            </span>
                        </div>
                    </section>

                    <section className="relative rounded-[32px] border border-white/15 bg-white/95 text-[#1f1328] shadow-[0_35px_90px_-45px_rgba(84,52,107,0.8)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1b1324]/90 dark:text-white">
                        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/80 via-transparent to-[#f8e5ff]/60 opacity-90 dark:from-white/5 dark:via-transparent dark:to-[#2d1a3a]" />
                        <div className="absolute inset-0 rounded-[32px] border border-white/50 dark:border-white/10" />
                        <div className="relative z-10 flex h-full flex-col px-6 py-8 sm:px-10">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#b58cd6]">
                                        {step === "login" ? "Sessão segura" : "Assistente de acesso"}
                                    </p>
                                    <h2 className="mt-3 text-3xl font-semibold text-[#2a183b] dark:text-white">
                                        {stepCopy[step].title}
                                    </h2>
                                    <p className="mt-2 text-sm text-[#72507a] dark:text-white/80">
                                        {stepCopy[step].subtitle}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/60 bg-white/80 p-3 text-[#a260c4] shadow-lg animate-soft-bounce">
                                    <LockKeyhole className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-[#f2dcff] bg-white/70 p-4 text-sm text-[#6f4d7e] shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                                {stepCopy[step].helper}
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                                <FormsFields fields={activeFields} values={formData} setValues={setFormData} />

                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                    {step === "login" ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                clearSensitiveFields();
                                                setStep("forgot");
                                            }}
                                            className="text-primary-dark-7 transition hover:text-primary-dark-9 hover:underline dark:text-primary-dark-9"
                                        >
                                            Esqueci minha senha
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                clearSensitiveFields();
                                                setStep("login");
                                            }}
                                            className="text-primary-dark-7 transition hover:text-primary-dark-9 hover:underline dark:text-primary-dark-9"
                                        >
                                            Voltar ao login
                                        </button>
                                    )}

                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b884c9] dark:text-[#d8b1f1]">
                                        <ShieldCheck className="h-4 w-4" />
                                        Protegido
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="mt-2 h-12 w-full rounded-2xl text-base font-semibold tracking-wide shadow-[0_25px_45px_-25px_rgba(142,78,198,0.9)] transition-all duration-300 hover:-translate-y-0.5"
                                    isLoading={loading}
                                >
                                    {actionLabel}
                                </Button>

                                <p className="text-center text-xs text-[#82618c] dark:text-white/70">
                                    Ao continuar, você concorda em manter seus dados atualizados e seguros. Transparência e autonomia guiando cada decisão.
                                </p>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
