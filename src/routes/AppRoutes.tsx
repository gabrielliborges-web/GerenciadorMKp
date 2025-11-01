import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import MovieDetail from "../pages/MovieDetails";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound";
import { MoviesProvider } from "../context/MoviesContext";
import ConfigMovies from "../pages/ConfigMovies";

export default function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <AppLayout>
                        <Login />
                    </AppLayout>
                }
            />
            <Route
                path="/signup"
                element={
                    <AppLayout>
                        <Signup />
                    </AppLayout>
                }
            />

            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route
                path="/movies"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MoviesProvider>
                            <AppLayout>
                                <Home />
                            </AppLayout>
                        </MoviesProvider>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/config/movies"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MoviesProvider>
                            <AppLayout>
                                <ConfigMovies />
                            </AppLayout>
                        </MoviesProvider>
                    </ProtectedRoute>
                }
            />


            <Route
                path="/movie/:id"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MoviesProvider>
                            <AppLayout>
                                <MovieDetail />
                            </AppLayout>
                        </MoviesProvider>
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <AppLayout>
                        <NotFound />
                    </AppLayout>
                }
            />
        </Routes>
    );
}
