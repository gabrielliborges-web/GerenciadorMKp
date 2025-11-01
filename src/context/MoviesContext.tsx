import { createContext, useContext, useState } from "react";
import { useMovies } from "../hooks/useMovies";
import type { MovieFilters } from "../types/movies";
import { getUserMovies, updateMovieStatus } from "../lib/movies";

interface MoviesContextProps {
    data: any[];
    loading: boolean;
    page: number;
    totalPages: number;
    filters: MovieFilters;
    loadMovies: (page?: number, filters?: MovieFilters) => Promise<void>;
    setFilters: (filters: MovieFilters) => void;
    refreshMovies: () => Promise<void>;

    userMovies: any[];
    userPage: number;
    userTotalPages: number;
    loadUserMovies: (page?: number) => Promise<void>;
    changeMovieStatus: (id: number, status: "DRAFT" | "PUBLISHED") => Promise<void>;
}

const MoviesContext = createContext<MoviesContextProps | undefined>(undefined);

export const MoviesProvider = ({ children }: { children: React.ReactNode }) => {
    const movies = useMovies();

    const [userMovies, setUserMovies] = useState<any[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);

    const refreshMovies = async () => {
        await movies.loadMovies(movies.page, movies.filters);
    };

    const loadUserMovies = async (pageNumber = 1) => {
        setUserLoading(true);
        try {
            const res = await getUserMovies(pageNumber);
            setUserMovies(res.data);
            setUserPage(res.meta.page);
            setUserTotalPages(res.meta.totalPages);
        } catch (err) {
            console.error("❌ Erro ao carregar filmes do usuário:", err);
        } finally {
            setUserLoading(false);
        }
    };

    const changeMovieStatus = async (id: number, status: "DRAFT" | "PUBLISHED") => {
        try {
            await updateMovieStatus(id, status);
            await loadUserMovies(userPage);
        } catch (err) {
            console.error("❌ Erro ao atualizar status do filme:", err);
        }
    };

    return (
        <MoviesContext.Provider
            value={{
                ...movies,
                refreshMovies,

                userMovies,
                userPage,
                userTotalPages,
                loadUserMovies,
                changeMovieStatus,

                loading: movies.loading || userLoading,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

export const useMoviesContext = () => {
    const context = useContext(MoviesContext);
    if (!context)
        throw new Error("useMoviesContext must be used within a MoviesProvider");
    return context;
};
