import React from "react";
import {Algorithm} from "./algorithms/algorithm_interface";
import {useParams} from "react-router-dom";

import {MinHeap} from "./algorithms/min_heap";

const Animator: React.FC = () => {

    const {algorithmType} = useParams<{algorithmType: string}>();

    const header= () => {
        return (
            <div className="fixed top-20 left-0 right-0 bg-animator-bars text-white flex items-center justify-between p-4">
                Test
            </div>
        )
    }

    const footer= () => {
        return (
            <div className="fixed bottom-6 left-0 right-0 bg-animator-bars text-white flex items-center justify-between p-4">

            </div>
        )
    }

    let algorithm: Algorithm | null = RetrieveAlgorithm(algorithmType);

    if (!algorithm) {
        return (<div>Nothing</div>);
    }

    return (
        <div className="flex bg-white items-center justify-center min-h-screen">

            {/** Header **/}
            {header()}

            {/** Body **/}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Algorithm Animator</h1>
                {algorithm.display()}
            </div>

            {/** Footer **/}
            {footer()}

        </div>

    );
};

const RetrieveAlgorithm = (algorithmName: string | undefined): Algorithm | null => {

    if (algorithmName === "min-heap") {
        return new MinHeap();
    }

    return null;
}

export default Animator;