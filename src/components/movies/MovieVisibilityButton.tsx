import { updateMovieStatus } from "../../lib/movies";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

interface MovieVisibilityButtonProps {
    id: number;
    visibility: "PUBLIC" | "PRIVATE";
}

export default function MovieVisibilityButton({ id, visibility }: MovieVisibilityButtonProps) {
    const [currentVisibility, setCurrentVisibility] = useState(visibility);
    const [loading, setLoading] = useState(false);

    const toggleVisibility = async () => {
        const newVisibility = currentVisibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
        try {
            setLoading(true);
            await updateMovieStatus(id, undefined, newVisibility);
            setCurrentVisibility(newVisibility);
        } finally {
            setLoading(false);
        }
    };

    const isPublic = currentVisibility === "PUBLIC";

    return (
        <button
            onClick={toggleVisibility}
            disabled={loading}
            className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200
        ${isPublic
                    ? "border-blue-500/60 text-blue-400 hover:bg-blue-500/10"
                    : "border-gray-500/40 text-gray-300 hover:bg-gray-500/10"}
        ${loading ? "opacity-60 cursor-wait" : ""}
      `}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPublic ? (
                <>
                    <Eye className="w-4 h-4" />
                    <span>Público</span>
                </>
            ) : (
                <>
                    <EyeOff className="w-4 h-4" />
                    <span>Privado</span>
                </>
            )}
        </button>
    );
}
