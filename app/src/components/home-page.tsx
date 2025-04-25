import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const HomePage: React.FC = () => {

    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const nav = useNavigate();

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

    // Main menu page
    const titleHeader = () => {
        return (
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
                        className="font-roboto bg-transparent text-gray-300 px-6 py-3 rounded-md hover:text-wkuYellow hover:scale-105 transition-all drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]"
                        onClick={() => {
                            nav('/algorithms')
                        }}>
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
        );
    }

    // Header for the main page
    const secondaryHeader = () => {
        return (
            <div
            className={`fixed top-0 left-0 right-0 bg-wku-red text-white flex justify-between items-center p-4 shadow-lg z-50 transition-all duration-500 ease-in-out ${showStickyHeader ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            >
                <h1 className="font-playfair text-wkuYellow text-2xl font-bold drop-shadow-[5px_10px_12px_rgba(0,0,0,0.4)]">
                    DAVE - <span
                    className="select-none font-roboto text-sm sm:text-base md:text-lg lg:text-lg text-white font-medium mb-16 tracking-widest drop-shadow-[5px_10px_12px_rgba(0,0,0,0.2)]">
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
                        onClick={() => {
                            nav('/algorithms')
                        }}
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
        );
    }

    return (
        <div>

            {/** Main Header **/}
            {titleHeader()}

            {/** Secondary Header **/}
            {secondaryHeader()}

            {/** About Section **/}
            <div
                id="about"
                className="min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 space-y-6"
            >
                <h2 className="text-4xl font-bold mb-4">About</h2>

                <section className="text-center space-y-4">
                    <p>
                        Over the past decade, visualization technology has grown in popularity, particularly at
                        universities,
                        enabling students and developers to better understand complex algorithms and data structures.
                    </p>
                    <p>
                        One of the key figures who popularized this trend is <strong>Dr. David Galles</strong> from the
                        University of San Francisco. Although earlier models existed, Dr. Galles's work introduced
                        modern
                        solutions and accessibility, allowing more users to interact with his visualizations.
                    </p>
                </section>

                <section className="text-center space-y-4">
                    <p>
                        Inspired by Dr. Galles, many new visualization models have emerged, each offering unique
                        algorithms
                        and designs. Yet, for all their merits, I felt something was missing in existing tools.
                    </p>
                    <p>
                        <strong>DAVE</strong> (Dynamic Algorithm Visualizer for Education) builds on the strengths of
                        models
                        like Dr. Galles's, adding new dimensions such as pseudocode animations and mathematical
                        complexity
                        breakdowns. These features aim to bridge the gap between visualization and deeper understanding.
                    </p>
                </section>

                <section className="text-center space-y-4">
                    <p>
                        While traditional visualizations like tree diagrams and sorting graphs are invaluable, they
                        often
                        omit key details such as algorithm complexity and implementation insights. DAVE integrates these
                        elements to provide a comprehensive learning tool for students and developers alike.
                    </p>
                </section>
            </div>

            {/** How To Use Section **/}
            <div id="instructions" className="min-h-screen text-white flex items-center justify-center">
                <h2 className="text-4xl">How to Use?</h2>
            </div>

            {/** Credits Section **/}
            <div id="credits" className="min-h-screen text-white flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 space-y-6">
                <h2 className="text-4xl">Credits</h2>

                <section className="text-center space-y-4">
                    <p>
                        Dr. David Galles Visualizer: https://www.cs.usfca.edu/~galles/visualization/Algorithms.html
                    </p>
                </section>
            </div>
        </div>
    );
}

export default HomePage;