import '@fontsource/roboto';
import '@fontsource/pacifico';
import './App.css';
import {Route, Routes} from "react-router-dom";

import AlgorithmsPage from "./components/algorithms-page";
import HomePage from "./components/home-page";

// Main Page -- What is displayed across all pages
function App() {

    return (
        <div className="bg-wku-red text-center relative">

            {/** Grainy Noise Overlay **/}
            <div className="absolute inset-0 bg-grainy-noise bg-grainy-size bg-grainy-position opacity-20 pointer-events-none"></div>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/algorithms" element={<AlgorithmsPage />} />
            </Routes>

        </div>
    );
}


export default App;
