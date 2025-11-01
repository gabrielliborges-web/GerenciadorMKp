import { useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import Loading from "../components/common/Loading";
import MovieCard from "../components/movies/MovieCard";
import { useMoviesContext } from "../context/MoviesContext";
import MovieStatusButton from "../components/movies/MovieStatusButton";
import MovieVisibilityButton from "../components/movies/MovieVisibilityButton";

export default function ConfigMovies() {
    const { userMovies, loading, page, totalPages, loadUserMovies } = useMoviesContext();

    const handlePageChange = (page: number) => {
        loadUserMovies(page);
    };

    useEffect(() => {
        loadUserMovies(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (loading) return <Loading text="Carregando seus filmes..." />;

    return (
        <main className="relative w-full min-h-screen pb-10">
            <div className="relative z-10 max-w-8xl mx-auto w-full px-4 sm:px-6 md:px-8 flex flex-col gap-8 py-6">
                <h1 className="text-3xl font-semibold text-white">🎬 Meus Filmes</h1>

                <div className="bg-[#ebeaf8]/[0.05] rounded-md p-6 sm:p-8 border border-[#ebeaf8]/[0.08]">
                    {userMovies.length === 0 ? (
                        <p className="text-center text-white/70">
                            Você ainda não possui filmes cadastrados.
                        </p>
                    ) : (
                        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center">
                            {userMovies.map((m) => (
                                <div
                                    key={m.id}
                                    className="w-full h-full transition-transform hover:scale-[1.02]"
                                >
                                    <Link to={`/movie/${m.id}`}>
                                        <MovieCard
                                            title={m.title}
                                            description={m.description}
                                            imageCover={m.imageCover}
                                            rating={m.ratingAvg}
                                            linkPreview={m.linkPreview}
                                        />
                                    </Link>

                                    <div className="flex gap-2 mt-2 max-w-[200px]">
                                        <MovieStatusButton id={m.id} status={m.status} />
                                        <MovieVisibilityButton id={m.id} visibility={m.visibility} />
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
