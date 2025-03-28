import React, {useEffect, useState} from "react";
import { Algorithm } from "./algorithms/algorithm_interface";
import { useParams } from "react-router-dom";
import { Pause } from "lucide-react";
import { MinHeap } from "./algorithms/min_heap";
import {FATransition} from "./algorithms/fa_transition";
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
    const [inputTableInput, setInputTableInput] = useState<string>("");

    // Randomize Buttons
    const [sliderValue, setSliderValue] = useState(50);
    const [stringLengthMin, setStringLengthMin] = useState("1");
    const [stringLengthMax, setStringLengthMax] = useState("5");
    const [minValue, setMinValue] = useState("0");
    const [maxValue, setMaxValue] = useState("100");
    const [allowDec, setAllowDec] = useState<boolean>(false);
    const [regex, setRegex] = useState<string>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");


    useEffect(() => {

        const animatedPlayer = new AnimationPlayer(setIsAnimating);

        const RetrieveAlgorithm = (algorithmName: string | undefined): Algorithm | null => {

            if (algorithmName === "min-heap") {
                return new MinHeap(true, animatedPlayer);
            }

            if (algorithmName === "fa-transition") {
                return new FATransition(animatedPlayer);
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

        function disableButton () : boolean {
            return isNaN(Number(minValue)) || isNaN(Number(maxValue)) || minValue === "" || maxValue === "" || Number(minValue) > Number(maxValue) || isNaN(Number(stringLengthMin)) || isNaN(Number(stringLengthMax)) || stringLengthMin === "" || stringLengthMax === "" || stringLengthMin > stringLengthMax || Number(stringLengthMin) < 1 || Number(stringLengthMax) > 5 || regex === "" || String(regex).includes(" ");
        }

        return (
            <Popover className="relative z-50">
                {({ open, close }) => (
                    <>
                        <PopoverButton
                            className="px-4 py-2 xl:px-2 xl:py-0.5 leading-none 2xl:px-4 2xl:py-1.5 bg-blue-500 flex flex-col items-center text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isAnimating || !algorithm?.showRandomize}
                        >
                            Randomize
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                    open ? "rotate-180" : "rotate-0"
                                }`}
                            />
                        </PopoverButton>

                        <PopoverPanel className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-70 bg-white border border-gray-300 shadow-lg rounded-lg p-2 z-50">

                            <div className="flex flex-col gap-5">
                                {/* Radio Buttons */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 p-6 rounded-md flex items-center justify-center">
                                    <label
                                        className="absolute select-none top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
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
                                                    className="text-gray-700 select-none">{option.charAt(0).toUpperCase() + option.slice(1)} </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>


                                {/* Length Slider */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6">
                                    <label
                                        className="absolute select-none top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        Number of Nodes
                                    </label>
                                    <div className="flex flex-col items-center justify-center w-full">

                                        {/* Current Value */}
                                        <div className="text-lg font-semibold text-blue-500 mb-2 select-none">
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
                                        <div className="flex justify-between w-64 mt-2 select-none">
                                            {/* Left Label */}
                                            <span className="text-sm text-gray-700">0</span>

                                            {/* Right Label */}
                                            <span className="text-sm text-gray-700">100</span>
                                        </div>
                                    </div>
                                </div>


                                {/* Min & Max Input */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6 gap-3">
                                    <label
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700 select-none">
                                        Numbers
                                    </label>
                                    <div className="flex flex-row justify-center text-black items-center gap-4">
                                        <input
                                            type="text"
                                            className="py-2 w-10 border text-center disabled:bg-gray-400 border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Min"
                                            value={minValue}
                                            disabled={mode === "strings"}
                                            onChange={(e) => setMinValue((e.target.value))}
                                        />

                                        <span className="select-none">to</span>

                                        <input
                                            type="text"
                                            className="py-2 w-10 border disabled:bg-gray-400 text-center border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Max"
                                            value={maxValue}
                                            disabled={mode === "strings"}
                                            onChange={(e) => setMaxValue((e.target.value))}
                                        />
                                    </div>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="checkbox"
                                            disabled={mode === "strings"}
                                            className="h-4 w-4 text-blue-500 focus:ring-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            onChange={(e) => setAllowDec(e.target.checked)}
                                        />
                                        <span className="text-gray-700 select-none">Allow Decimals</span>
                                    </label>

                                </div>

                                {/* String Length */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6">
                                    <label
                                        className="absolute select-none top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        String Length
                                    </label>

                                    <div className="flex flex-row justify-center text-black items-center gap-4">
                                        <input
                                            type="text"
                                            className="py-2 w-10 border text-center disabled:bg-gray-400 border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Min"
                                            value={stringLengthMin}
                                            disabled={mode === "numbers"}
                                            onChange={(e) => setStringLengthMin((e.target.value))}
                                        />

                                        <span className="select-none">to</span>

                                        <input
                                            type="text"
                                            className="py-2 w-10 border text-center disabled:bg-gray-400 border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Max"
                                            value={stringLengthMax}
                                            disabled={mode === "numbers"}
                                            onChange={(e) => setStringLengthMax((e.target.value))}
                                        />
                                    </div>

                                </div>

                                {/* String Regex */}
                                <div
                                    className="relative border-dotted border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-6">
                                    <label
                                        className="absolute select-none top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-semibold text-gray-700">
                                        String Regex
                                    </label>

                                    <div className="flex flex-row justify-center text-black items-center gap-4">
                                        <textarea
                                            className="py-2 w-64 h-24 disabled:bg-gray-400 border text-center border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                                            placeholder="Character set for strings"
                                            value={regex}
                                            disabled={mode === "numbers"}
                                            onChange={(e) => setRegex((e.target.value))}
                                        />
                                    </div>

                                </div>


                                {/* Confirm Button */}
                                <button
                                    className="w-full px-4 py-2 text-white bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={disableButton()}
                                    onClick={() => {
                                        algorithm?.generate_random(Number(minValue), Number(maxValue) + 1, sliderValue, (mode === "strings" || mode === "both"), (mode === "numbers" || mode === "both"), allowDec, 3, regex, Number(stringLengthMin), Number(stringLengthMax));
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
                className="fixed top-20 xl:top-10 left-0 right-0 bg-animator-bars text-white flex items-center h-20 lg:h-10 xl:h-10 2xl:h-[3.5rem] p-4 gap-5 z-50">
                <input
                    type="text"
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                    placeholder="Enter value here"
                    value={value}
                    disabled={isAnimating || !algorithm?.showInsert}
                    onChange={(e) => setValue(e.target.value)}
                />

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                        algorithm?.insert(value);
                        setValue("");
                    }}
                    disabled={isAnimating || !algorithm?.showInsert}>
                    Insert
                </button>

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                        algorithm?.delete(value);
                        setValue("");
                    }}
                    disabled={isAnimating || !algorithm?.showDelete}>
                    Delete
                </button>

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAnimating || !algorithm?.showSearch}>
                    Search
                </button>

                <button
                    className="px-4 py-2 xl:px-2 xl:py-0.5 2xl:px-4 2xl:py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 active:scale-90 transition transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAnimating || !algorithm?.showClear}
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
                    <Pause size={window.innerWidth < 1280 ? 24 : 20}/>
                </button>

                <button
                    className="flex items-center justify-center bg-blue-500 p-2 text-white rounded-xl shadow-md active:scale-90 transition transform duration-150 ease-out hover:bg-blue-600 focus:outline-none"
                    onClick={() => algorithm?.parse(inputTableInput)}>
                    Generate FA
                </button>
            </div>
        );
    };

    const inputTable = () => {

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            const textarea = e.target as HTMLTextAreaElement; // Type the target as HTMLTextAreaElement
            const cursorPosition = textarea.selectionStart;
            const textBeforeCursor = textarea.value.substring(0, cursorPosition);
            const textAfterCursor = textarea.value.substring(cursorPosition);

            if (e.key === 'Tab') {
                const indentation = '  '.repeat(2);

                // Set the new value of textarea with the correct indentation
                setInputTableInput(textBeforeCursor + indentation + textAfterCursor);

                e.preventDefault();
            }

            //if (e.key === 'Enter') {
            //    algorithm?.parse(inputTableInput);
            //}
        };


        return (
            <div className="flex flex-col w-[500px]">
                <textarea
                    id="fa-input"
                    className="w-full max-w-lg h-[1000px] p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 resize-none"
                    value={inputTableInput}
                    onChange={(e) => {setInputTableInput(e.target.value)}}
                    placeholder={`# Here is an example of a transition table:
  a:
      start
      a: 0, 1
      b: 1
  b:
      final
      a: 1
      b: 0`}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                />
            </div>
        )

    }

    if (!algorithm) {
        return <div>Nothing</div>;
    }

    return (
        <div className="flex bg-white items-center justify-center min-h-screen">
            {header()}

            <div className="flex flex-row text-center gap-20">

                {inputTable()}

                <svg id="svg-container" width="500" height="500">

                </svg>

            </div>

            {footer()}
        </div>
    );
};

export default Animator;
