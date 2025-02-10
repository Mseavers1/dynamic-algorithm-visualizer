import { Algorithm } from "./algorithm_interface";
import {BinaryTree} from "../structures/binary_tree";
import React, {useState} from "react";
import {animated, useTransition} from "@react-spring/web";
import {IData} from "../structures/IData";

export class MinHeap implements Algorithm {

    private tree : BinaryTree;
    private default_max_height : number = 1;
    private current_max_height : number = 0;

    constructor(
        private isDynamicSize: boolean
    ) {
       this.current_max_height = this.default_max_height;
       this.tree = new BinaryTree();
    }

    insert(value: number) {

        this.tree?.add(value);

        //alert(this.tree?.get_current_height())

        //if (this.isDynamicSize && current_height > this.current_max_height) this.current_max_height = current_height + 1;

    }

    render(): JSX.Element {

        //alert(this.current_max_height);

        return (
            <svg width="500" height="500">
                <AnimatedTree values={this.tree.values} height={this.current_max_height}/>
            </svg>
        );
    }
}

const AnimatedTree = ({values, height}: {values : (string | number)[], height: number}) => {

    const nodeTransitions = useTransition(
        values.map((value, i) => ({ value, index: i })),
        {
            keys: (item) => `${item.value}-${item.index}`,  // Ensure unique keys
            from: { opacity: 0, transform: 'scale(0)' },
            enter: { opacity: 1, transform: 'scale(1)' },
            leave: { opacity: 0, transform: 'scale(0)' },
            initial: null,  // Do not animate existing nodes on re-renders
            trail: 0,       // Avoid sequential animation of all nodes
        }
    );

    //alert(height)

    const getNodePosition = (index: number): { x: number, y:number } => {

        if (index < 0 || isNaN(index)) return {x: 0, y: 0};
        if (index === 0) return { x: 250, y: 50 }; // Root at the center

        const depth = Math.floor(Math.log2(index + 1)); // Get depth in the tree

        let xSpacingMulti : number = 1;

        if (height > 1) xSpacingMulti = 2;

        const xSpacing = (200 * xSpacingMulti) / (depth + 1); // Reduce spacing as depth increases
        const ySpacing = 80; // Vertical spacing

        const parentIndex = Math.floor((index - 1) / 2);
        const parentPos = getNodePosition(parentIndex);

        // Left child or right child
        const isLeftChild = index % 2 === 1;
        const xOffset = isLeftChild ? -xSpacing : xSpacing;

        return { x: parentPos.x + xOffset, y: parentPos.y + ySpacing };
    };


    return (
        <g>
            {/* Render edges (lines) first */}
            {nodeTransitions((style, { value, index }) => {
                if (index === 0) return null; // Root node has no parent, skip edge rendering
                const { x, y } = getNodePosition(index);
                const parentIndex = Math.floor((index - 1) / 2);
                const parentPos = getNodePosition(parentIndex);

                return (
                    <animated.line
                        key={`line-${index}`} // Separate key for lines
                        x1={parentPos.x}
                        y1={parentPos.y}
                        x2={x}
                        y2={y}
                        stroke="black"
                        strokeWidth="2"
                        style={{ strokeOpacity: 1 }}
                    />
                );
            })}

            {/* Render nodes (circles) on top of the lines */}
            {nodeTransitions((style, { value, index }) => {
                const { x, y } = getNodePosition(index);

                return (
                    <animated.g key={`node-${index}`} style={style}>
                        <circle cx={x} cy={y} r={30} fill="steelblue" />
                        <text x={x} y={y} dy={5} textAnchor="middle" fill="white" fontSize="12">
                            {value}
                        </text>
                    </animated.g>
                );
            })}
        </g>
    );

};
