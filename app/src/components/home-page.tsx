import React from "react";

const HomePage: React.FC = () => {
    return (
        <div>
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
            <div id="credits" className="min-h-screen text-white flex items-center justify-center">
                <h2 className="text-4xl">Credits</h2>
            </div>
        </div>
    );
}

export default HomePage;