import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import * as d3 from "d3";

export class FAShowStateInstruction implements Instruction {

    constructor(public accept: boolean) {
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        const labelText = this.accept ? "Accept" : "Reject";

        // Fade in the label corresponding to the condition
        d3.select(`#${labelText}`)
            .transition()
            .duration(500)
            .style("opacity", 1);

        return Promise.resolve();
    }


}