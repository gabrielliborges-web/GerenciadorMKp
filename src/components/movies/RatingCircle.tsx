import { motion } from "framer-motion";

interface RatingCircleProps {
    rating: number;
    size?: number;
    strokeWidth?: number;
    bgColor?: string;
    duration?: number;
    className?: string;
}

export default function RatingCircle({
    rating,
    size = 90,
    strokeWidth = 8,
    bgColor = "#1e1e1e",
    duration = 1.2,
    className = "",
}: RatingCircleProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (rating / 100) * circumference;

    const color =
        rating < 50
            ? "#ef4444"
            : rating < 75
                ? "#facc15"
                : "#22c55e";

    return (
        <div
            className={`relative flex items-center justify-center rounded-full overflow-hidden ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration, ease: "easeInOut" }}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>

            <span
                className="absolute font-semibold select-none"
                style={{
                    color,
                    fontSize: size * 0.22,
                }}
            >
                {Math.round(rating)}%
            </span>
        </div>
    );
}
