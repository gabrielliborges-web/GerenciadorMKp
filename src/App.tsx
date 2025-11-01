import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useMovieNotifications, } from "./hooks/useMovieNotifications";

function App() {
  useMovieNotifications();
  return <>
    <AppRoutes />
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </>
}

export default App;
