import { Sun, Moon, Settings } from "lucide-react";
import Button from "../common/Button";
import { useTheme } from "../../hooks/useTheme";
import { useNavigate, useLocation } from "react-router-dom";
import LogoSm from "../../assets/LogoSm.png";
import LogoLg from "../../assets/LogoLg.png";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../common/NotificationDropdown";

export default function Header() {
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = location.pathname === "/login";
    const isSignup = location.pathname === "/signup";

    const handleAction = () => {
        if (isAuthenticated) {
            logout();
        } else if (isLogin) {
            navigate("/signup");
        } else if (isSignup) {
            navigate("/login");
        }
    };

    const buttonLabel = isAuthenticated
        ? "Logout"
        : isLogin
            ? "Cadastrar"
            : "Login";

    return (
        <header className="w-full h-[68px] bg-mauve-light-12/90 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border-subtle/20 flex items-center justify-between px-8 font-montserrat transition-colors duration-300">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <img src={LogoSm} alt="Cubos Movies" className="h-[32px] block md:hidden" />
                <img src={LogoLg} alt="Cubos Movies" className="h-[32px] hidden md:block" />
            </div>

            <div className="flex items-center gap-3">
                {user && <>
                    <NotificationDropdown />

                    <Button
                        variant="icon"
                        onClick={() => navigate("/config/movies")}
                        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors duration-300"
                    >
                        <span
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDark
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                                }`}
                        >
                            <Settings className="w-5 h-5 text-white" />
                        </span>
                    </Button>
                </>}

                <Button
                    variant="icon"
                    onClick={toggleTheme}
                    className="relative overflow-hidden transition-all duration-500"
                >
                    <span
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDark
                            ? "opacity-0 rotate-90 scale-0"
                            : "opacity-100 rotate-0 scale-100"
                            }`}
                    >
                        <Sun className="w-5 h-5 text-white" />
                    </span>
                    <span
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDark
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 -rotate-90 scale-0"
                            }`}
                    >
                        <Moon className="w-5 h-5 text-white" />
                    </span>
                </Button>
                <Button variant="primary" onClick={handleAction}>
                    {buttonLabel}
                </Button>
            </div>
        </header>
    );
}
