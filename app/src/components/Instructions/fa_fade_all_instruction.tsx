import { Instruction } from "./i_instruction";
import { BaseType, Selection } from "d3";
import * as d3 from "d3";

export class FAFadeAllInstruction implements Instruction {

    fade_time = 500;

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        const promises = [];

        // Fade out all line elements
        promises.push(
            new Promise<void>((resolve) => {
                svg.selectAll("line[id^='line-']")
                    .transition()
                    .duration(this.fade_time)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .on("end", () => resolve());
            })
        );

        // Fade out all path elements
        promises.push(
            new Promise<void>((resolve) => {
                svg.selectAll("path[id^='line-']")
                    .transition()
                    .duration(this.fade_time)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .on("end", () => resolve());
            })
        );

        // Fade out all marker arrowheads
        promises.push(
            new Promise<void>((resolve) => {
                svg.selectAll("marker[id^='arrow-'] path, defs marker path")
                    .transition()
                    .duration(this.fade_time)
                    .attr("fill", "black")
                    .on("end", () => resolve());
            })
        );

        await Promise.all(promises);
    }
}
