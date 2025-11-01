import { Film } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface NotFoundStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    redirectTo?: string;
}

export default function NotFoundState({
    title = "Filme não encontrado",
    description = "Parece que este filme não existe ou foi removido.",
    actionLabel = "Voltar para lista",
    redirectTo = "/movies",
}: NotFoundStateProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
            <Film className="w-16 h-16 text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-6 max-w-md">{description}</p>
            <Button variant="primary" onClick={() => navigate(redirectTo)}>
                {actionLabel}
            </Button>
        </div>
    );
}
