import { Loader2, Play, PauseCircle } from "lucide-react";
import { useState } from "react";
import { updateMovieStatus } from "../../lib/movies";

interface MovieStatusButtonProps {
    id: number;
    status: "DRAFT" | "PUBLISHED";
    compact?: boolean;
}

export default function MovieStatusButton({ id, status, compact = false }: MovieStatusButtonProps) {
    const [currentStatus, setCurrentStatus] = useState(status);
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        try {
            setLoading(true);
            await updateMovieStatus(id, newStatus);
            setCurrentStatus(newStatus);
        } finally {
            setLoading(false);
        }
    };

    const isPublished = currentStatus === "PUBLISHED";

    const baseClasses = `
    flex items-center justify-center rounded-md
    transition-all duration-200 font-medium
    ${compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm w-full"}
  `;

    return (
        <button
            onClick={toggleStatus}
            disabled={loading}
            className={`${baseClasses} ${isPublished
                ? "bg-green-600/80 hover:bg-green-700 text-white"
                : "bg-zinc-700/70 hover:bg-zinc-600 text-gray-100"
                }`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPublished ? (
                <>
                    <PauseCircle className="w-4 h-4 mr-1" /> Publicado
                </>
            ) : (
                <>
                    <Play className="w-4 h-4 mr-1" /> Rascunho
                </>
            )}
        </button>
    );
}
