import { Link } from "react-router-dom";
import MovieActions from "../components/movies/MovieActions";
import Pagination from "../components/common/Pagination";
import MovieCard from "../components/movies/MovieCard";
import Loading from "../components/common/Loading";
import { useMoviesContext } from "../context/MoviesContext";
import { useEffect } from "react";


export default function Home() {
    const { data, loading, page, totalPages, loadMovies } = useMoviesContext();

    const handlePageChange = (page: number) => {
        loadMovies(page);
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [data]);

    if (loading) return <Loading text="Carregando filmes..." />;

    console.log(totalPages)

    return (
        <main className="relative w-full min-h-screen pb-10">
            <div className="relative z-10 max-w-8xl mx-auto w-full px-4 sm:px-6 md:px-8 flex flex-col gap-8 py-6">
                <MovieActions />

                <div className="bg-[#ebeaf8]/[0.05] rounded-md p-6 sm:p-8 border border-[#ebeaf8]/[0.08]">
                    {data.length === 0 ? (
                        <p className="text-center text-white/70">Nenhum filme encontrado.</p>
                    ) : (
                        <section className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center">
                            {data.map((m) => (
                                <Link
                                    key={m.id}
                                    to={`/movie/${m.id}`}
                                    className="w-full h-full cursor-pointer transition-transform hover:scale-[1.02]"
                                >
                                    <MovieCard
                                        title={m.title}
                                        description={m.description}
                                        imageCover={m.imageCover}
                                        rating={m.ratingAvg}
                                        linkPreview={m.linkPreview}
                                    />
                                </Link>
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
