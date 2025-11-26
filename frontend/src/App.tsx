import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/common/ScrollToTop";

function App() {
  return (
    <div>
      <ScrollToTop />
      <Toaster position="bottom-right" richColors toastOptions={{
        style: {
          fontSize: '16px',
        }
      }} />
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;