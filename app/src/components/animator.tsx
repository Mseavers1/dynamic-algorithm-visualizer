import React, {useState} from "react";
import { Algorithm } from "./algorithms/algorithm_interface";
import { useParams } from "react-router-dom";
import { Pause } from "lucide-react";
import { MinHeap } from "./algorithms/min_heap";
import {MaxHeap} from "./algorithms/max_heap";

const Animator: React.FC = () => {
    const { algorithmType } = useParams<{ algorithmType: string }>();
    const [value, setValue] = React.useState<string | number>("");

    const [data, setData] = React.useState<(number | string)[]>([]);

    const header = () => {
        return (
            <div className="fixed top-20 left-0 right-0 bg-animator-bars text-white flex items-center p-4 gap-5">
                <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter value here"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        onClick={() => {algorithm?.insert(value); setValue("")}}>
                    Insert
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Delete
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Search
                </button>
            </div>
        );
    };

    const footer = () => {
        return (
            <div className="fixed bottom-6 left-0 right-0 bg-animator-bars text-white flex items-center justify-between p-4">
                <button className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-xl shadow-md active:scale-90 transition transform duration-150 ease-out hover:bg-blue-600 focus:outline-none">
                    <Pause size={24} />
                </button>
            </div>
        );
    };

    const RetrieveAlgorithm = (algorithmName: string | undefined): Algorithm | null => {
        if (algorithmName === "min-heap") {
            return new MinHeap(data, setData);
        }

        return null;
    };

    const algorithm = RetrieveAlgorithm(algorithmType);

    if (!algorithm) {
        return <div>Nothing</div>;
    }

    return (
        <div className="flex bg-white items-center justify-center min-h-screen">
            {header()}
            <div className="text-center">
                {algorithm.render()} {/* Now correctly using the display method */}
            </div>
            {footer()}
        </div>
    );
};

export default Animator;
