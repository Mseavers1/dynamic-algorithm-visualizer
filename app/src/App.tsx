import '@fontsource/roboto';
import '@fontsource/pacifico';
import './App.css';
import {useEffect, useState} from "react";

// Main Page -- What is displayed across all pages
function App() {

    const [showStickyHeader, setShowStickyHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 700) {
                setShowStickyHeader(true);
            } else {
                setShowStickyHeader(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollTo = (id: string) => {
        const aboutSection = document.getElementById(id);
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div className="bg-wku-red text-center relative">

            {/** Grainy Noise Overlay **/}
            <div
                className="absolute inset-0 bg-grainy-noise bg-grainy-size bg-grainy-position opacity-20 pointer-events-none"></div>

            <div className="min-h-screen flex flex-col items-center justify-center text-center relative" id="top">

                {/** Radial Noise Overlay **/}
                <div className="absolute inset-0 bg-radial-noise opacity-20 pointer-events-none"></div>

                {/** Title **/}
                <h1 className="select-none font-playfair text-wkuYellow text-7xl md:text-8xl font-bold mb-8 drop-shadow-[5px_10px_12px_rgba(0,0,0,0.4)]">
                    DAVE
                </h1>
                <p className="select-none font-roboto text-sm sm:text-base md:text-lg lg:text-2xl text-white font-medium mb-16 tracking-widest-two drop-shadow-[5px_10px_12px_rgba(0,0,0,0.2)]">
                    A <span className="font-playfair font-semibold text-wkuYellow">D</span>ynamic <span
                    className="font-playfair font-semibold text-wkuYellow">A</span>lgorithm <span
                    className="font-playfair font-semibold text-wkuYellow">V</span>isualizer for <span
                    className="font-playfair font-semibold text-wkuYellow">E</span>ducation
                </p>

                {/** Buttons **/}
                <div className="select-none flex space-x-3 md:space-x-6 lg:space-x-8 md:text-2xl mb-8">
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => {
                            handleScrollTo('about')
                        }}>
                        About
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => {
                            handleScrollTo('instructions')
                        }}>
                        How to Use
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
                        Algorithms
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => {
                            handleScrollTo('credits')
                        }}>
                        Credits
                    </button>
                </div>

            </div>

            {/** Secondary Header **/}
            <div
                className={`fixed top-0 left-0 right-0 bg-wku-red text-white flex justify-between items-center p-4 shadow-lg z-50 transition-all duration-500 ease-in-out ${showStickyHeader ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            >
                <h1 className="font-playfair text-wkuYellow text-2xl font-bold drop-shadow-[5px_10px_12px_rgba(0,0,0,0.4)]">
                    DAVE - <span className="select-none font-roboto text-sm sm:text-base md:text-lg lg:text-lg text-white font-medium mb-16 tracking-widest drop-shadow-[5px_10px_12px_rgba(0,0,0,0.2)]">
                        A <span className="font-playfair font-semibold text-wkuYellow">D</span>ynamic <span
                        className="font-playfair font-semibold text-wkuYellow">A</span>lgorithm <span
                        className="font-playfair font-semibold text-wkuYellow">V</span>isualizer for <span
                        className="font-playfair font-semibold text-wkuYellow">E</span>ducation
                    </span>
                </h1>
                <div className="flex space-x-3 md:space-x-6 lg:space-x-8">
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => handleScrollTo('about')}
                    >
                        About
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => handleScrollTo('instructions')}
                    >
                        How to Use
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                    >
                        Algorithms
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => handleScrollTo('credits')}
                    >
                        Credits
                    </button>
                    <button
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => handleScrollTo('top')}
                    >
                        Top
                    </button>
                </div>
            </div>


            {/** About Section **/}
            <div id="about" className="min-h-screen text-white flex items-center justify-center">
                <h2 className="text-4xl">About DAVE</h2>
            </div>

            {/** How To Use Section **/}
            <div id="instructions" className="min-h-screen text-white flex items-center justify-center">
                <h2 className="text-4xl">How to Use DAVE?</h2>
            </div>

            {/** Credits Section **/}
            <div id="credits" className="min-h-screen text-white flex items-center justify-center">
                <h2 className="text-4xl">Credits</h2>
            </div>
        </div>
    );
}


export default App;
