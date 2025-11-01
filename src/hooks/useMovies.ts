import { useState, useEffect, useRef } from "react";
import { getAllMovies } from "../lib/movies";
import type { MovieFilters, MoviesState } from "../types/movies";
import toast from "react-hot-toast";

export interface UseMoviesReturn extends MoviesState {
  loadMovies: (page?: number, filters?: MovieFilters) => Promise<void>;
  setFilters: (filters: MovieFilters) => void;
}

export function useMovies(initialPage = 1, initialLimit = 10): UseMoviesReturn {
  const [state, setState] = useState<MoviesState>({
    data: [],
    loading: true,
    page: initialPage,
    totalPages: 1,
    limit: initialLimit,
    filters: {},
  });

  const lastFilters = useRef<MovieFilters>({});

  const loadMovies = async (
    page = state.page,
    filters = state.filters,
    showLoading = true
  ) => {
    if (showLoading) setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await getAllMovies({
        page,
        limit: state.limit,
        ...filters,
      });

      setState((prev) => ({
        ...prev,
        data: res.data,
        loading: false,
        page: res.meta.page,
        totalPages: res.meta.totalPages,
      }));
    } catch (err: any) {
      console.error("Erro ao carregar filmes:", err.message);

      if (err.status === 403) {
        toast.error(
          "Acesso negado. Faça login novamente ou verifique suas permissões."
        );
      } else if (err.status === 404) {
        toast.error("Nenhum filme encontrado.");
      } else {
        toast.error(err.message || "Erro ao carregar filmes.");
      }

      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (JSON.stringify(state.filters) !== JSON.stringify(lastFilters.current)) {
      lastFilters.current = state.filters;
      loadMovies(1, state.filters);
    }
  }, [state.filters]);

  const setFilters = (filters: MovieFilters) => {
    setState((prev) => ({ ...prev, filters }));
  };

  return { ...state, loadMovies, setFilters };
}
