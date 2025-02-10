import '@fontsource/roboto';
import '@fontsource/pacifico';
import './App.css';
import {Route, Routes, useLocation} from "react-router-dom";

import AlgorithmsPage from "./components/algorithms-page";
import HomePage from "./components/home-page";
import Animator from "./components/animator"
import React from "react";

// Main Page -- What is displayed across all pages
function App() {

    const loc = useLocation();

    const mainHeader = () => {
        return (
            <div className="fixed top-0 left-0 right-0 bg-wku-red text-white flex items-center justify-between h-30 lg:h-10 xl:h-10 2xl:h-24 px-4">
                {/* Title */}
                <h1 className="font-playfair text-wkuYellow text-2xl font-bold drop-shadow-[5px_10px_12px_rgba(0,0,0,0.4)]">
                    DAVE - <span
                    className="select-none font-roboto text-sm sm:text-base md:text-lg lg:text-lg text-white font-medium mb-16 tracking-widest drop-shadow-[5px_10px_12px_rgba(0,0,0,0.2)]">
                            A <span className="font-playfair font-semibold text-wkuYellow">D</span>ynamic <span
                    className="font-playfair font-semibold text-wkuYellow">A</span>lgorithm <span
                    className="font-playfair font-semibold text-wkuYellow">V</span>isualizer for <span
                    className="font-playfair font-semibold text-wkuYellow">E</span>ducation
                        </span>
                </h1>

                {/* Buttons */}
                <div className="flex space-x-3 md:space-x-6 lg:space-x-8">
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                        Home
                    </button>

                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                        Algorithms
                    </button>
                </div>
            </div>
        );
    };

    const mainFooter = () => {

        return (
            <div className="fixed right-0 bottom-0 bg-wku-red text-white flex items-center justify-between w-full p-3">

            </div>
        )
    }


    return (
        <div className="bg-wku-red text-center relative">

            {/** Grainy Noise Overlay **/}
            <div
                className="absolute inset-0 bg-grainy-noise bg-grainy-size bg-grainy-position opacity-20 pointer-events-none"></div>

            {/** Main Header **/}
            {loc.pathname !== "/" ? mainHeader() : ""}

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/algorithms" element={<AlgorithmsPage/>}/>
                <Route path="/algorithms/animate/:algorithmType" element={<Animator/>}/>
            </Routes>

            {/** Main Footer **/}
            {loc.pathname !== "/" ? mainFooter() : ""}

        </div>
    );
}


export default App;
