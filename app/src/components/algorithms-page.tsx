import React from "react";
import Card from "./Card";
import ListItem from "./ListItem";
import {useNavigate} from "react-router-dom";

const test = () => {
        alert("test")
}

const AlgorithmsPage: React.FC = () => {

    const nav = useNavigate();


    return (
        <div
            className="bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 h-screen pt-28 px-4 items-start justify-items-center">
            <Card
                title="Data Structures"
                content={(
                    <ul>
                        <ListItem text="Arrays" onClick={test} />
                        <ListItem text="Linked Lists" onClick={test} />
                        <ListItem text="Stacks" onClick={test} />
                        <ListItem text="Queues" onClick={test} />
                        <ListItem text="Trees" onClick={test} />
                        <ListItem text="Heaps" onClick={() => nav("/algorithms/animate/min-heap")} />
                        <ListItem text="Graphs" onClick={test}
                                  subItems={[
                                    { text: "Dijkstra's Algorithm", onClick: () => test },
                                    { text: "DFS", onClick: () => test },
                                    { text: "BFS", onClick: () => test },
                                  ]}
                        />
                    </ul>
                )}
            />
            <Card
                title="Sorting Algorithms"
                content={(
                    <ul>
                        <ListItem text="Bubble Sort" onClick={test} />
                        <ListItem text="Random Sort" onClick={test} />
                        <ListItem text="Selection Sort" onClick={test} />
                        <ListItem text="Insertion Sort" onClick={test} />
                        <ListItem text="Merge Sort" onClick={test} />
                        <ListItem text="Quick Sort" onClick={test} />
                        <ListItem text="Heap Sort" onClick={test} />
                        <ListItem text="Radix Sort" onClick={test} />
                        <ListItem text="Bucket Sort" onClick={test} />
                        <ListItem text="Counting Sort" onClick={test} />
                        <ListItem text="Shell Sort" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="Searching Algorithms"
                content={(
                    <ul>
                        <ListItem text="Linear Search" onClick={test} />
                        <ListItem text="Binary Search" onClick={test} />
                        <ListItem text="Depth-First Search" onClick={test} />
                        <ListItem text="Breadth-First Search" onClick={test} />
                        <ListItem text="Exponential Search" onClick={test} />
                        <ListItem text="Interpolation Search" onClick={test} />
                        <ListItem text="Jump Search" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="Graph Algorithms"
                content={(
                    <ul>
                        <ListItem text="Dijkstra's Algorithm" onClick={test} />
                        <ListItem text="Bellman-Ford Algorithm" onClick={test} />
                        <ListItem text="Floyd-Warshall Algorithm" onClick={test} />
                        <ListItem text="A* Algorithm" onClick={test} />
                        <ListItem text="Prim's Algorithm" onClick={test} />
                        <ListItem text="Kruskal's Algorithm" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="Dynamic Programming"
                content={(
                    <ul>
                        <ListItem text="Fibonacci Sequence" onClick={test} />
                        <ListItem text="Longest Common Subsequence" onClick={test} />
                        <ListItem text="Longest Increasing Subsequence" onClick={test} />
                        <ListItem text="0/1 Knapsack Problem" onClick={test} />
                        <ListItem text="Fractional Knapsack Problem" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="Divide and Conquer Algorithms"
                content={(
                    <ul>
                        <ListItem text="Merge Sort" onClick={test} />
                        <ListItem text="Quick Sort" onClick={test} />
                        <ListItem text="Binary Search" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="Backtracking Algorithms"
                content={(
                    <ul>
                        <ListItem text="Knight's Tour" onClick={test} />
                        <ListItem text="Rat in a Maze" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="String Algorithms"
                content={(
                    <ul>
                        <ListItem text="Z Algorithm" onClick={test} />
                        <ListItem text="Rabin-Karp Algorithm" onClick={test} />
                    </ul>
                )}
            />
            <Card
                title="Misc Algorithms"
                content={(
                    <ul>
                        <ListItem text="FA Generator (transition table)" onClick={() => nav("/algorithms/animate/fa-transition")} />
                    </ul>
                )}
            />
        </div>

    );
};


export default AlgorithmsPage;