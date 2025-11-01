import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { deleteMovie, getMovieById } from "../lib/movies";
import { useAuth } from "../context/AuthContext";

import InfoCard from "../components/movies/InfoCard";
import Button from "../components/common/Button";
import RatingCircle from "../components/movies/RatingCircle";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import NotFoundState from "../components/common/NotFoundState";
import MovieTrailer from "../components/movies/MovieTrailer";
import MovieDrawer from "../components/movies/MovieDrawer";
import MovieTeam from "../components/movies/MovieTeam";

export default function MovieDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const navigate = useNavigate();

    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);
    const [movieData, setMovieData] = useState<any>({});
    const [errorType, setErrorType] = useState<"notFound" | "forbidden" | null>(null);
    const [hasValidImage, setHasValidImage] = useState(true);
    const [loadingReqs, setLoadingReqs] = useState(false);

    const handleDelete = async () => {
        try {
            setLoadingReqs(true)
            await deleteMovie(movie?.id);
            toast.success("Filme deletado com sucesso!");
            setOpenDeleteModal(false);
            navigate("/movies");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erro ao deletar o filme.");
        } finally {
            setLoadingReqs(false)
        }
    };

    useEffect(() => {
        if (!id) return;

        const loadMovie = async () => {
            try {
                setLoading(true);
                const data = await getMovieById(id);

                const mappedMovie = {
                    ...data,
                    releaseDate: data.releaseDate
                        ? new Date(data.releaseDate).toISOString().split("T")[0]
                        : "",
                    actors:
                        data.actors?.map((a: string) => ({ name: a })) || [],

                    producers:
                        data.producers?.map((p: string) => ({ name: p })) || [],

                    genres:
                        data.genres?.map((g: any) => ({
                            id: g.id || g.name,
                            name: g.name,
                        })) || [],

                    user: data.user || { id: data.userId, name: "Usuário desconhecido" },
                    rating: Number(data.ratingAvg) || 0,
                    imagePoster: data.imagePoster || data.imageCover,
                };

                setMovie(mappedMovie);
                setMovieData(mappedMovie);
                setErrorType(null);
            } catch (err: any) {
                console.error(err);
                if (err.status === 403) {
                    setErrorType("forbidden");
                } else if (err.status === 404) {
                    setErrorType("notFound");
                } else {
                    toast.error(err.message || "Erro ao carregar o filme.");
                }
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    console.log(movie)

    if (loading) return <Loading text="Carregando filme..." />;
    if (errorType === "forbidden")
        return (
            <NotFoundState
                title="Acesso negado"
                description="Este filme é um rascunho privado e só pode ser visualizado pelo criador."
                actionLabel="Voltar para Home"
                redirectTo="/movies"
            />
        );

    if (errorType === "notFound")
        return (
            <NotFoundState
                title="Filme não encontrado"
                description="O filme que você está tentando acessar pode ter sido removido ou está temporariamente indisponível."
                actionLabel="Voltar para Home"
                redirectTo="/movies"
            />
        );

    return (
        <main className="relative w-full text-white overflow-hidden px-10">
            <div className="absolute top-0 left-0 w-full h-[300px] sm:h-[400px] md:h-[603px] hidden md:block">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${movie?.imagePoster})`,
                        backgroundPosition: "center top",
                    }}
                />

                <div className="absolute inset-0 bg-black/80" />
            </div>

            <section className="relative z-10 w-full max-w-[1440px] mx-auto pt-10">

                {movie?.imageCover && hasValidImage && (
                    <div className="flex justify-center md:hidden order-1 mb-6">
                        <img
                            src={movie?.imageCover}
                            alt={movie?.title}
                            onError={() => setHasValidImage(false)}
                            className="w-[374px] h-[500px] object-cover rounded-[4px] shadow-[0_1px_5px_0_#00000033]"
                        />
                    </div>
                )}


                <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 order-2">
                    {movie?.userId === user?.id && (
                        <div className="flex w-full md:w-auto gap-1 order-1 md:order-2">
                            <Button
                                variant="secondary"
                                className="h-[40px] w-[30%] md:w-[90px] text-sm md:text-base"
                                onClick={() => setOpenDeleteModal(true)}
                            >
                                Deletar
                            </Button>
                            <Button
                                variant="primary"
                                className="h-[40px] w-[70%] md:w-[120px] text-sm md:text-base"
                                onClick={() => setOpenEditDrawer(true)}
                            >
                                Editar
                            </Button>
                        </div>
                    )}

                    <div className="order-2 md:order-1 text-center md:text-left w-full md:w-auto">
                        <h1 className="text-3xl md:text-4xl font-bold">{movie?.title}</h1>
                        {movie?.originalTitle && (
                            <p className="text-sm md:text-base text-gray-300">
                                Título original:{" "}
                                <span className="font-normal">{movie?.originalTitle}</span>
                            </p>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {movie?.imageCover && hasValidImage && (
                        <div className="hidden md:flex justify-center md:justify-start">
                            <img
                                src={movie?.imageCover}
                                alt={movie?.title}
                                className="w-[374px] h-[500px] object-cover rounded-[4px] shadow-[0_1px_5px_0_#00000033]"
                            />
                        </div>
                    )}

                    <div className="col-span-2 rounded-md p-4 flex flex-col gap-6">
                        {(movie?.tagline || movie?.votes || movie?.rating) && (
                            <div className="grid grid-cols-[2fr_1fr_auto] items-center gap-4">
                                {movie?.tagline && (
                                    <p className="italic text-gray-300 text-center md:text-left text-base md:text-lg">
                                        {movie?.tagline}
                                    </p>
                                )}

                                {(movie?.indicativeRating || movie?.votes) && (
                                    <div className="flex justify-center gap-2">
                                        {movie?.indicativeRating && (
                                            <InfoCard
                                                title="Classificação Indicativa"
                                                content={`${movie?.indicativeRating} anos`}
                                                compact
                                                className="min-w-[140px] text-center"
                                            />
                                        )}
                                        {movie?.votes && (
                                            <InfoCard
                                                title="Votos"
                                                content={movie?.votes}
                                                compact
                                                className="min-w-[140px] text-center"
                                            />
                                        )}
                                    </div>
                                )}

                                {movie?.ratingAvg && (
                                    <div className="flex justify-center md:justify-end">
                                        <RatingCircle
                                            rating={Number(movie?.ratingAvg)}
                                            size={70}
                                            strokeWidth={5}
                                            bgColor="#1e1e1e"
                                            className="shrink-0"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4">
                                {movie?.description && (
                                    <InfoCard
                                        title="Sinopse"
                                        content={
                                            <p className="leading-relaxed text-justify">
                                                {movie?.description}
                                            </p>
                                        }
                                    />
                                )}

                                {movie?.genres?.length > 0 && (
                                    <InfoCard
                                        title="Gêneros"
                                        content={
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {movie?.genres.map((g: any) => (
                                                    <span
                                                        key={g.name}
                                                        className="px-3 py-1 bg-primary-darkA-3 rounded-sm text-sm"
                                                    >
                                                        {g.name}
                                                    </span>
                                                ))}
                                            </div>
                                        }
                                    />
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {movie?.releaseDate && (
                                        <InfoCard
                                            title="Lançamento"
                                            content={new Date(movie?.releaseDate).toLocaleDateString("pt-BR")}
                                            compact
                                        />
                                    )}
                                    {movie?.duration && (
                                        <InfoCard
                                            title="Duração"
                                            content={`${Math.floor(movie?.duration / 60)}h ${movie?.duration % 60
                                                }m`}
                                            compact
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {movie?.status && (
                                        <InfoCard title="Situação" content={movie?.status} compact />
                                    )}
                                    {movie?.language && (
                                        <InfoCard title="Idioma" content={movie?.language} compact />
                                    )}
                                </div>

                                {(movie?.budget || movie?.revenue || movie?.profit) && (
                                    <div className="grid grid-cols-3 gap-4">
                                        {movie?.budget && (
                                            <InfoCard
                                                title="Orçamento"
                                                content={`$${(Number(movie?.budget) / 1_000_000).toFixed(0)}M`}
                                                compact
                                            />
                                        )}
                                        {movie?.revenue && (
                                            <InfoCard
                                                title="Receita"
                                                content={`$${(Number(movie?.revenue) / 1_000_000).toFixed(2)}M`}
                                                compact
                                            />
                                        )}
                                        {movie?.profit && (
                                            <InfoCard
                                                title="Lucro"
                                                content={`$${(Number(movie?.profit) / 1_000_000).toFixed(2)}M`}
                                                compact
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {movie?.linkPreview && <MovieTrailer linkPreview={movie?.linkPreview} />}

            <MovieTeam
                director={movie.director}
                actors={movie.actors}
                producers={movie.producers}
            />

            <Modal
                title="Confirmar exclusão"
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setOpenDeleteModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleDelete} isLoading={loadingReqs}>
                            Confirmar
                        </Button>
                    </>
                }
            >
                <div className="p-2">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Tem certeza que deseja deletar o filme{" "}
                        <span className="font-semibold text-white">"{movie?.title}"</span>?
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Esta ação é permanente e não poderá ser desfeita.
                    </p>
                </div>
            </Modal>

            <MovieDrawer
                mode="edit"
                open={openEditDrawer}
                movie={movieData}
                onClose={() => setOpenEditDrawer(false)}
                onSaved={async (updatedMovie) => {
                    if (updatedMovie) {
                        setMovie(updatedMovie);
                        setMovieData(updatedMovie);
                    } else {
                        if (!id) return;
                        const data = await getMovieById(id);
                        setMovie(data);
                        setMovieData(data);
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });

                }}
            />

        </main>
    );
}
