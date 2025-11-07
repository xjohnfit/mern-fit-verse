import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div>
      <Toaster position="bottom-right" richColors toastOptions={{
        style: {
          fontSize: '16px',
        }
      }} />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;