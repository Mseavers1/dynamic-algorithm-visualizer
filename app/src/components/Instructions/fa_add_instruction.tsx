import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import {Node} from "../pictures/node";
import {stateValues} from "../algorithms/fa_transition";
import * as d3 from "d3";

export type Color = {
    r: number;
    b: number;
    g: number;
    a: number;
}

export class FAAddInstruction implements Instruction {

    value: number | string;
    index: number;
    numberOfStates: number;
    indexStates: Record<string, number>;
    values: stateValues[];
    colors: Record<string, Color>;
    isStarting: boolean;
    isFinal: boolean;

    constructor(index: number, value: number | string, numberOfStates: number, values: stateValues[], indexStates: Record<string, number>, color: Record<string, Color>, isStarting: boolean, isFinal: boolean) {
        this.index = index;
        this.value = value;
        this.numberOfStates = numberOfStates;
        this.indexStates = indexStates;
        this.values = values;
        this.colors = color;
        this.isStarting = isStarting;
        this.isFinal = isFinal;
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {

        const position = this.getPosition(this.index, this.numberOfStates, 350, 200);

        let nodesGroup = svg.select<SVGGElement>("g.nodes");

        let edgesGroup = svg.select<SVGGElement>("g.edges");

        if (edgesGroup.empty()) {
            edgesGroup = svg.append("g").attr("class", "edges");
        }


        if (nodesGroup.empty()) {
            nodesGroup = svg.append("g").attr("class", "nodes");
        }

        //let finalNodeElement: <SVGLineElement, unknown, HTMLElement, any> | null = null;

        if (this.isFinal) {

            const x = nodesGroup.append("circle")
                .style("opacity", 1)
                .attr("cx", position.x)
                .attr("cy", position.y)
                .attr("r", 25)
                .attr("stroke", "black")
                .attr("class", "node")
                .attr("stroke-width", 2)
                .attr("fill", "white");
        }

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
            .style("fill", "black")
            .style("font-size", "20px")
            .text(this.value);

        const defs = svg.append("defs");

        let edges: d3.Selection<SVGLineElement, unknown, HTMLElement, any>[] = [];
        let noTransitionEdges: d3.Selection<SVGLineElement, unknown, HTMLElement, any>[] = [];
        let edgesLabels: d3.Selection<SVGTextElement, unknown, HTMLElement, any>[] = [];
        let paths: d3.Selection<SVGPathElement, unknown, HTMLElement, any>[] = []
        let pathLabels: d3.Selection<SVGTextElement, unknown, HTMLElement, any>[] = []

        for (let i = 0; i < this.values.length; i++) {

            const val = this.values[i];

            let txt = val.values[0];

            if (val.values.length > 1) {

                txt = "";

                let i = 0
                for (const v in val.values) {
                    txt += v

                    if (i < val.values.length - 1)
                        txt += ", "

                    i += 1
                }

            }

            const color = this.colors[val.state];

            const markerId = `arrow-${val.state}`;

            // Check if the marker already exists to avoid duplicates
            if (d3.select(`#${markerId}`).empty()) {
                defs.append("marker")
                    .attr("id", markerId)
                    .attr("viewBox", "0 0 10 10")
                    .attr("refX", 20)
                    .attr("refY", 5)
                    .attr("markerWidth", 3)
                    .attr("markerHeight", 3)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M0,0 L10,5 L0,10")
                    .attr("fill", `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
            }

            if (this.isStarting) {

                const edge = edgesGroup.append("line")
                    .attr("x1", position.x)
                    .attr("y1", position.y - 50)
                    .attr("x2", position.x)
                    .attr("y2", position.y)
                    .attr("stroke", "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")")
                    .attr("stroke-width", 5)
                    .style("opacity", 1)
                    .attr("marker-end", `url(#${markerId})`);

                noTransitionEdges.push(edge);
            }

            if (this.indexStates[val.state] != this.index) {

                const edge = edgesGroup.append("line")
                    .attr("x1", position.x)
                    .attr("y1", position.y)
                    .attr("x2", position.x)
                    .attr("y2", position.y)
                    .attr("stroke", "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")")
                    .attr("stroke-width", 5)
                    .style("opacity", 0)
                    .attr("marker-end", `url(#${markerId})`);

                const label = nodesGroup.append("text")
                    .attr("x", position.x)
                    .attr("y", position.y)
                    .attr("class", "label")
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .style("fill", "black")
                    .style("font-size", "20px")
                    .text(txt);

                edges.push(edge);
                edgesLabels.push(label)
            }
            else {

                const loopEdge = edgesGroup.append("path")
                    .attr("d", function() {
                        const radius = 0;
                        const angle = Math.PI / 4;
                        const x = position.x;
                        const y = position.y;

                        const arc = `M ${x + radius * Math.cos(angle)} ${y - radius * Math.sin(angle)} 
                    A ${radius} ${radius} 0 1 1 ${x + radius * Math.cos(-angle)} ${y - radius * Math.sin(-angle)} 
                    A ${radius} ${radius} 0 1 1 ${x + radius * Math.cos(angle)} ${y - radius * Math.sin(angle)}`;
                        return arc;
                    })
                    .attr("stroke", "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")")
                    .attr("stroke-width", 5)
                    .style("opacity", 1)
                    .attr("fill", "none")
                    //.attr("marker-end", "url(#arrow)");

                const label = nodesGroup.append("text")
                    .attr("x", position.x)
                    .attr("y", position.y)
                    .attr("class", "label")
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .style("fill", "black")
                    .style("font-size", "20px")
                    .text(txt);

                paths.push(loopEdge);
                pathLabels.push(label);
            }
        }

        const nodeTransition = nodeElement.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("cx", position.x)
            .attr("cy", position.y)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "white");

        const labelTransition = label.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("x", position.x)
            .attr("y", position.y)

        let edgeTransitionPromises : Promise<void>[] = [];
        let edgeLabelPromises : Promise<void>[] = [];
        let pathTransitionPromises : Promise<void>[] = [];
        let pathLabelPromises : Promise<void>[] = [];

        if (edges.length > 0) {

            for (let i = 0; i < edges.length; i++) {

                const edge = edges[i];
                const label = edgesLabels[i];

                const val = this.values[i];

                const pos = this.getPosition(this.indexStates[val.state], this.numberOfStates, 350, 200);
                const midX = (pos.x + position.x) / 2;
                const midY = (pos.y + position.y) / 2;

                const edgeTransition = edge.transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("x2", pos.x)
                    .attr("y2", pos.y)

                const labelTransition = label.transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("x", midX + 15)
                    .attr("y", midY + 15)

                edgeTransitionPromises.push(edgeTransition.end());
                edgeLabelPromises.push(labelTransition.end());
            }
        }

        if (paths.length > 0) {

            for (let i = 0; i < paths.length; i++) {

                const path = paths[i];
                const label = pathLabels[i];

                const pos = this.getPosition(this.index, this.numberOfStates, 350, 200);
                const midX = (pos.x + position.x) / 2;
                const midY = (pos.y + position.y) / 2;

                const loopEdgeTransition = path.transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("d", function() {
                        const radius = 20;
                        const angle = Math.PI / 2;
                        const x = pos.x + radius;  // Starting position on the x-axis
                        const y = pos.y;           // Starting position on the y-axis

                        // Create a new arc path that updates the loop position
                        const arc = `M ${x + radius * Math.cos(angle)} ${y - radius * Math.sin(angle)} 
                    A ${radius} ${radius} 0 1 1 ${x + radius * Math.cos(-angle)} ${y - radius * Math.sin(-angle)} 
                    A ${radius} ${radius} 0 1 1 ${x + radius * Math.cos(angle)} ${y - radius * Math.sin(angle)}`;

                        return arc;
                    })
                    //.attr("marker-end", "url(#arrow)");  // Ensure the arrow is placed correctly at the end of the loop

                const labelTransition = label.transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("x", midX + 25)
                    .attr("y", midY)

                pathTransitionPromises.push(loopEdgeTransition.end())
                pathLabelPromises.push(labelTransition.end())
            }

        }

        await Promise.all([nodeTransition.end(), labelTransition.end(), edgeTransitionPromises, pathTransitionPromises, edgeLabelPromises, pathLabelPromises]);
    }

    getPosition(index: number, numberOfStates: number, centerX: number, centerY: number, radius: number = 100) {
        const angle = (2 * Math.PI * index) / numberOfStates;

        // Calculate x and y coordinates using polar to Cartesian conversion
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return { x: x + centerX, y: y + centerY };
    }

}