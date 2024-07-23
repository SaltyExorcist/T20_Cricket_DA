import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scatter from "./pages/Scatter";
import './App.css';


function App() {

  return (
    <div>
   <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/Scatter" element={<Scatter />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;