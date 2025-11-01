import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Notification {
  title: string;
  message?: string;
  link?: string;
  type?: string;
}

export function useMovieNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  console.log(notifications);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🔌 Conectado ao servidor Socket.IO");
    });

    socket.on("newMovie", (notification) => {
      console.log("🔔 Nova notificação:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { notifications };
}
