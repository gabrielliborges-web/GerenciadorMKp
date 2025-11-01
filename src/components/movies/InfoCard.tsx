interface InfoCardProps {
    title: string;
    content: React.ReactNode;
    compact?: boolean;
    className?: string;
}

export default function InfoCard({
    title,
    content,
    compact = false,
    className = "",
}: InfoCardProps) {
    return (
        <div
            className={`
        ${compact ? "px-4 py-2" : "p-4"}
        bg-mauve-dark-3 opacity-80 rounded-sm
        flex flex-col justify-center
        overflow-hidden break-words
        ${className}
      `}
        >
            <p className="text-xs text-gray-400 uppercase tracking-wide truncate">
                {title}
            </p>
            < span className="font-semibold text-white text-sm break-words whitespace-pre-wrap overflow-hidden text-ellipsis">
                {content}
            </span>
        </div>
    );
}
