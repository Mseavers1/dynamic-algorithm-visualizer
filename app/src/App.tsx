import React from 'react';
import '@fontsource/roboto';
import '@fontsource/pacifico';
import './App.css';

// Main Page -- What is displayed across all pages
function App() {
    return (
        <div className="bg-wku-red min-h-screen flex flex-col items-center justify-center text-center relative">

            {/** Grainy Noise Overlay **/}
            <div className="absolute inset-0 bg-grainy-noise bg-grainy-size bg-grainy-position opacity-20 pointer-events-none"></div>


            {/** Radial Noise Overlay **/}
            <div className="absolute inset-0 bg-radial-noise opacity-20 pointer-events-none"></div>

            {/** Title **/}
            <h1 className="font-playfair text-wkuYellow text-7xl md:text-8xl font-bold mb-8 drop-shadow-[5px_10px_12px_rgba(0,0,0,0.4)]">
                D.A.V.E.
            </h1>
            <p className="font-roboto text-sm sm:text-base md:text-lg lg:text-2xl text-white font-medium mb-16 tracking-widest-two drop-shadow-[5px_10px_12px_rgba(0,0,0,0.2)]">
                A <span className="font-playfair font-semibold text-wkuYellow">D</span>ynamic <span
                className="font-playfair font-semibold text-wkuYellow">A</span>lgorithm <span
                className="font-playfair font-semibold text-wkuYellow">V</span>isualizer for <span
                className="font-playfair font-semibold text-wkuYellow">E</span>ducation
            </p>

            {/** Buttons **/}
            <div className="flex space-x-4 md:space-x-6 lg:space-x-8 md:text-2xl mb-8">
                <button
                    className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                    About
                </button>
                <button
                    className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                    How to Use
                </button>
                <button
                    className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                    Algorithms
                </button>
                <button
                    className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                    Credits
                </button>
            </div>
        </div>
    );
}


export default App;
