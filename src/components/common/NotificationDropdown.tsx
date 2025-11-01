import { useState, useEffect, useRef } from "react";
import { Bell, Film, CheckCircle } from "lucide-react";
import { useMovieNotifications } from "../../hooks/useMovieNotifications";
import { useTheme } from "../../hooks/useTheme";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function NotificationDropdown() {
    const { notifications } = useMovieNotifications();
    const { isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-[9999]" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={classNames(
                    "relative p-2 rounded-full transition-colors",
                    isDark ? "hover:bg-zinc-800" : "hover:bg-gray-200"
                )}
            >
                <Bell className={classNames("w-5 h-5", isDark ? "text-white" : "text-zinc-700")} />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-[4px] py-[1px] font-semibold">
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={classNames(
                        "absolute right-0 mt-3 w-80 rounded-lg shadow-xl border p-3 z-[9999] transition-all duration-200",
                        isDark
                            ? "bg-zinc-900 border-zinc-800"
                            : "bg-white border-gray-200 shadow-lg"
                    )}
                >
                    <h3
                        className={classNames(
                            "text-sm font-semibold mb-2",
                            isDark ? "text-zinc-200" : "text-zinc-800"
                        )}
                    >
                        Notificações recentes
                    </h3>

                    {notifications.length === 0 ? (
                        <p
                            className={classNames(
                                "text-sm p-2 text-center",
                                isDark ? "text-zinc-400" : "text-zinc-500"
                            )}
                        >
                            Nenhuma notificação
                        </p>
                    ) : (
                        <ul
                            role="list"
                            className={classNames(
                                "divide-y -mb-3 max-h-72 overflow-y-auto pr-1",
                                isDark ? "divide-zinc-800" : "divide-gray-200"
                            )}
                        >
                            {notifications.map((n, idx) => (
                                <li key={idx} className="relative pb-3">
                                    {/* Linha vertical */}
                                    {idx !== notifications.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                "absolute top-5 left-[15px] -ml-px h-full w-0.5",
                                                isDark ? "bg-zinc-700" : "bg-gray-300"
                                            )}
                                        />
                                    )}

                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span
                                                className={classNames(
                                                    "flex items-center justify-center w-8 h-8 rounded-full ring-8",
                                                    isDark ? "ring-zinc-900" : "ring-white",
                                                    n.type === "MOVIE_CREATE"
                                                        ? "bg-blue-500"
                                                        : n.type === "MOVIE_UPDATE"
                                                            ? "bg-green-500"
                                                            : "bg-zinc-500"
                                                )}
                                            >
                                                {n.type === "MOVIE_CREATE" ? (
                                                    <Film className="w-4 h-4 text-white" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0 pt-1.5 space-y-0.5">
                                            <p
                                                className={classNames(
                                                    "text-sm font-medium",
                                                    isDark ? "text-zinc-100" : "text-zinc-800"
                                                )}
                                            >
                                                {n.title}
                                            </p>
                                            <p
                                                className={classNames(
                                                    "text-xs",
                                                    isDark ? "text-zinc-400" : "text-zinc-500"
                                                )}
                                            >
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
