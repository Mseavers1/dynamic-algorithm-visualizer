import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import * as d3 from "d3";

export class FAHighlightInstruction implements Instruction {

    private nodeFrom: string | number;
    private nodeTo: string | number;

    constructor(nodeFrom: string | number, nodeTo: string | number) {
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
    }

    process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        // Fade out all line elements (straight lines) to opacity 0
        svg.selectAll("line[id^='line-']")
            .transition()
            .duration(1000)
            .attr("stroke", "black") // Fade to black
            .attr("stroke-width", 2)
            .on("end", function() {
                // Reset to the original stroke after the transition is complete
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2); // Keep stroke width at 2
            });

        svg.selectAll("path[id^='line-']")
            .transition()
            .duration(1000)
            .attr("stroke", "black") // Fade to black
            .attr("stroke-width", 2)
            .on("end", function() {
                // Reset to the original stroke after the transition is complete
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2); // Keep stroke width at 2
            });

        svg.selectAll("marker[id^='arrow-'] path, defs marker path")
            .transition()
            .duration(1000)
            .attr("fill", "black") // Fade the marker arrowheads to black
            .on("end", function() {
                // Reset to the original color after the transition is complete
                d3.select(this)
                    .attr("fill", "black"); // Reset to black
            });

        // Highlights the selected arrow
        const lineId = `line-${this.nodeFrom}-${this.nodeTo}`;
        const markerId = `arrow-${this.nodeFrom}-${this.nodeTo}`;
        const lineAndArrowTransition = svg.transition().duration(1000);

        lineAndArrowTransition
            .select(`#${lineId}`)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("marker-end", `url(#${markerId})`);

        lineAndArrowTransition
            .select(`#${markerId} path`)
            .attr("fill", "red");


        //const line = svg.select("#line-0");
        //console.log("Line found:", !line.empty());

        return Promise.resolve(lineAndArrowTransition.end());
    }

}