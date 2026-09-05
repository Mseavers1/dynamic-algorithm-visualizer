import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import Header from "./components/Header";

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/algorithms" element={<Algorithms />} />
            </Routes>
        </>
    );
}

export default App;