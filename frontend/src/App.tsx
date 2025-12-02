import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useSocket } from "@/hooks/useSocket";

function App() {
  // Initialize socket connection
  useSocket();

  return (
    <div>
      <ScrollToTop />
      <Toaster position="bottom-right" richColors toastOptions={{
        style: {
          fontSize: '16px',
        }
      }} />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;