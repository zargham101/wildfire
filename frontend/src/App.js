import Navbar from "./components/Navbar";
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import LandinPage from "./components/LandingPage";
import Footer from "./components/Footer";
function App() {
  return (
    <>
      <Navbar />
      <LandinPage/>
      <Footer/>
    </>
  );
}

export default App;
