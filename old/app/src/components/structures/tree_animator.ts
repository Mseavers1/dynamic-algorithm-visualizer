import {Instruction, NodeData} from "../algorithms/tree_intructions";
import * as d3 from "d3";
import {BaseType} from "d3";

export class TreeAnimate {

    private instructions : Instruction[];
    private current_nodes : NodeData[];

    constructor(private setIsAnimating: (value: boolean) => void) {
        this.instructions = [];
        this.current_nodes = [];
    }

    add_instruction(instruction : Instruction) {
        this.instructions.push(instruction);
    }

    start_processing() {

        this.setIsAnimating(true);
        //alert(this.instructions)

        const svg = d3.select("#svg-container")
            .attr("width", 500)
            .attr("height", 500);

        this.processInstructions(svg);
    }

    processInstructions = async (svg: d3.Selection<BaseType, unknown, HTMLElement, any>) => {
        for (let instruction of this.instructions) {
            if (instruction.type === 'add' && instruction.value) {
                await this.addNode(svg, instruction);
            }

            if (instruction.type === 'swap') {

                await this.swapNodes(svg, this.current_nodes[instruction.toIndex as number], this.current_nodes[instruction.fromIndex as number], instruction);
            }

            if (instruction.type === 'remove') {
                await this.removeNode(svg, instruction);
            }

            if (instruction.type === 'clear') {
                await this.clearNodes(svg, instruction).then(() => {this.current_nodes = [];});
            }

            if (instruction.type === 'instant_add' && instruction.value) {
                await this.addNode(svg, instruction, true);
            }
        }

        this.instructions = [];
        this.setIsAnimating(false);

    };

    removeNode = (svg: d3.Selection<BaseType, unknown, HTMLElement, any>, instruction : Instruction) => {
        return new Promise<void>((resolve) => {

            for (let i = 0; i < this.current_nodes.length; i++) {

                if (this.current_nodes[i].index === instruction.index) {
                    this.fade_nodes_out(i)
                    break;
                }
            }

            setTimeout(() => resolve(), 1000);
        });
    }

    clearNodes = (svg: d3.Selection<BaseType, unknown, HTMLElement, any>, instruction : Instruction) => {
        return new Promise<void>((resolve) => {

            for (let i = this.current_nodes.length - 1; i >= 0; i--) {
                this.fade_nodes_out(i)
            }

            setTimeout(() => resolve(), 1000);
        });
    }

    fade_nodes_out(i : number) {
        this.current_nodes[i].node.transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

        this.current_nodes[i].label.transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

        if (this.current_nodes[i].parentEdge !== null) {
            this.current_nodes[i].parentEdge?.transition()
                .duration(500)
                .style("opacity", 0)
                .remove();
        }

        this.current_nodes.splice(i, 1);
    }

    addNode = (svg: d3.Selection<BaseType, unknown, HTMLElement, any>, instruction: Instruction, allAtOnce: boolean = false) => {
        return new Promise<void>((resolve) => {

            let allAtOnceSpeed = 1;
            if (allAtOnce) allAtOnceSpeed = 0;

            const position = this.getNodePosition(instruction.index as number);
            const parentIndex = Math.floor((instruction.index as number - 1) / 2);
            const hasParent = parentIndex >= 0 && this.current_nodes[parentIndex];

            // Ensure there are groups for edges and nodes
            let edgesGroup = svg.select<SVGGElement>("g.edges");
            let nodesGroup = svg.select<SVGGElement>("g.nodes");


            if (edgesGroup.empty()) {
                edgesGroup = svg.append("g").attr("class", "edges");
            }
            if (nodesGroup.empty()) {
                nodesGroup = svg.append("g").attr("class", "nodes");
            }

            let edge: d3.Selection<SVGLineElement, unknown, HTMLElement, any> | null = null;
            if (hasParent) {
                const parentPos = this.getNodePosition(parentIndex as number);
                edge = edgesGroup.append("line") // Append edge inside the 'edges' group
                    .attr("x1", parentPos.x)
                    .attr("y1", parentPos.y)
                    .attr("x2", 200)  // Temporary start position
                    .attr("y2", 200)
                    .attr("stroke", "black")
                    .attr("stroke-width", 5)
                    .style("opacity", 0);
            }

            const nodeElement = nodesGroup.append("circle") // Append node inside the 'nodes' group
                .attr("cx", 200)
                .attr("cy", 200)
                .attr("r", 20)
                .attr("class", "node")
                .style("opacity", 0);

            const label = nodesGroup.append("text") // Append label inside the 'nodes' group
                .attr("x", 200)
                .attr("y", 200)
                .attr("class", "label")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("fill", "white")
                .style("font-size", "12px")
                .text(instruction.value as number | string);

            const newNode: NodeData = { node: nodeElement, label: label, parentEdge: edge, index: instruction.index as number };
            this.current_nodes.push(newNode);

            // Animate the node: fade in and move
            nodeElement.transition()
                .duration(1000)
                .style("opacity", 1)
                .attr("cx", position.x)
                .attr("cy", position.y);

            label.transition()
                .duration(1000)
                .style("opacity", 1)
                .attr("x", position.x)
                .attr("y", position.y);

            if (edge) {
                edge.transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("x2", position.x)
                    .attr("y2", position.y);
            }

            setTimeout(() => resolve(), 1000 * allAtOnceSpeed);
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

    animate = (update: (progress: number) => void, duration: number = 1000) => {
        return new Promise<void>((resolve) => {
            const start = performance.now();
            const step = (timestamp: number) => {
                const progress = Math.min((timestamp - start) / duration, 1);
                update(progress);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }
            };
            requestAnimationFrame(step);
        });
    };


    swapNodes = (
        svg: d3.Selection<BaseType, unknown, HTMLElement, any>,
        nodeA: NodeData,
        nodeB: NodeData,
        instruction: Instruction
    ) => {

        //alert(nodes.length);

        return new Promise<void>((resolve) => {
            const node1 = nodeA.node;
            const label1 = nodeA.label;
            const node2 = nodeB.node;
            const label2 = nodeB.label;


            const node1Position = { x: parseFloat(node1.attr("cx")), y: parseFloat(node1.attr("cy")) };
            const node2Position = { x: parseFloat(node2.attr("cx")), y: parseFloat(node2.attr("cy")) };

            this.animate((progress) => {
                const newX1 = node1Position.x + (node2Position.x - node1Position.x) * progress;
                const newY1 = node1Position.y + (node2Position.y - node1Position.y) * progress;
                const newX2 = node2Position.x + (node1Position.x - node2Position.x) * progress;
                const newY2 = node2Position.y + (node1Position.y - node2Position.y) * progress;

                node1.attr("cx", newX1).attr("cy", newY1);
                label1.attr("x", newX1).attr("y", newY1);
                node2.attr("cx", newX2).attr("cy", newY2);
                label2.attr("x", newX2).attr("y", newY2);
            }, 1000).then(() => {
                // Swap the actual data reference
                const temp = this.current_nodes[instruction.toIndex as number];
                this.current_nodes[instruction.toIndex as number] = this.current_nodes[instruction.fromIndex as number];
                this.current_nodes[instruction.fromIndex as number] = temp;
                resolve();
            });
        });
    };

}