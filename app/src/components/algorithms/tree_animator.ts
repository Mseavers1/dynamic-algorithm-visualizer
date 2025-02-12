import {Instruction, NodeData} from "./tree_intructions";
import * as d3 from "d3";
import {BaseType} from "d3";

export class TreeAnimate {

    private instructions : Instruction[];
    private current_nodes : NodeData[];

    constructor() {
        this.instructions = [];
        this.current_nodes = [];
    }

    add_instruction(instruction : Instruction) {

        // Adds it
        this.instructions.push(instruction);
    }

    start_processing() {
        const svg = d3.select("#svg-container")
            .attr("width", 500)
            .attr("height", 500);

        this.processInstructions(svg);
    }

    processInstructions = async (svg: d3.Selection<BaseType, unknown, HTMLElement, any>) => {
        for (let instruction of this.instructions) {
            if (instruction.type === 'add' && instruction.value) {
                // Wait for the previous node to finish its animation before adding the next one
                await this.addNode(svg, instruction);
            }

            if (instruction.type === 'swap') {

                await this.swapNodes(svg, this.current_nodes[instruction.toIndex as number], this.current_nodes[instruction.fromIndex as number]);

                const i = this.current_nodes[instruction.toIndex as number].index;
                this.current_nodes[instruction.toIndex as number].index = this.current_nodes[instruction.fromIndex as number].index;
                this.current_nodes[instruction.fromIndex as number].index = i;

                const node = this.current_nodes[instruction.toIndex as number]
                this.current_nodes[instruction.toIndex as number] = this.current_nodes[instruction.fromIndex as number];
                this.current_nodes[instruction.fromIndex as number] = node;
            }
        }

        this.instructions = [];

    };

    addNode = (svg: d3.Selection<BaseType, unknown, HTMLElement, any>, instruction: Instruction) => {

        return new Promise<void>((resolve) => {
            const nodeElement = svg.append("circle")
                .attr("cx", 200)  // Set starting x position
                .attr("cy", 200)  // Set starting y position
                .attr("r", 20)
                .attr("class", "node")
                .style("opacity", 0);  // Start with invisible node

            const label = svg.append("text")
                .attr("x", 200)  // Same x position as the circle
                .attr("y", 200)  // Same y position as the circle
                .attr("class", "label")
                .attr("text-anchor", "middle")  // Center the text horizontally
                .attr("alignment-baseline", "middle")  // Center the text vertically
                .style("fill", "white")  // Set text color
                .style("font-size", "12px")
                .text(instruction.value as number | string);

            const newNode: NodeData = {
                node: nodeElement,
                label: label,
                index: instruction.index as number,
            };

            this.current_nodes.push(newNode);

            // Animate the node: fade in and move
            nodeElement.transition()
                .duration(1000)  // Duration of 1 second
                .style("opacity", 1)  // Fade in the node
                .attr("cx", this.getNodePosition(instruction.index as number).x)
                .attr("cy", this.getNodePosition(instruction.index as number).y);  // Keep y position constant for simplicity

            label.transition()
                .duration(1000)  // Duration of 1 second (same as node)
                .style("opacity", 1)
                .attr("x", this.getNodePosition(instruction.index as number).x)
                .attr("y", this.getNodePosition(instruction.index as number).y);

            // Resolve the promise after the animation duration
            setTimeout(() => resolve(), 1000);  // Wait for the animation to finish (1000ms)
        });
    };

    getNodePosition = (index: number): { x: number, y: number } => {
        if (index < 0 || isNaN(index)) return { x: 0, y: 0 };
        if (index === 0) return { x: 250, y: 50 }; // Root at the center

        const depth = Math.floor(Math.log2(index + 1)); // Get depth in the tree
        const xSpacing = (200) / (depth + 1); // Adjust x spacing
        const ySpacing = 80; // Vertical spacing

        const parentIndex = Math.floor((index - 1) / 2);
        const parentPos = this.getNodePosition(parentIndex);

        const isLeftChild = index % 2 === 1;
        const xOffset = isLeftChild ? -xSpacing : xSpacing;

        return { x: parentPos.x + xOffset, y: parentPos.y + ySpacing };
    };

    swapNodes = (
        svg: d3.Selection<BaseType, unknown, HTMLElement, any>,
        nodeA: NodeData,
        nodeB: NodeData,
    ) => {

        //alert(nodes.length);

        return new Promise<void>((resolve) => {
            const node1 = nodeA.node;
            const label1 = nodeA.label;
            const node2 = nodeB.node;
            const label2 = nodeB.label;


            const node1Position = { x: parseFloat(node1.attr("cx")), y: parseFloat(node1.attr("cy")) };
            const node2Position = { x: parseFloat(node2.attr("cx")), y: parseFloat(node2.attr("cy")) };

            // Animate node1 to node2's position
            node1.transition()
                .duration(1000)
                .attr("cx", node2Position.x)
                .attr("cy", node2Position.y);

            // Animate label1 to node2's position
            label1.transition()
                .duration(1000)
                .attr("x", node2Position.x)
                .attr("y", node2Position.y);

            // Animate node2 to node1's position
            node2.transition()
                .duration(1000)
                .attr("cx", node1Position.x)
                .attr("cy", node1Position.y);

            // Animate label2 to node1's position
            label2.transition()
                .duration(1000)
                .attr("x", node1Position.x)
                .attr("y", node1Position.y);

            setTimeout(() => resolve(), 1000);
        });
    };

}