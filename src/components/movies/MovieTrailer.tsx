import { useState } from "react";
import { getYouTubeId } from "../../utils/pathVideo";

interface MovieTrailerProps {
    linkPreview?: string;
    title?: string;
}

export default function MovieTrailer({ linkPreview, title = "Trailer" }: MovieTrailerProps) {
    const [isValidVideo, setIsValidVideo] = useState(true);

    if (!linkPreview || !isValidVideo) return null;

    const isYouTube =
        linkPreview.includes("youtube.com") || linkPreview.includes("youtu.be");

    return (
        <section className="w-full mt-10 mb-4">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>

            <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-lg bg-black">
                {isYouTube ? (
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(
                            linkPreview
                        )}?autoplay=0&controls=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setIsValidVideo(false)}
                    />
                ) : (
                    <video
                        src={linkPreview}
                        controls
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setIsValidVideo(false)}
                    />
                )}
            </div>
        </section>
    );
}
