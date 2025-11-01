import Header from "./Header";
import Footer from "./Footer";
import BackgroundMovies from "../../assets/Background_movies_opacity.png";

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background-dark dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark transition-colors duration-300">
            <div className="relative z-50">

                <Header />
            </div>

            <main className="relative flex-1 w-full overflow-x-hidden">
                <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[564px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${BackgroundMovies})` }}
                />

                <div className="relative z-10 max-w-8xl mx-auto w-full px-4 sm:px-6 md:px-8 flex flex-col gap-8 py-6">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}
