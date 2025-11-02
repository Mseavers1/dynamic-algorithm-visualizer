import {Instruction} from "./i_instruction";
import * as d3 from "d3";
import {BaseType} from "d3";
import {Node} from "../pictures/node";

export class TreeSwapInstruction implements Instruction {

    nodeAIndex: number;
    nodeBIndex: number;
    nodes: Node[];

    constructor(nodeAIndex : number, nodeBIndex : number, nodes : Node[]) {
        this.nodeAIndex = nodeAIndex;
        this.nodeBIndex = nodeBIndex;
        this.nodes = nodes;
    }

    async process(svg: d3.Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        // Get Nodes
        const nodeA = this.nodes[this.nodeAIndex];
        const nodeB = this.nodes[this.nodeBIndex];

        // Get positions
        const nodeAPosition = { x: parseFloat(nodeA.element.attr("cx")), y: parseFloat(nodeA.element.attr("cy")) };
        const nodeBPosition = { x: parseFloat(nodeB.element.attr("cx")), y: parseFloat(nodeB.element.attr("cy")) };

        // Swap Nodes
        const nodeATransition = nodeA.element.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("cx", nodeBPosition.x)
            .attr("cy", nodeBPosition.y)

        const nodeBTransition = nodeB.element.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("cx", nodeAPosition.x)
            .attr("cy", nodeAPosition.y)

        // Swap Labels
        const nodeALabelTransition = nodeA.label.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("x", nodeBPosition.x)
            .attr("y", nodeBPosition.y)

        const nodeBLabelTransition = nodeB.label.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("x", nodeAPosition.x)
            .attr("y", nodeAPosition.y)

        // Switch indexes
        this.nodes[this.nodeAIndex].index = this.nodeBIndex;
        this.nodes[this.nodeBIndex].index = this.nodeAIndex;

        // Switch edges
        const nodeAEdge = this.nodes[this.nodeAIndex].edge;
        this.nodes[this.nodeAIndex].edge = this.nodes[this.nodeBIndex].edge;
        this.nodes[this.nodeBIndex].edge = nodeAEdge;

        // Swap actual array elements
        this.nodes[this.nodeAIndex] = this.nodes[this.nodeBIndex];
        this.nodes[this.nodeBIndex] = nodeA;

        await Promise.all([nodeATransition.end(), nodeBTransition.end(), nodeALabelTransition.end(), nodeBLabelTransition.end()]);
    }

}