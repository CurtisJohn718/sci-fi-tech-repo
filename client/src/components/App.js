import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import NavBar from "./Navbar";
import Home from "./Home";
import Universes from "./Universes";
import Characters from "./Characters";
import Technologies from "./Technologies";
import Reviews from "./Reviews";

function App() {
  return (
    <Router>
      <h1>Sci-Fi Tech Repo</h1>
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/universes" element={<Universes />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
    </Router>
  );
}

export default App;
