import { useState } from "react";
import FormsFields, {
    buildInitialValues,
    type Field,
} from "../components/common/FormsFields";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { sendResetCode, validateResetCode, resetPassword } from "../lib/passwordReset";

export default function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"login" | "forgot" | "reset">("login");

    const fieldsLogin: Field[] = [
        {
            internalName: "email",
            label: "Nome/E-mail",
            type: "text",
            value: "",
            required: true,
            colSpan: 12,
        },
        {
            internalName: "password",
            label: "Senha",
            type: "password",
            value: "",
            required: true,
            colSpan: 12,
        },
    ];

    const fieldsForgot: Field[] = [
        {
            internalName: "email",
            label: "E-mail",
            type: "text",
            required: true,
            colSpan: 12,
        },
    ];

    const fieldsReset: Field[] = [
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
    ];

    const activeFields =
        step === "login" ? fieldsLogin : step === "forgot" ? fieldsForgot : fieldsReset;

    const [formData, setFormData] = useState(buildInitialValues(activeFields));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (step === "login") {
                if (!formData.email || !formData.password) {
                    toast.error("Preencha todos os campos obrigatórios");
                    return;
                }

                await login({
                    email: formData.email,
                    password: formData.password,
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

                setStep("login");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Erro ao processar solicitação");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-[#232225]/80 p-6 rounded-md w-full max-w-md flex flex-col gap-4"
            >
                <h2 className="text-center text-xl font-semibold mb-2">
                    {step === "login"
                        ? "Login"
                        : step === "forgot"
                            ? "Recuperar Senha"
                            : "Redefinir Senha"}
                </h2>

                <FormsFields fields={activeFields} values={formData} setValues={setFormData} />

                <div className="flex items-center justify-between gap-3 mt-2">
                    {step === "login" && (
                        <button
                            type="button"
                            onClick={() => setStep("forgot")}
                            className="text-sm text-primary hover:underline"
                        >
                            Esqueci minha senha
                        </button>
                    )}

                    {step !== "login" && (
                        <button
                            type="button"
                            onClick={() => setStep("login")}
                            className="text-sm text-primary hover:underline"
                        >
                            Voltar ao login
                        </button>
                    )}

                    <Button
                        variant="primary"
                        className="self-end w-[150] h-[40px]"
                        isLoading={loading}
                    >
                        {step === "login"
                            ? "Entrar"
                            : step === "forgot"
                                ? "Enviar Código"
                                : "Redefinir Senha"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
