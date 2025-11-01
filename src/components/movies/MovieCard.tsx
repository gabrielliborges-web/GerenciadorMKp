import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import notFoun from "../../assets/not_found_image.svg";
import RatingCircle from "./RatingCircle";
import { getYouTubeId } from "../../utils/pathVideo";

interface MovieCardProps {
    imageCover?: string;
    linkPreview?: string;
    title: string;
    description?: string;
    rating?: number;
}

export default function MovieCard({
    imageCover,
    linkPreview,
    title,
    description = "No description available.",
    rating = 0,
}: MovieCardProps) {
    const [hover, setHover] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [previewError, setPreviewError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const poster = !imageCover || imageError ? notFoun : imageCover;

    const isYouTube = linkPreview?.includes("youtube.com") || linkPreview?.includes("youtu.be");

    const isValidPreview =
        linkPreview &&
        (isYouTube
            ? !!getYouTubeId(linkPreview)
            : /\.(mp4|webm|mov|ogg)$/i.test(linkPreview));

    useEffect(() => {
        if (hover && isValidPreview && !previewError) {
            const timer = setTimeout(() => setShowPreview(true), 2000);
            setHoverTimer(timer);
        } else {
            setShowPreview(false);
            if (hoverTimer) clearTimeout(hoverTimer);
        }

        return () => {
            if (hoverTimer) clearTimeout(hoverTimer);
        };
    }, [hover, isValidPreview, previewError]);

    return (
        <motion.div
            onMouseEnter={() => {
                setHover(true);
                setPreviewError(false);
            }}
            onMouseLeave={() => {
                setHover(false);
                setShowPreview(false);
            }}
            className="
    relative
    w-[35vw] max-w-[183px]
    sm:w-[40vw] sm:max-w-[235px]
    aspect-[183/281] sm:aspect-[235/355]
    rounded-[4px]
    overflow-hidden
    bg-[#111]
    cursor-pointer
    group
    transition-all duration-300
  "        >
            {showPreview && isValidPreview && !previewError ? (
                isYouTube ? (
                    <div className="absolute inset-0 z-20 overflow-hidden">
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(
                                linkPreview!
                            )}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeId(linkPreview!)}`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            onError={() => setPreviewError(true)}
                            className="absolute inset-0 w-full h-full object-cover z-20"
                            style={{
                                transform: "translateZ(0)",
                                willChange: "transform",
                                backfaceVisibility: "hidden",
                            }}
                        />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
                    </div>
                ) : (
                    <div className="absolute inset-0 z-20 overflow-hidden">
                        <video
                            src={linkPreview}
                            autoPlay
                            muted
                            loop
                            playsInline
                            crossOrigin="anonymous"
                            onError={() => setPreviewError(true)}
                            className="absolute inset-0 w-full h-full object-cover z-20"
                            style={{
                                transform: "translateZ(0)",
                                willChange: "transform",
                                backfaceVisibility: "hidden",
                            }}
                        />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
                    </div>
                )
            ) : (
                <img
                    src={poster}
                    alt={title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-all duration-300"
                />
            )}

            {hover && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <RatingCircle rating={rating} size={140} />
                </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white transition-all duration-300">
                <h3 className="text-lg font-semibold">{title}</h3>
                {hover && <p className="text-sm text-gray-300 mt-1 line-clamp-2">{description}</p>}
            </div>
        </motion.div>
    );
}
