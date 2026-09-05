import { Link } from "react-router-dom";

function Home() {
    return (
        <main
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#080D18]
                text-[#F1F5F9]
                bg-[radial-gradient(circle_at_center,_#16213a_0%,_#080D18_60%)]
                select-none
            "
        >
            <div className="flex flex-col items-center text-center px-6">

                <h1 className="text-8xl font-bold tracking-tight">
                    D<span className="text-blue-500">.</span>
                    A<span className="text-blue-500">.</span>
                    V<span className="text-blue-500">.</span>
                    E
                </h1>

                <p className="mt-3 text-2xl text-[#94A3B8] max-w-2xl">
                    A Dynamic Algorithm Visualizer for Education
                </p>

                <div className="flex flex-row items-center justify-center gap-4 mt-10">

                    <Link
                        to="/algorithms"
                        className="
                            px-7
                            py-3
                            rounded-lg
                            bg-blue-600
                            hover:bg-blue-500
                            font-medium
                            transition-all
                            duration-200
                            active:scale-95
                            hover:scale-105
                            cursor-pointer
                        "
                    >
                        Explore Algorithms
                    </Link>

                    <button
                        className="
                            px-7
                            py-3
                            rounded-lg
                            border
                            border-slate-700
                            hover:border-slate-500
                            hover:bg-slate-800/40
                            transition-all
                            duration-200
                            cursor-pointer
                            active:scale-95
                            hover:scale-105
                        "
                    >
                        About
                    </button>

                    <button
                        className="
                            px-7
                            py-3
                            rounded-lg
                            border
                            border-slate-700
                            hover:border-slate-500
                            hover:bg-slate-800/40
                            transition-all
                            duration-200
                            active:scale-95
                            hover:scale-105
                            cursor-pointer
                        "
                    >
                        Credits
                    </button>

                </div>

            </div>
        </main>
    );
}

export default Home;