import { useState } from "react";
import FormsFields, {
    buildInitialValues,
    type Field,
} from "../components/common/FormsFields";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);

    const fieldsSignup: Field[] = [
        {
            internalName: "name",
            label: "Nome completo",
            type: "text",
            value: "",
            required: true,
            colSpan: 12,
        },
        {
            internalName: "email",
            label: "E-mail",
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
        {
            internalName: "confirmPassword",
            label: "Confirme sua senha",
            type: "password",
            value: "",
            required: true,
            colSpan: 12,
        },
        {
            internalName: "theme",
            label: "Tema Preferido",
            type: "choice",
            options: ["LIGHT", "DARK"],
            value: "",
            colSpan: 12,
        },
    ];

    const [signupData, setSignupData] = useState(buildInitialValues(fieldsSignup));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        setLoading(true);
        try {
            await signup({
                name: signupData.name.trim(),
                email: signupData.email.trim(),
                password: signupData.password,
                theme: signupData.theme || "LIGHT",
            });
        } catch (err: any) {
            console.error("Erro no signup:", err);
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
                <FormsFields
                    fields={fieldsSignup}
                    values={signupData}
                    setValues={setSignupData}
                />

                <div className="flex items-center justify-between gap-3 mt-2">
                    <Link
                        to="/login"
                        className="text-sm text-primary hover:underline"
                    >
                        Já tenho uma conta
                    </Link>

                    <Button
                        variant="primary"
                        className="w-[120px] h-[40px]"
                        isLoading={loading}
                    >
                        Cadastrar
                    </Button>
                </div>
            </form>
        </div>
    );
}
