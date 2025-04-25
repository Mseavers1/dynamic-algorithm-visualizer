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
        pathIdCounter = 0
    }

    async process(svg: Selection<BaseType, unknown, HTMLElement, any>): Promise<void> {
        const nodeTransitions: Promise<void>[] = [];
        const labelTransitions: Promise<void>[] = [];
        const linesGroup = svg.append("g").attr("id", "lines") as unknown as d3.Selection<SVGGElement, unknown, null, undefined>;

        const layoutCenterX = 350;
        const layoutCenterY = 200;

        const nodesGroup = (svg.append("g") as unknown) as Selection<SVGGElement, unknown, null, undefined>;

        let indexNodes: Map<string | number, [number, d3.Selection<SVGCircleElement, unknown, null, undefined>]> = new Map();
        let index = 0;
        const total = this.graph.get_nodes().size;

        // Draw all nodes
        this.graph.get_nodes().forEach((node, value) => {
            const pos = this.getPosition(index, total, layoutCenterX, layoutCenterY);
            const is_starting_node = this.graph.is_starting_node(value);
            const is_final_node = this.graph.is_final_node(value); // Get the final node status

            // Create the node(s) and get the selections
            const nodeSelections = this.createNode(nodesGroup, pos.x, pos.y, 20, "node", 0, is_final_node);

            const label = this.createLabel(nodesGroup, pos, value as string)

            // Apply transition to both the main circle and the outer ring
            const node_transition = this.applyNodeTransition(nodeSelections.mainCircle, nodeSelections.outerRing, pos);
            const label_transition = this.applyLabelTransition(label, pos);

            indexNodes.set(value, [index++, nodeSelections.mainCircle]);
            nodeTransitions.push(node_transition);
            labelTransitions.push(label_transition);

            // If node is a starting state, add a line to it pointing away from the center
            if (is_starting_node) {
                const startNodePos = pos;

                // Vector from layout center to starting node
                const vx = startNodePos.x - layoutCenterX;
                const vy = startNodePos.y - layoutCenterY;

                // Normalize the vector
                const magnitude = Math.sqrt(vx * vx + vy * vy);
                let unitVx = magnitude === 0 ? 0 : vx / magnitude;
                let unitVy = magnitude === 0 ? 0 : vy / magnitude;

                const angleDegrees = 80;
                const angleRadians = angleDegrees * (Math.PI / 180);

                const rotatedVx = unitVx * Math.cos(angleRadians) - unitVy * Math.sin(angleRadians);
                const rotatedVy = unitVx * Math.sin(angleRadians) + unitVy * Math.cos(angleRadians);

                const arrowLength = 50;

                // Arrow start (offset from the node in rotated direction)
                const arrowStartX = startNodePos.x + rotatedVx * arrowLength;
                const arrowStartY = startNodePos.y + rotatedVy * arrowLength;

                // Arrow end at the node
                const arrowEndX = startNodePos.x;
                const arrowEndY = startNodePos.y;

                this.createLine(value as string, "START", linesGroup, { x: arrowStartX, y: arrowStartY }, { x: arrowEndX, y: arrowEndY });
            }

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

                    // Loop arrow back to self - if value and pointer are equal
                    if (value == pointer.get_value()) {
                        // Calculate angle of the node from the layout center
                        const nodeAngle = Math.atan2(current_node_pos.y - layoutCenterY, current_node_pos.x - layoutCenterX);

                        const loopRadius = 40;
                        const angleOffset = Math.PI / 6;

                        let startAngleRad, endAngleRad;

                        startAngleRad = nodeAngle - angleOffset;
                        endAngleRad = nodeAngle + angleOffset;

                        // Calculate start and end points on the node's circumference
                        const startX = current_node_pos.x + 20 * Math.cos(startAngleRad);
                        const startY = current_node_pos.y + 20 * Math.sin(startAngleRad);
                        const endX = current_node_pos.x + 20 * Math.cos(endAngleRad);
                        const endY = current_node_pos.y + 20 * Math.sin(endAngleRad);

                        // Calculate control point for the arc
                        // Position the control point further out along the radial direction
                        const controlPointDistance = 20 + loopRadius * 2;
                        const controlX = current_node_pos.x + controlPointDistance * Math.cos(nodeAngle);
                        const controlY = current_node_pos.y + controlPointDistance * Math.sin(nodeAngle);

                        // SVG path data for a self-loop using a quadratic bezier curve (Q)
                        const pathData = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;

                        const uniqueId = `line-${value as string}-${pointer.get_value() as string}`;

                        let defs = linesGroup.select<SVGDefsElement>("defs");
                        if (defs.empty()) {
                            defs = linesGroup.append<SVGDefsElement>("defs");
                        }
                        defs.append("marker")
                            .attr("id", `arrow-${value as string}-${pointer.get_value() as string}`)
                            .attr("viewBox", "0 0 10 10")
                            .attr("refX", 28)
                            .attr("refY", 5)
                            .attr("markerWidth", 6)
                            .attr("markerHeight", 6)
                            .attr("orient", "auto-start-reverse")
                            .append("path")
                            .attr("d", "M 0 0 L 10 5 L 0 10 z")
                            .attr("fill", "black");

                        const selfLoopPath = linesGroup.append("path")
                            .attr("id", uniqueId)
                            .attr("d", pathData)
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", `url(#arrow-${value as string}-${pointer.get_value() as string})`);

                        // Create label for the self-loop
                        this.createLineLabel(linesGroup, selfLoopPath, weights as string[]);
                    }
                    else if (this.hasMutualPointer(value, pointer.get_value())){
                        const curvedPath = this.createCurvedLine(value as string, pointer.get_value() as string, linesGroup, current_node_pos, target_node_pos, 0.12);
                        this.createLineLabel(linesGroup, curvedPath, weights as string[]);
                    }
                    else
                    {
                        const straightLine = this.createLine(value as string, pointer.get_value() as string, linesGroup, current_node_pos, target_node_pos);
                        this.createLineLabel(linesGroup, straightLine as d3.Selection<SVGLineElement | SVGPathElement, unknown, null, undefined>, weights as string[]);
                    }
                });
            }
        });


        await Promise.all([...nodeTransitions, ...labelTransitions]);
    }

    // Creates a label for a line (edge) {Mostly generated through gpt and gemini -- edited by michael}
    createLineLabel(
        group: d3.Selection<SVGGElement, unknown, null, undefined>,
        lineOrPath: d3.Selection<SVGLineElement | SVGPathElement, unknown, null, undefined>,
        txts: string[]
    ): d3.Selection<SVGTextElement, unknown, null, undefined>[] {

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
                    .attr("xlink:href", `#${pathId}`)
                    .attr("startOffset", `${startOffset}%`)
                    .attr("text-anchor", "middle")
                    .text(txt);
            }
            createdLabels.push(text);
        });

        return createdLabels;
    }

    hasMutualPointer(from: string | number, to: string | number): boolean {
        const fromPointers = this.graph.get_pointers(from);
        const toPointers = this.graph.get_pointers(to);

        if (!fromPointers || !toPointers) return false;

        // Compare the node values (not the FA_Node instances)
        const fromPointsTo = Array.from(fromPointers.keys()).some(p => p.get_value() === to);
        const toPointsTo = Array.from(toPointers.keys()).some(p => p.get_value() === from);

        return fromPointsTo && toPointsTo;
    }


    createCurvedLine(
        nodeFrom: string,
        nodeTo: string,
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

        const uniqueId = `line-${nodeFrom}-${nodeTo}`;

        let defs = group.select<SVGDefsElement>("defs");
        if (defs.empty()) {
            defs = group.append<SVGDefsElement>("defs");
        }

        defs.append("marker")
            .attr("id", `arrow-${nodeFrom}-${nodeTo}`)
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 28)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        return group.append("path")
            .attr("id", uniqueId)
            .attr("d", pathData)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", `url(#arrow-${nodeFrom}-${nodeTo})`);
    }

    createLine(
        nodeFrom: String,
        nodeTo: String,
        svgGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
        start: { x: number; y: number },
        end: { x: number; y: number },
        strokeColor: string = "black",
        strokeWidth: number = 2,
        opacity: number = 1
    ): d3.Selection<SVGLineElement, unknown, null, undefined> {
        const uniqueId = `line-${nodeFrom}-${nodeTo}`;

        let defs = svgGroup.select<SVGDefsElement>("defs");
        if (defs.empty()) {
            defs = svgGroup.append<SVGDefsElement>("defs");
        }

        defs.append("marker")
            .attr("id", `arrow-${nodeFrom}-${nodeTo}`)
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 28)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        return svgGroup.append("line")
            .attr("id", uniqueId)
            .attr("x1", start.x)
            .attr("y1", start.y)
            .attr("x2", end.x)
            .attr("y2", end.y)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .style("opacity", opacity)
            .attr("marker-end", `url(#arrow-${nodeFrom}-${nodeTo})`);
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


    createNode(
        nodesGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
        cx: number,
        cy: number,
        r: number = 20,
        className: string = "node",
        initialOpacity: number = 0,
        isFinalNode: boolean = false
    ): { mainCircle: d3.Selection<SVGCircleElement, unknown, null, undefined>, outerRing?: d3.Selection<SVGCircleElement, unknown, null, undefined> } {

        // Create the main node circle
        const mainCircle = nodesGroup.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r)
            .attr("class", className)
            .style("opacity", initialOpacity);

        let outerRing: d3.Selection<SVGCircleElement, unknown, null, undefined> | undefined = undefined;

        // If it's a final node, add a second circle with a larger radius
        if (isFinalNode) {
            const outerRadius = r + 5;
            outerRing = nodesGroup.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", outerRadius)
                .attr("class", className + " final-node-ring")
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("opacity", initialOpacity);
        }

        // Return an object containing both selections
        return { mainCircle, outerRing };
    }

    applyNodeTransition(
        mainCircle: d3.Selection<SVGCircleElement, unknown, null, undefined>,
        outerRing: d3.Selection<SVGCircleElement, unknown, null, undefined> | undefined, // Accept the optional outer ring
        position: { x: number; y: number },
        duration: number = 1000
    ): Promise<void> {
        return new Promise((resolve) => {

            const mainCircleTransition = mainCircle.transition()
                .duration(duration)
                .attr("cx", position.x)
                .attr("cy", position.y)
                .style("opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("fill", "white");

            // If an outer ring exists, apply the same transition to it
            if (outerRing) {
                outerRing.transition()
                    .duration(duration)
                    .attr("cx", position.x)
                    .attr("cy", position.y)
                    .style("opacity", 1);
            }

            mainCircleTransition.on("end", () => resolve());
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