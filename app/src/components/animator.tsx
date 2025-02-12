import React, {useEffect, useState} from "react";
import { Algorithm } from "./algorithms/algorithm_interface";
import { useParams } from "react-router-dom";
import { Pause } from "lucide-react";
import { MinHeap } from "./algorithms/min_heap";
import {MaxHeap} from "./algorithms/max_heap";
import {IData} from "./structures/IData";
import {BinaryTree} from "./structures/binary_tree";
import {Instruction, NodeData} from "./algorithms/tree_intructions";
import {TreeAnimator} from "./algorithms/animation_testing";
import {TreeAnimate} from "./algorithms/tree_animator";

const Animator: React.FC = () => {
    const { algorithmType } = useParams<{ algorithmType: string }>();
    const [value, setValue] = React.useState<string | number>("");

    const [isDynamicSize, setIsDynamicSize] = useState<boolean>(true);
    const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
    const [treeAnimator, setTreeAnimator] = useState<TreeAnimate | null>(null);

    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [nodes, setNodes] = useState<NodeData[]>([]);

    useEffect(() => {

        const x = new TreeAnimate();

        const RetrieveAlgorithm = (algorithmName: string | undefined): Algorithm | null => {
            if (algorithmName === "min-heap") {
                return new MinHeap(true, x as TreeAnimate);
            }
            return null;
        };

        setTreeAnimator(x);
        const algo = RetrieveAlgorithm(algorithmType);
        setAlgorithm(algo);
    }, [algorithmType]);

    const header = () => {
        return (
            <div className="fixed top-20 xl:top-10 left-0 right-0 bg-animator-bars text-white flex items-center h-20 lg:h-10 xl:h-10 2xl:h-[3.5rem] p-4 gap-5">
                <input
                    type="text"
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter value here"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        onClick={() => {algorithm?.insert(value); setValue("")}}>
                    Insert
                </button>
                <button className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        onClick={() => {algorithm?.delete(value); setValue(""); setInstructions([])}}>
                    Delete
                </button>
                <button className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Search
                </button>
            </div>
        );
    };

    const footer = () => {
        return (
            <div className="fixed bottom-6 left-0 right-0 bg-animator-bars text-white flex items-center justify-between p-4 h-30 lg:h-10 xl:h-10 2xl:h-[3.5rem]">
                <button className="flex items-center justify-center 2xl:w-10 2xl:h-10 xl:w-7 xl:h-7 bg-blue-500 text-white rounded-xl shadow-md active:scale-90 transition transform duration-150 ease-out hover:bg-blue-600 focus:outline-none">
                    <Pause size={window.innerWidth < 1280 ? 24 : 20} />
                </button>
            </div>
        );
    };

    if (!algorithm) {
        return <div>Nothing</div>;
    }

    return (
        <div className="flex bg-white items-center justify-center min-h-screen">
            {header()}
            <div className="text-center">

                <svg id="svg-container" width="500" height="500">

                </svg>

            </div>
            {footer()}
        </div>
    );
};

export default Animator;
