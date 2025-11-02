import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";

export class FAAddInputInstruction implements Instruction {

    private input: string;

    constructor(input: string) {
        this.input = input;
    }

    async process(svg: d3.Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        let x = 0;
        let y = 30;
        const verticalSpacing = 30;

        const lineGroup = svg.append<SVGGElement>("g").attr("class", "line-group");

        this.createLabel(svg, "Input", x, y);
        y += verticalSpacing;
        x = 20;

        let i = 0;
        for (const letter of this.input) {
            this.createLabel(svg, letter, x, y);
            this.createLine(i++, lineGroup, { x: x + 20 + 20, y: y - 5}, { x: x + 20, y: y - 5 });
            y += verticalSpacing;
        }

        x = 0;
        this.createLabel(svg, "Accept", x, y, 24, true, "green");
        y += verticalSpacing;

        this.createLabel(svg, "Reject", x, y, 24, true, "red");

        return Promise.resolve(undefined);
    }


    createLabel(svg: d3.Selection<BaseType, unknown, HTMLElement, any>, text: string, x: number, y: number, fontSize: number = 24, is_non_character: boolean = false, fontColor: string = "black", fontWeight: string = "normal"): void {
        const label = svg.append("text")
            .attr("class", "input-label")
            .attr("x", x)
            .attr("y", y)
            .attr("font-size", fontSize)
            .attr("fill", fontColor)
            .attr("font-weight", fontWeight);

        // Handle non-character labels
        if (is_non_character) {
            label
                .attr("id", text)
                .style("opacity", 0);
        }

        label.text(text);
    }

    createLine(
        index: number,
        svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        start: { x: number; y: number },
        end: { x: number; y: number },
        strokeColor: string = "black",
        strokeWidth: number = 2,
        opacity: number = 0
    ): d3.Selection<SVGLineElement, unknown, HTMLElement, any> {
        const uniqueId = `input-${index}`;

        let defs = svgGroup.select<SVGDefsElement>("defs");
        if (defs.empty()) {
            defs = svgGroup.append<SVGDefsElement>("defs");
        }

        defs.append("marker")
            .attr("id", `arrow-input-${index}`)
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black")
            .style("opacity", 1);

        return svgGroup.append("line")
            .attr("id", uniqueId)
            .attr("x1", start.x)
            .attr("y1", start.y)
            .attr("x2", end.x)
            .attr("y2", end.y)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("class", "input-arrow")
            .style("opacity", opacity)
            .attr("marker-end", `url(#arrow-input-${index})`);
    }



}