import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import * as d3 from "d3";

export class FAShowArrowInstruction implements Instruction {

    index: number;

    constructor(index: number) {
        this.index = index;
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        const duration = 300;

        const currentLineId = `#input-${this.index}`;
        const currentArrowId = `#arrow-input-${this.index} path`;

        const prevLineId = `#input-${this.index - 1}`;
        const prevArrowId = `#arrow-input-${this.index - 1} path`;

        // Fade in the current line
        d3.select<SVGLineElement, unknown>(currentLineId)
            .transition()
            .duration(duration)
            .style("opacity", 1);

        // Fade in the current arrowhead path
        d3.select<SVGPathElement, unknown>(currentArrowId)
            .transition()
            .duration(duration)
            .style("opacity", 1);

        // Fade out the previous line (if it exists)
        d3.select<SVGLineElement, unknown>(prevLineId)
            .transition()
            .duration(duration)
            .style("opacity", 0);

        // Fade out the previous arrowhead path (if it exists)
        d3.select<SVGPathElement, unknown>(prevArrowId)
            .transition()
            .duration(duration)
            .style("opacity", 0);

        return Promise.resolve();
    }


}