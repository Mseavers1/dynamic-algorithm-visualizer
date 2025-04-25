import {Instruction} from "./i_instruction";
import {BaseType, Selection} from "d3";
import {FA_Graph} from "../structures/fa_graph";
import {FA_Node} from "../structures/fa_node";

// Counter to generate unique IDs for curved paths
let pathIdCounter = 0;

export class FAAddAllInstruction implements Instruction {

    private graph: FA_Graph;

    constructor(graph: FA_Graph) {
        this.graph = graph;
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        const nodeTransitions: Promise<void>[] = [];
        const labelTransitions: Promise<void>[] = [];
        // Ensure the 'lines' group is added first so lines are behind nodes and labels
        const linesGroup = svg.append("g").attr("id", "lines") as unknown as d3.Selection<SVGGElement, unknown, null, undefined>;

        const nodesGroup = (svg.append("g") as unknown) as Selection<SVGGElement, unknown, null, undefined>;

        let indexNodes: Map<string | number, [number, d3.Selection<SVGCircleElement, unknown, null, undefined>]> = new Map();
        let index = 0;
        const total = this.graph.get_nodes().size;

        // Draw all nodes
        this.graph.get_nodes().forEach((node, value) => {
            const pos = this.getPosition(index, total, 350, 200);
            const current_node = this.createNode(nodesGroup, pos.x, pos.y);
            const label = this.createLabel(nodesGroup, pos, value as string)
            const node_transition = this.applyNodeTransition(current_node, pos);
            const label_transition = this.applyLabelTransition(label, pos);

            indexNodes.set(value, [index++, current_node]);
            nodeTransitions.push(node_transition);
            labelTransitions.push(label_transition);
        });

        // Draw connectors
        this.graph.get_nodes().forEach((node, value) => {

            let pointers = this.graph.get_pointers(value);

            if (pointers != null && pointers.size > 0) {

                const entry = indexNodes.get(value);
                if (!entry) return; // safety check

                const [index, currentNode] = entry;
                const current_node_pos = this.getPosition(index, total, 350, 200);

                pointers.forEach((weights, pointer) => {
                    const targetEntry = indexNodes.get(pointer.get_value());
                    if (!targetEntry) return;

                    const [targetIndex, _] = targetEntry;
                    const target_node_pos = this.getPosition(targetIndex, total, 350, 200);

                    if (this.hasMutualPointer(value, pointer.get_value())){
                        const curvedPath = this.createCurvedLine(linesGroup, current_node_pos, target_node_pos, 0.12);
                        // Pass the curved path selection to createLineLabel
                        this.createLineLabel(linesGroup, curvedPath, weights as string[]);
                    }
                    else
                    {
                        const straightLine = this.createLine(linesGroup, current_node_pos, target_node_pos);
                        // Use a type assertion here to tell TypeScript it's the correct union type
                        this.createLineLabel(linesGroup, straightLine as d3.Selection<SVGLineElement | SVGPathElement, unknown, null, undefined>, weights as string[]);
                    }
                });
            }
        });


        await Promise.all([...nodeTransitions, ...labelTransitions]);
    }

    // Creates a label for a line (edge) {Mostly generated through gpt and gemini -- edited by michael}
    // Creates labels for a line (edge) - handles multiple weights
    createLineLabel(
        group: d3.Selection<SVGGElement, unknown, null, undefined>,
        lineOrPath: d3.Selection<SVGLineElement | SVGPathElement, unknown, null, undefined>,
        txts: string[] // Accept an array of strings
    ): d3.Selection<SVGTextElement, unknown, null, undefined>[] { // Return an array of text selections

        const isLine = lineOrPath.node() instanceof SVGLineElement;
        const createdLabels: d3.Selection<SVGTextElement, unknown, null, undefined>[] = [];

        txts.forEach((txt, index) => {
            // Append a text element for each weight
            const text = group.append("text")
                .style("fill", "red")
                .style("font-size", "16px")
                .style("pointer-events", "none");

            if (isLine) {
                const line = lineOrPath as d3.Selection<SVGLineElement, unknown, null, undefined>;
                const x1 = parseFloat(line.attr("x1"));
                const y1 = parseFloat(line.attr("y1"));
                const x2 = parseFloat(line.attr("x2"));
                const y2 = parseFloat(line.attr("y2"));

                // Calculate midpoint
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2 - 10;

                // Calculate perpendicular offset
                const dx = x2 - x1;
                const dy = y2 - y1;
                const lineLength = Math.sqrt(dx * dx + dy * dy);
                // Add a small check for zero length to avoid division by zero
                const offsetX = lineLength === 0 ? 0 : (-dy / lineLength);
                const offsetY = lineLength === 0 ? 0 : (-dx / lineLength);

                // Adjust position based on the index for multiple labels
                const labelSpacing = 15; // Adjust this value for desired spacing
                const totalOffset = (index - (txts.length - 1) / 2) * labelSpacing; // Center the labels around the midpoint

                text.attr("x", midX + offsetX * totalOffset)
                    .attr("y", midY + offsetY * totalOffset)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .text(txt);

            } else {
                const path = lineOrPath as d3.Selection<SVGPathElement, unknown, null, undefined>;
                const pathId = path.attr("id");

                // Adjust startOffset for each label along the curve
                const startOffset = (80 - (txts.length - 1) * 2) + ((index - (txts.length - 1) / 2) * 5);

                text.append("textPath")
                    .attr("xlink:href", `#${pathId}`) // Use the ID directly
                    .attr("startOffset", `${startOffset}%`)
                    .attr("text-anchor", "middle")
                    .text(txt);
            }
            createdLabels.push(text);
        });

        return createdLabels; // Return the array of created labels
    }

    hasMutualPointer(from: string | number, to: string | number): boolean {
        const fromPointers = this.graph.get_pointers(from);
        const toPointers = this.graph.get_pointers(to);

        if (!fromPointers || !toPointers) return false;

        // Console logs can be removed in production code
        // console.log("From Node:", this.graph.get_node(from));
        // console.log("To Node:", this.graph.get_node(to));
        // console.log("From Pointers:", fromPointers);
        // console.log("To Pointers:", toPointers);
        // console.log("From has To?", fromPointers.has(this.graph.get_node(to) as FA_Node));
        // console.log("To has From?", toPointers.has(this.graph.get_node(from) as FA_Node));

        return fromPointers.has(this.graph.get_node(to) as FA_Node) && toPointers.has(this.graph.get_node(from) as FA_Node);
    }


    createCurvedLine(
        group: d3.Selection<SVGGElement, unknown, null, undefined>,
        from: { x: number, y: number },
        to: { x: number, y: number },
        curvature: number = 0.3
    ): d3.Selection<SVGPathElement, unknown, null, undefined> {

        // Midpoint between from and to
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;

        // Offset for the curve (perpendicular to the line)
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const norm = Math.sqrt(dx * dx + dy * dy);
        const offsetX = -dy * curvature;
        const offsetY = dx * curvature;

        const controlX = midX + offsetX;
        const controlY = midY + offsetY;

        const pathData = `M ${from.x} ${from.y} Q ${controlX} ${controlY}, ${to.x} ${to.y}`;

        const uniqueId = `curved-path-${pathIdCounter++}`; // Generate a unique ID

        return group.append("path")
            .attr("id", uniqueId) // Assign the unique ID
            .attr("d", pathData)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");
    }

    createLine(
        svgGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
        start: { x: number; y: number },
        end: { x: number; y: number },
        strokeColor: string = "black",
        strokeWidth: number = 2,
        opacity: number = 1
    ): d3.Selection<SVGLineElement, unknown, null, undefined> {
        return svgGroup.append("line")
            .attr("x1", start.x)
            .attr("y1", start.y)
            .attr("x2", end.x)
            .attr("y2", end.y)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .style("opacity", opacity)
            .attr("marker-end", "url(#arrow)");
    }


    createLabel(nodesGroup: d3.Selection<SVGGElement, unknown, null, undefined>, position: { x: number, y: number }, txt: string): d3.Selection<SVGTextElement, unknown, null, undefined> {
        return nodesGroup.append("text")
            .attr("x", position.x)
            .attr("y", position.y)
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", "black")
            .style("font-size", "20px")
            .text(txt);
    }


    createNode(nodesGroup: d3.Selection<SVGGElement, unknown, null, undefined>, cx: number, cy: number, r: number = 20,
               className: string = "node", opacity: number = 0
    ): d3.Selection<SVGCircleElement, unknown, null, undefined> {

        return nodesGroup.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r)
            .attr("class", className)
            .style("opacity", opacity);
    }

    applyNodeTransition(
        node: d3.Selection<SVGCircleElement, unknown, null, undefined>,
        position: { x: number; y: number },
        duration: number = 1000
    ): Promise<void> {
        return new Promise((resolve) => {
            node.transition()
                .duration(duration)
                .attr("cx", position.x)
                .attr("cy", position.y)
                .style("opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("fill", "white")
                .on("end", () => resolve());
        });
    }

    applyLabelTransition(
        label: d3.Selection<SVGTextElement, unknown, null, undefined>,
        position: { x: number; y: number },
        duration: number = 1000
    ): Promise<void> {
        return new Promise((resolve) => {
            label.transition()
                .duration(duration)
                .style("opacity", 1)
                .attr("x", position.x)
                .attr("y", position.y)
                .on("end", () => resolve());
        });
    }


    // Gets the position in a shaped form
    getPosition(index: number, numberOfNodes: number, centerX: number, centerY: number, radius: number = 150) {
        const angle = (2 * Math.PI * index) / numberOfNodes;

        // Calculate x and y coordinates using polar to Cartesian conversion
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return { x: x + centerX, y: y + centerY };
    }

}