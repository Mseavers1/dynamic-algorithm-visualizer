import {Node} from "../pictures/node";
import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import * as d3 from "d3";

export class TreeAddAllInstruction implements Instruction {

    elements: (string | number)[];
    nodes: Node[];

    constructor(elements: (string | number)[], nodes: Node[]) {
        this.nodes = nodes;
        this.elements = elements;
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        let currentIndex = 0;
        let transitions = [];

        for (const element of this.elements) {

            const position = this.getNodePosition(currentIndex);
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const hasParent = parentIndex >= 0;

            let nodesGroup = svg.select<SVGGElement>("g.nodes");
            let edgesGroup = svg.select<SVGGElement>("g.edges");

            if (edgesGroup.empty()) {
                edgesGroup = svg.append("g").attr("class", "edges");
            }

            if (nodesGroup.empty()) {
                nodesGroup = svg.append("g").attr("class", "nodes");
            }

            let edge: d3.Selection<SVGLineElement, unknown, HTMLElement, any> | null = null;

            if (hasParent) {
                const parentPos = this.getNodePosition(parentIndex as number);
                edge = edgesGroup.append("line")
                    .attr("x1", parentPos.x)
                    .attr("y1", parentPos.y)
                    .attr("x2", 200)
                    .attr("y2", 200)
                    .attr("stroke", "black")
                    .attr("stroke-width", 5)
                    .style("opacity", 0);
            }

            // Creates the circle node on screen
            const nodeElement = nodesGroup.append("circle")
                .attr("cx", 200)
                .attr("cy", 200)
                .attr("r", 20)
                .attr("class", "node")
                .style("opacity", 0);

            // Creates the text label on screen
            const label = nodesGroup.append("text")
                .attr("x", 200)
                .attr("y", 200)
                .attr("class", "label")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("fill", "white")
                .style("font-size", "12px")
                .text(element);

            const nodeTransition = nodeElement.transition()
                .duration(1000)
                .style("opacity", 1)
                .attr("cx", position.x)
                .attr("cy", position.y)

            const labelTransition = label.transition()
                .duration(1000)
                .style("opacity", 1)
                .attr("x", position.x)
                .attr("y", position.y)

            if (edge) {
                const edgeTransition = edge.transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("x2", position.x)
                    .attr("y2", position.y);

                transitions.push(edgeTransition.end());
            }

            this.nodes.push(new Node(element, currentIndex, nodeElement, edge, label))
            transitions.push(nodeTransition.end(), labelTransition.end());

            currentIndex += 1;
        }

        await Promise.all(transitions);

        /*let s = ""
        for (const n of this.nodes) {
            s += n.value + " "
        }

        alert(s)*/
    }

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

}