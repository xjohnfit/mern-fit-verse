import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
 
export default App