import {Instruction} from "./i_instruction";
import d3, {BaseType, Selection} from "d3";

export class FAHighlightInstruction implements Instruction {

    constructor(value: string | number) {

    }

    process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        const lineId = "line-0";
        const markerId = `arrow-${lineId}`;
        const lineAndArrowTransition = svg.transition().duration(1000);

        lineAndArrowTransition
            .select(`#${lineId}`)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("marker-end", `url(#${markerId})`);

        lineAndArrowTransition
            .select(`#${markerId} path`)
            .attr("fill", "red");
        

        const line = svg.select("#line-0");
        console.log("Line found:", !line.empty());

        return Promise.resolve();
    }

}