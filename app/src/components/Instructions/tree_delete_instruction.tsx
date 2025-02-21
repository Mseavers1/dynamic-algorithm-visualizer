import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import {Node} from "../pictures/node";

export class TreeDeleteInstruction implements Instruction {

    nodes : Node[];
    index : number;

    constructor(index: number, nodes : Node[]) {
        this.nodes = nodes;
        this.index = index;
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        const node = this.nodes[this.index];

        // Animate the nodes and labels removing themselves
        const removeNodeTransition = node.element.transition()
            .duration(500)
            .style("opacity", 0)

        const removeLabelTransition = node.label.transition()
            .duration(500)
            .style("opacity", 0)

        let edgeTransitionPromise: Promise<void> | null = null;

        // Animates the edges removing themselves
        if (node.edge) {
            const removeEdgeTransition = node.edge.transition()
                .duration(500)
                .style("opacity", 0)

            edgeTransitionPromise = removeEdgeTransition.end();
        }

        // Wait for all transitions to finish
        await Promise.all([removeNodeTransition.end(), removeLabelTransition.end(), edgeTransitionPromise]);

        // Now safely remove the elements
        node.element.remove();
        node.label.remove();
        if (node.edge) {
            node.edge.remove();
        }

        // Remove node from array
        this.nodes.splice(this.index, 1);
    }


}