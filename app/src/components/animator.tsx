import React, {useEffect, useState} from "react";
import { Algorithm } from "./algorithms/algorithm_interface";
import { useParams } from "react-router-dom";
import { Pause } from "lucide-react";
import { MinHeap } from "./algorithms/min_heap";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {TreeAnimate} from "./structures/tree_animator";
import {AnimationPlayer} from "./animation_player";
import { ChevronDown, ChevronUp } from "lucide-react";

const Animator: React.FC = () => {
    const { algorithmType } = useParams<{ algorithmType: string }>();
    const [value, setValue] = React.useState<string | number>("");

    const [isDynamicSize, setIsDynamicSize] = useState<boolean>(true);
    const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
    const [treeAnimator, setTreeAnimator] = useState<TreeAnimate | null>(null);
    const [animationPlayer, setAnimationPlayer] = useState<AnimationPlayer>();
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [mode, setMode] = useState("numbers");

    // Randomize Buttons
    const [sliderValue, setSliderValue] = useState(50);
    const [minValue, setMinValue] = useState("0");
    const [maxValue, setMaxValue] = useState("100");


    useEffect(() => {

        const animatedPlayer = new AnimationPlayer(setIsAnimating);

        const RetrieveAlgorithm = (algorithmName: string | undefined): Algorithm | null => {
            if (algorithmName === "min-heap") {
                return new MinHeap(true, animatedPlayer);
            }
            return null;
        };

        //setTreeAnimator(x);
        setAnimationPlayer(animatedPlayer);
        const algo = RetrieveAlgorithm(algorithmType);
        setAlgorithm(algo);
    }, [algorithmType]);

    const randomButton = () => {

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSliderValue(Number(e.target.value));
        };

        return (
            <Popover className="relative">
                {({ open, close }) => (
                    <>
                        <PopoverButton
                            className="px-4 py-2 xl:px-2 xl:py-0.5 leading-none 2xl:px-4 2xl:py-1.5 bg-blue-500 flex flex-col items-center text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isAnimating}
                        >
                            Randomize
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                    open ? "rotate-180" : "rotate-0"
                                }`}
                            />
                        </PopoverButton>

                        <PopoverPanel className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-70 bg-white border border-gray-300 shadow-lg rounded-lg p-2">

                            <div className="flex flex-col gap-5">
                                {/* Radio Buttons */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 p-6 rounded-md flex items-center justify-center">
                                    <label
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        Type
                                    </label>
                                    <div className="flex flex-row justify-center gap-4">
                                        {["numbers", "strings", "both"].map((option) => (
                                            <label key={option} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="mode"
                                                    value={option}
                                                    checked={mode === option}
                                                    onChange={(e) => setMode(e.target.value)}
                                                    className="accent-blue-500"
                                                />
                                                <span
                                                    className="text-gray-700">{option.charAt(0).toUpperCase() + option.slice(1)} </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>


                                {/* Length Slider */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6">
                                    <label
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        Number of Nodes
                                    </label>
                                    <div className="flex flex-col items-center justify-center w-full">

                                        {/* Current Value */}
                                        <div className="text-lg font-semibold text-blue-500 mb-2">
                                            {sliderValue}
                                        </div>

                                        {/* Slider */}
                                        <input
                                            type="range"
                                            id="slider"
                                            min="0"
                                            max="100"
                                            value={sliderValue}
                                            onChange={handleChange}
                                            className="w-64 h-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />

                                        {/* Bottom Labels */}
                                        <div className="flex justify-between w-64 mt-2">
                                            {/* Left Label */}
                                            <span className="text-sm text-gray-700">0</span>

                                            {/* Right Label */}
                                            <span className="text-sm text-gray-700">100</span>
                                        </div>
                                    </div>
                                </div>


                                {/* Min & Max Input */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6">
                                    <label
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        Numbers
                                    </label>
                                    <div className="flex flex-row justify-center text-black items-center gap-4">
                                        <input
                                            type="text"
                                            className="py-2 w-10 border text-center border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Min"
                                            value={minValue}
                                            //disabled={isAnimating}
                                            onChange={(e) => setMinValue((e.target.value))}
                                        />

                                        to

                                        <input
                                            type="text"
                                            className="py-2 w-10 border text-center border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Max"
                                            value={maxValue}
                                            //disabled={isAnimating}
                                            onChange={(e) => setMaxValue((e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6">
                                    <label
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        Strings
                                    </label>
                                </div>


                                {/* Confirm Button */}
                                <button
                                    className="w-full px-4 py-2 text-white bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={isNaN(Number(minValue)) || isNaN(Number(maxValue)) || minValue === "" || maxValue === "" || minValue > maxValue}
                                    onClick={() => {
                                        algorithm?.generate_random(Number(minValue), Number(maxValue), sliderValue, (mode === "strings" || mode === "both"), (mode === "numbers" || mode === "both"), false, 3);
                                        close();
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>

                        </PopoverPanel>
                    </>
                    )}
            </Popover>
        );
    };


    const header = () => {
        return (
            <div
                className="fixed top-20 xl:top-10 left-0 right-0 bg-animator-bars text-white flex items-center h-20 lg:h-10 xl:h-10 2xl:h-[3.5rem] p-4 gap-5">
                <input
                    type="text"
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                    placeholder="Enter value here"
                    value={value}
                    disabled={isAnimating}
                    onChange={(e) => setValue(e.target.value)}
                />

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                        algorithm?.insert(value);
                        setValue("");
                    }}
                    disabled={isAnimating}>
                    Insert
                </button>

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                        algorithm?.delete(value);
                        setValue("");
                    }}
                    disabled={isAnimating}>
                    Delete
                </button>

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAnimating}>
                    Search
                </button>

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAnimating}
                    onClick={() => {
                        algorithm?.clear()
                    }}>
                    Clear
                </button>

                {randomButton()}
            </div>
        );
    };

    const footer = () => {

        //alert(d3.select("#svg-container").node())

        return (
            <div
                className="fixed bottom-6 left-0 right-0 bg-animator-bars text-white flex items-center justify-between p-4 h-30 lg:h-10 xl:h-10 2xl:h-[3.5rem]">
                <button
                    className="flex items-center justify-center 2xl:w-10 2xl:h-10 xl:w-7 xl:h-7 bg-blue-500 text-white rounded-xl shadow-md active:scale-90 transition transform duration-150 ease-out hover:bg-blue-600 focus:outline-none">
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
