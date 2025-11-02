import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import {Node} from "../pictures/node";

export class TreeClearInstruction implements Instruction {

    nodes : Node[];

    constructor(nodes : Node[]) {
        this.nodes = nodes;
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        let transitions = [];

        // Animates the nodes being removed
        for (const node of this.nodes) {

            const removeNodeTransition = node.element.transition()
                .duration(500)
                .style("opacity", 0);

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
                transitions.push(edgeTransitionPromise);
            }

            transitions.push(removeNodeTransition.end());
            transitions.push(removeLabelTransition.end());
        }

        await Promise.all(transitions);

        // Removes the edges
        for (const node of this.nodes) {

            node.element.remove();
            node.label.remove();

            if (node.edge) {
                node.edge.remove();
            }

        }
    }

}